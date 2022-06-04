import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons';
import localStrings from '../../localStrings';
import useAuth from "@hook/useAuth";
import {
  BOOKING_SLOT_OCCUPANCY_COLLECTION,
  BRAND_COLLECTION, ESTABLISHMENT_COLLECTION,
  ORDER_DELIVERY_MODE_ALL,
  ORDER_DELIVERY_MODE_DELIVERY,
  ORDER_DELIVERY_MODE_PICKUP_ON_SPOT, RELOAD_COLLECTION
} from "../../util/constants";
import {IconButton, Typography} from "@material-ui/core";
import {computePriceDetail, firstOrCurrentEstablishment} from "../../util/displayUtil";
import Grid from "@material-ui/core/Grid";
import BazarButton from "@component/BazarButton";
import {getBookingSlotsOccupancyQueryNoApollo} from "../../gqlNoApollo/bookingSlotsOccupancyGqlNoApollo";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import firebase from "../../lib/firebase";
import config from "../../conf/config.json";
import {reloadId} from "@context/FirebaseAuthContext";
import {useCollectionData} from "react-firebase-hooks/firestore";

const setHourFromString = (momentDate, hourSt) => {
  let hourSplit = hourSt.split(':');
  let dateClone = moment(momentDate);
  return moment(dateClone.set({hour:hourSplit[0],minute:hourSplit[1], second:0,millisecond:0}));
}

function getDaySettings(establishment, dowString, inverseOrder) {
  return establishment?.serviceSetting && establishment.serviceSetting.daySetting &&
      establishment.serviceSetting.daySetting.filter(item => item.day === dowString)
          .sort((setting1, setting2) => {
            let val1 = parseInt(setting1.startHourBooking.replace(':', ''));
            let val2 = parseInt(setting2.startHourBooking.replace(':', ''));
            return inverseOrder ? (val2 - val1) : (val1 - val2);
          });
}

const buildServiceFromDaySetting = (daySetting) => {
  return {
    dateStart: setHourFromString(daySetting.dateCurrent, daySetting.startHourBooking),
    //dateEnd: setHourFromString(daySetting.dateCurrent, daySetting.endHourBooking),
    endHourService: setHourFromString(daySetting.dateCurrent, daySetting.endHourService),
    numberOfDeliveryMan: daySetting.numberOfDeliveryMan,
    maxDeliveryPerSlotPerMan: daySetting.maxDeliveryPerSlotPerMan,
    maxPreparationTimePerSlot: daySetting.maxPreparationTimePerSlot,
  }
}

const getDowStringFromDowInt = (dow) => {
  let dowString = null;
  switch (dow) {
    case 0:
      dowString = "sunday";
      break;
    case 1:
      dowString = "monday";
      break;
    case 2:
      dowString = "tuesday";
      break;
    case 3:
      dowString = "wenesday";
      break;
    case 4:
      dowString = "thursday";
      break;
    case 5:
      dowString = "friday";
      break;
    case 6:
      dowString = "saturday";
      break;
    case 7:
      dowString = "sunday";
      break;
    default:
      dowString = "";
  }
  return dowString
}

function isClosed(startDate, establishment) {
  if (!establishment.serviceSetting.closingSlots) {
    return false;
  }
  return (establishment.serviceSetting.closingSlots.some(closingSlot => {
    let startClose = moment.unix(closingSlot.startDate);
    let endClose = moment.unix(closingSlot.endDate);
    return startDate.isBefore(endClose) && startDate.isAfter(startClose)
  }));
}

function getOffset(deliveryMode, establishment) {
  if (!deliveryMode || !establishment) {
    return 0;
  }
  let slotDuration = establishment.serviceSetting?.slotDuration || 20;

  //let offset = 0
  if (deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
    return (establishment.serviceSetting.minimalSlotNumberBooking || 0) * slotDuration;
  } else if (deliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
    return (establishment.serviceSetting.minimalSlotNumberBookingNoDelivery || 0) * slotDuration;
  } else {
    return 0;
  }
}


function getSlot(startDate, endDate, firstDaySetting, getBookingSlotsOccupancy, orderInCreation) {
  if (!getBookingSlotsOccupancy()) {
    return false;
  }
  let slot = getBookingSlotsOccupancy().find(item => {
    return item.startDate == startDate.unix() &&
        item.endDate == endDate.unix() &&
        item.deliveryMode == orderInCreation().deliveryMode
  })
  return slot;
}

export const LUNCH_PERIOD = "lunch";
export const DINNER_PERIOD = "dinner";

export const getCurrentService = (establishment, startDate, deliveryMode) => {
  let daySettings = getWeekDaySettingsFromDate(startDate, establishment, null, deliveryMode );
  if (daySettings && daySettings.length > 0) {
    let firstDaySetting = daySettings[0];
    let service = buildServiceFromDaySetting(firstDaySetting);

    let day = startDate.day();
    let lunchSeparator = establishment?.serviceSetting?.lunchDinnerSeparator || "16:00";
    //var duration = moment.duration(service.endHourService.diff(moment(service.endHourService.startOf('day'))));

    let lunchSeparatorData=lunchSeparator.split(':');
    let durationMinutesSeparator = parseInt(lunchSeparatorData[0]) * 60 + parseInt(lunchSeparatorData[1]);
    let timePeriod;

    let durationStartService = service.dateStart.hour() * 60 + service.dateStart.minutes();

    if (durationStartService <= durationMinutesSeparator) {
      timePeriod = LUNCH_PERIOD;
    }
    else {
      timePeriod = DINNER_PERIOD;
    }


    return {
      ...service,
      dow: {
        day: day,
        service: timePeriod
      },
    };
  }
  return null;
}

function getSlotDuration(establishment) {
  return establishment.serviceSetting.slotDuration || 20;
}

export const buildTimeSlots = (establishment, getBookingSlotsOccupancy, orderInCreation, startDate, deliveryMode) => {
  if (startDate) {
    let slotDuration = getSlotDuration(establishment);
    //let offset = getOffset(deliveryMode, establishment);
    let daySettings = getWeekDaySettingsFromDate(moment(startDate), establishment, null, orderInCreation().deliveryMode).filter(item => {
      return !item.deliveryMode || item.deliveryMode === deliveryMode
    });

    let allSlots = [];

    if (daySettings && daySettings.length > 0) {
      let firstDaySetting = daySettings[0];
      if (firstDaySetting.slotDuration) {
        slotDuration = firstDaySetting.slotDuration
      }

      let iterDate = setHourFromString(moment(firstDaySetting.dateCurrent), firstDaySetting.startHourBooking);
      let endServiceDate = setHourFromString(moment(firstDaySetting.dateCurrent), firstDaySetting.endHourService);

      while (iterDate.isBefore(endServiceDate)) {
        let startDate = moment(iterDate);
        let endDate = moment(iterDate).add(slotDuration, 'minutes');
        let slotOccupancy = getSlot(startDate, endDate, firstDaySetting, getBookingSlotsOccupancy, orderInCreation);
        allSlots.push({
          startDate: startDate,
          endDate: endDate,
          closed: isClosed(startDate, establishment),
          totalPreparionTime: slotOccupancy?.totalPreparationTime || 0,
          deliveryNumber: slotOccupancy?.deliveryNumber || 0,
          locked: slotOccupancy?.locked
        })
        iterDate = moment(iterDate.add(slotDuration, 'minutes'));
      }
    }


    let service = daySettings.length > 0 && buildServiceFromDaySetting(daySettings[0]);
    let previousService;

    let previousDaySetting = getPreviousDaySettingsFromDate(startDate, establishment);
    if (previousDaySetting) {
      previousService = buildServiceFromDaySetting(previousDaySetting)
    }
    let nextService = daySettings.length > 1 ? buildServiceFromDaySetting(daySettings[1]) : null

    return {
      //serviceSetting
      allSlots: allSlots,
      nextService: nextService,
      service: service,
      previousService: previousService,
    }
  }
  return {}
}

function getWeekDaySettingsFromDate(dateStart, establishment, limit, deliveryMode) {
  let dateCurrent = moment(dateStart);
  let allDaySettings = [];
  for (let i = 1; i < 15; i++) {
    let daySettings = getDaySettings(establishment, getDowStringFromDowInt(dateCurrent.day())) || [];
    for (let j = 0; j< daySettings.length; j++) {
      let daySetting = daySettings[j];
      if (daySetting.deliveryMode != null
          && daySetting.deliveryMode !== ORDER_DELIVERY_MODE_ALL
          && daySetting.deliveryMode !== deliveryMode) {
        continue;
      }

      if (!limit || allDaySettings.length < limit) {
        if (daySetting.limitHourEligibility && dateCurrent.isSame(dateStart, 'day'))
        {
          if (setHourFromString(dateStart, daySetting.limitHourEligibility).isBefore( moment(dateStart))) {
            continue;
          }
        }
        let dateToCompare = moment(dateCurrent);
        dateToCompare = setHourFromString(dateToCompare, daySetting.endHourService)
        if (dateCurrent.isBefore(dateToCompare)) {
          allDaySettings.push({
            ...daySetting,
            dateCurrent: dateCurrent,
          });
        }
      }
    }
    dateCurrent = moment(dateStart).add(i, 'days').set({ hour: 0, minute: 0 });
  }
  return allDaySettings;
}


function getPreviousDaySettingsFromDate(dateStart, establishment, limit) {
  let dateCurrent = moment(dateStart);
  let currentDate = moment()
  let allDaySettings = [];
  for (let i = 1; i < 9; i++) {
    let daySettings = getDaySettings(establishment, getDowStringFromDowInt(dateCurrent.day()), true);
    for (let j=0; j<daySettings.length; j++) {
      let daySetting = daySettings[j];
      if (!limit || allDaySettings.length < limit) {
        let dateToCompare = moment(dateCurrent);
        setHourFromString(dateToCompare, daySetting.endHourService)
        if (dateToCompare.isBefore(currentDate)) {
          return null;
        }

        if (dateToCompare.isBefore(dateStart)) {
          return {
            ...daySetting,
            dateCurrent: dateCurrent,
          };
        }
      }
    }
    dateCurrent = moment(dateStart).add(-i, 'days').set({ hour: 0, minute: 0 });
  }
  return null;
}

function BookingSlots({contextData, selectCallBack, startDateParam, deliveryMode,
                        selectedKeyParam, setterSelectedKey, brandId, disableNextDay}) {

  const {currentEstablishment, getOrderInCreation
    , bookingSlotStartDate, setBookingSlotStartDate, orderInCreation, currentBrand} = useAuth();

  const currentEstablishmentOrFirst = () => {
    return firstOrCurrentEstablishment(currentEstablishment, contextData);
  }

  const db = firebase.firestore();

  const [bookingSlotsOccupancyData, loading, error] =
      useCollectionData(
          db.collection(BRAND_COLLECTION)
              .doc(config.brandId)
              .collection(ESTABLISHMENT_COLLECTION)
              .doc(currentEstablishmentOrFirst().id)
              .collection(BOOKING_SLOT_OCCUPANCY_COLLECTION)
              .where('endDate', '>=', moment().unix())
              //.where('endDate', '<=', getEndDateSeconds())
          ,
          {
            snapshotListenOptions: { includeMetadataChanges: true },
          }
      );

  // db.collection(BRAND_COLLECTION)
  //     .doc(config.brandId)
  //     .collection(ESTABLISHMENT_COLLECTION)
  //     .doc(currentEstablishmentOrFirst().id)
  //     .collection(BOOKING_SLOT_OCCUPANCY_COLLECTION)
  //     .onSnapshot((doc) => {
  //       //console.log(doc.data());
  //     });

  //const [bookingSlotStartDate, setBookingSlotStartDate] = useState(startDateParam);

  //const [bookingSlotsOccupancy, setBookingSlotsOccupancy] = useState([]);
  //const [offset, setOffset] = useState(null);
  const [reload, setReload] = useState(true);
  const [timeSlots, setTimeSlots] = useState(null);
  // const [slotSelected, setSlotSelected] = useState(false);


  const select = (value) => {
    if (selectCallBack) {
      selectCallBack(value);
      //setSlotSelected(true);
    }
  };


  // useEffect(() => {
  //   let offset = getOffset(getOrderInCreation().deliveryMode, currentEstablishmentOrFirst());
  //   setOffset(offset)
  // }, [getOrderInCreation().deliveryMode])

  // useEffect(async () => {
  //   if (currentEstablishmentOrFirst()) {
  //     let res = await getBookingSlotsOccupancyQueryNoApollo(brandId, currentEstablishmentOrFirst().id);
  //     setBookingSlotsOccupancy(res.getBookingSlotsOccupancyByBrandIdAndEstablishmentId);
  //   }
  // }, [currentEstablishmentOrFirst()])

  useEffect(() => {
    let timeSlotsData = buildTimeSlots(currentEstablishmentOrFirst(), () => bookingSlotsOccupancyData, getOrderInCreation,
        moment(), deliveryMode);
    setTimeSlots(timeSlotsData);
  }, [getOrderInCreation().deliveryMode, deliveryMode, bookingSlotsOccupancyData])

  useEffect(async () => {
    const interval = setInterval(async () => {

      let timeSlotsData = buildTimeSlots(currentEstablishmentOrFirst(), () => bookingSlotsOccupancyData, getOrderInCreation,
          moment(), deliveryMode);
      setTimeSlots(timeSlotsData);
      // if (currentEstablishmentOrFirst()) {
      //   let res = await getBookingSlotsOccupancyQueryNoApollo(brandId, currentEstablishmentOrFirst().id);
      //   setBookingSlotsOccupancy(res.getBookingSlotsOccupancyByBrandIdAndEstablishmentId);
      // }
    }, parseInt(process.env.REFRESH_SLOTS_OCCUPANCY) || 120000);
    return () => clearInterval(interval);
  }, []);

  function getBookingSlotsOccupancy() {
    return bookingSlotsOccupancyData;
  }

  function selectFirstSlot() {
    if (allClosed()) {
      select(null)
    } else if (select && currentBrand() && timeSlots && timeSlots.allSlots &&
        timeSlots.allSlots.length > 0 && !orderInCreation.bookingSlot) {
      let firstSlotAvail = timeSlots.allSlots.find(slot => slotInTime(slot) && !isSlotUnavailable(slot) && slotAlavailableInMode(slot));
      if (firstSlotAvail) {
        select(firstSlotAvail)
      }
    }
  }

  useEffect(() => {
    selectFirstSlot();
  }, [getOrderInCreation().deliveryMode, getOrderInCreation().bookingSlot])


  useEffect(() => {
    let interval = setInterval(() => {
      setReload(false);
      setReload(true);
    }, parseInt(process.env.REFRESH_SLOTS_TIMEFRAME) || 120000);

    // returned function will be called on component unmount
    return () => {
      clearInterval(interval);
    }
  }, [])

  if (currentEstablishment && currentEstablishmentOrFirst() && !currentEstablishmentOrFirst()?.serviceSetting?.daySetting) {
    return (
        <div>
          <h3>{localStrings.check.noDaySetting}</h3>
        </div>
    )
  }


  function changeDateNext(nextService, currentService) {
    setBookingSlotStartDate(nextService.dateStart);
  }

  function changeDatePrevious(previousService) {
    //setPreviousService(currentService)
    setBookingSlotStartDate(previousService.dateStart);
  }

  function isSelectedSlot (slot) {
    //return false;
    if (!getOrderInCreation()?.bookingSlot)
    {
      return false;
    }
    if (getOrderInCreation()?.bookingSlot?.startDate == null) {
      return false;
    }
    if (getOrderInCreation()?.bookingSlot?.endDate == null) {
      return false;
    }
    let selected = getOrderInCreation().bookingSlot != null &&
        getOrderInCreation()?.bookingSlot?.startDate?.isSame(slot.startDate) &&
        getOrderInCreation()?.bookingSlot?.endDate?.isSame(slot.endDate);
    return selected;
  }



  function formatService(service) {
    if (!service) {
      return "-";
    }
    return service.dateStart.locale('fr').calendar() + " - " + service.endHourService.format("HH:mm");
  }

  function allClosed() {
    if (!timeSlots?.allSlots || timeSlots?.allSlots.length == 0) {
      return false;
    }
    let allClosed = true;
    for (let i = 0; i < timeSlots.allSlots.length; i++) {
      const timeSlot = timeSlots.allSlots[i];
      allClosed &= (timeSlot.closed)
    }
    return allClosed;
  }

  function getFirstSlotInFuture() {
    return timeSlots.allSlots.find(slot => slot.startDate.isAfter());
  }

  function slotAlavailableInMode(slot) {
    let firstSlotInFuture = getFirstSlotInFuture();

    if (!firstSlotInFuture) {
      return false;
    }
    //if (orderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
    let minimalSlotDiff = 0;
    if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      minimalSlotDiff = currentEstablishmentOrFirst().serviceSetting.minimalSlotNumberBooking
    }
    else if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
      minimalSlotDiff = currentEstablishmentOrFirst().serviceSetting.minimalSlotNumberBookingNoDelivery
    }
    let slotDuration = getSlotDuration(currentEstablishmentOrFirst());
    //let minTime =
    let diffMinutes = slot.startDate.diff(moment(), 'minutes');
    return diffMinutes > minimalSlotDiff * slotDuration
    //return  timeSlots.allSlots.indexOf(slot) - timeSlots.allSlots.indexOf(firstSlotInFuture) >= minimalSlotDiff;

    //}

  }

  function slotInTime(slot) {
    return slot.startDate.isAfter();
  }


  function enoughTimeForPreparation(slot) {
    let firstSlotInFuture = getFirstSlotInFuture();
    if (!firstSlotInFuture) {
      return false;
    }
    let cumulRemainingTime = 0;
    let indexStart = timeSlots.allSlots.indexOf(firstSlotInFuture);
    let indexEnd = timeSlots.allSlots.indexOf(slot);

    if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      indexEnd--
    }
    indexEnd = Math.max(indexEnd, 0);

    const maxPreparationPerSlot = timeSlots.service.maxPreparationTimePerSlot;
    for (let i = indexStart; i <= indexEnd; i++) {
      const slotIter = timeSlots.allSlots[i];
      cumulRemainingTime += maxPreparationPerSlot - slotIter.totalPreparionTime;
    }

    let priceDetail = computePriceDetail(getOrderInCreation());
    //console.log("priceDetail " + JSON.stringify(priceDetail, null, 2))
    let enoughTime = cumulRemainingTime >= priceDetail.totalPreparationTime;
    if (!enoughTime && isSelectedSlot(slot)) {
      if (selectCallBack) {
        selectCallBack(null);
      }
    }
    return enoughTime;
    //return true;
  }

  function isSlotFull(slot) {
    if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {

      if (timeSlots.service.maxDeliveryPerSlotPerMan == 0 && timeSlots.service.maxDeliveryPerSlotPerMan == 0) {
        return false;
      }

      let maxPreparationPerSlot = (timeSlots.service.maxDeliveryPerSlotPerMan || 0) *
          (timeSlots.service.numberOfDeliveryMan || 0);
      return slot.deliveryNumber >= maxPreparationPerSlot;
    }
    return false;
  }

  function isSlotUnavailable(value) {
    if (currentEstablishment()?.serviceSetting?.orderSameDay) {
      if (!value.startDate.isSame(moment(), 'day')) {
        return true;
      }
    }
    return !enoughTimeForPreparation(value) || isSlotFull(value) || value.locked;
  }

  function getSelectTimeSlotText() {

    let timeSlotsAvail = (timeSlots?.allSlots || []).filter(slot => slotInTime(slot) && slotAlavailableInMode(slot));
    let timeSlotSelected = orderInCreation.bookingSlot

    if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      if (timeSlotSelected && timeSlotsAvail.length === 1) {
        return localStrings.timeSlot;
      }
      return localStrings.selectDeliveryTimeSlot
    }

    if (timeSlotSelected && timeSlotsAvail.length === 1) {
      return localStrings.pickupSlot;
    }
    return localStrings.selectPickupTimeSlot;
  }

  return (
      <div>

        <Typography fontWeight="600" mb={2} variant="h5">
          {getSelectTimeSlotText()}
        </Typography>

        {/*<p>{JSON.stringify(timeSlots)}</p>*/}
        {/*<p>{timeSlots.allSlots.length}</p>*/}
        {/*<p>{offset}</p>*/}
        {bookingSlotStartDate && reload &&
        // <>
        <div style={{ width: '100%' }}>
          {/*<p>{JSON.stringify(bookingSlotsOccupancyData)}</p>*/}

          <Box
              display="flex"
              m={1}>
            {!disableNextDay &&
            <Box>
              <IconButton fontSize="small"
                          onClick={() => changeDatePrevious(timeSlots.previousService)}
                          disabled={!timeSlots || timeSlots.previousService == null}
              >
                <ArrowBackIos />
              </IconButton>
            </Box>
            }
            <Box flexGrow={1}
                 alignItems="center"
                 justify="center"
            >
              <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  style={{ marginTop: '12px' }}
              >
                {timeSlots &&
                <Grid item>
                  {formatService(timeSlots.service)}
                </Grid>
                }

              </Grid>
            </Box>
            {!disableNextDay &&
            <Box>
              <IconButton fontSize="small"
                          onClick={() => changeDateNext(timeSlots.nextService, timeSlots.service)}
                          disabled={!timeSlots || timeSlots.nextService == null}
              >
                <ArrowForwardIos/>
              </IconButton>
            </Box>
            }
          </Box>
          {/*</div>*/}


          {getOrderInCreation().deliveryMode && timeSlots && timeSlots.allSlots &&
              (!timeSlots.allSlots.find(slot => !isSlotUnavailable(slot)) || timeSlots.allSlots.length === 0 ||
              timeSlots.allSlots.filter(value => slotInTime(value) && slotAlavailableInMode(value)).length == 0
          ) &&

          <Box
              display="flex"
              flexWrap="wrap"
              alignContent="flex-start"
              justifyContent="center"
              p={1}
              m={1}
          >
            <AlertHtmlLocal severity="warning" content={localStrings.noAvail}></AlertHtmlLocal>
          </Box>
          }

          {!getOrderInCreation().deliveryMode &&

              <Box
                  display="flex"
                  flexWrap="wrap"
                  alignContent="flex-start"
                  justifyContent="center"
                  p={1}
                  m={1}
              >
                <AlertHtmlLocal severity="warning" content={localStrings.selectDeliveryModesToGetSlots}></AlertHtmlLocal>
              </Box>
          }

          <Box
              display="flex"
              flexWrap="wrap"
              alignContent="flex-start"
              justifyContent="center"
              p={1}
              m={1}
          >

            {allClosed() === true &&
            <AlertHtmlLocal severity="warning" content={localStrings.closed}></AlertHtmlLocal>
            }

            {
              !allClosed() && timeSlots && timeSlots.allSlots &&
                timeSlots.allSlots.find(slot => !isSlotUnavailable(slot)) != null &&
                timeSlots.allSlots.map((value, key) => {
                    let format =
                        value.startDate.format('HH:mm')
                        + "-"
                        + value.endDate.format('HH:mm')
                    if (slotInTime(value) && slotAlavailableInMode(value)) {
                      return (
                          <Box m={1}>
                            {/*<p>butt</p>*/}
                            <BazarButton variant="contained"
                                //disabled={!value.available && !isSelectedSlot(value)}
                                         disabled={isSlotUnavailable(value)}
                                //disabled={!enoughTimeForPreparation(value)}
                                         color={isSelectedSlot(value) ? "primary" : "inherit"}
                                         onClick={() => select(value)}
                            >{(value.closed ? localStrings.closed : format)}</BazarButton>
                          </Box>
                      )
                    }
                  }
              )}



          </Box>
        </div>
        }
      </div>
  );
}

export default BookingSlots;
