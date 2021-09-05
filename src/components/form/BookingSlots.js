import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons';
import localStrings from '../../localStrings';
import useAuth from "@hook/useAuth";
import {ORDER_DELIVERY_MODE_DELIVERY, ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} from "../../util/constants";
import {Button, IconButton} from "@material-ui/core";
import {computePriceDetail} from "../../util/displayUtil";
import Grid from "@material-ui/core/Grid";
import BazarButton from "@component/BazarButton";
import {getBookingSlotsOccupancyQueryNoApollo} from "../../gqlNoApollo/bookingSlotsOccupancyGqlNoApollo";

const setHourFromString = (momentDate, hourSt) => {
  let hourSplit = hourSt.split(':');
  return moment(momentDate.set({hour:hourSplit[0],minute:hourSplit[1], second:0,millisecond:0}));
}

function getDaySettings(establishment, dowString, inverseOrder) {
  return establishment.serviceSetting && establishment.serviceSetting.daySetting &&
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
    dateEnd: setHourFromString(daySetting.dateCurrent, daySetting.endHourBooking),
    numberOfDeliveryMan: daySetting.numberOfDeliveryMan,
    maxDeliveryPerSlotPerMan: daySetting.maxDeliveryPerSlotPerMan,
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

export const buildTimeSlots = (establishment, getBookingSlotsOccupancy, orderInCreation, startDate, deliveryMode) => {
  if (establishment && startDate) {
    //alert("establishment " + establishment);
    let slotDuration = establishment.serviceSetting.slotDuration || 20;

    let offset = 0
    if (deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      offset = (establishment.serviceSetting.minimalSlotNumberBooking || 0) * slotDuration;
    }
    else if (deliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
      offset = (establishment.serviceSetting.minimalSlotNumberBookingNoDelivery || 0) * slotDuration;
    }
    else {
      offset = 0;
    }

    let daySettings = getWeekDaySettingsFromDate(startDate, establishment);

    //there is already a BookingSlotsOccupancy define for this day
    if (getBookingSlotsOccupancy() && startDate && daySettings.length > 0) {
      let slot = getBookingSlotsOccupancy().find(slot => {
        let statDateMoment = moment.unix(slot.startDate);
        return daySettings[0].dateCurrent.isSame(statDateMoment, 'day')
      });
      if (slot) {
        offset = (slot.endDate - slot.startDate) / 60;
      }
    }

    let minimumDateStart = moment().add(offset, 'minutes')
    let allSlots = [];

    if (daySettings && daySettings.length > 0) {
      let firstDaySetting = daySettings[0];
      let iterDate = setHourFromString(moment(firstDaySetting.dateCurrent), firstDaySetting.startHourDelivery);
      let endServiceDate = setHourFromString(moment(firstDaySetting.dateCurrent), firstDaySetting.endHourService);

      while (iterDate.isBefore(endServiceDate)) {
        let startDate = moment(iterDate);
        let endDate = moment(iterDate).add(slotDuration, 'minutes');

        allSlots.push({
          startDate: startDate,
          endDate: endDate,
          available: moment(iterDate).add(slotDuration, 'minutes').isAfter(minimumDateStart),
          full: isFull(startDate, endDate, firstDaySetting, getBookingSlotsOccupancy, orderInCreation),
          closed: isClosed(startDate, establishment),
        })
        iterDate = moment(iterDate.add(slotDuration, 'minutes'));
      }
    }

    let service = buildServiceFromDaySetting(daySettings[0]);
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
  return null
}

function getWeekDaySettingsFromDate(dateStart, establishment, limit) {
  let dateCurrent = moment(dateStart);
  let allDaySettings = [];
  for (let i = 1; i < 15; i++) {
    let daySettings = getDaySettings(establishment, getDowStringFromDowInt(dateCurrent.day())) || [];
    for (let j = 0; j< daySettings.length; j++) {
      let daySetting = daySettings[j];
      if (!limit || allDaySettings.length < limit) {
        let dateToCompare = moment(dateCurrent);
        setHourFromString(dateToCompare, daySetting.endHourBooking)
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

function isFull(startDate, endDate, daySetting, getBookingSlotsOccupancy, orderInCreation) {
  //console.log("isFull brandId " + brandId)

  if (!getBookingSlotsOccupancy()) {
    return true;
  }
  let slot = getBookingSlotsOccupancy().find(item => {
    return item.startDate == startDate.unix() &&
      item.endDate == endDate.unix()
  })

  // if (slot) {
  //   console.log(slot)
  // }

  if (slot && slot.locked) {
    return true;
  }

  let maxDeliveryPerSlotPerMan = daySetting.maxDeliveryPerSlotPerMan;
  let numberOfDeliveryMan = daySetting.numberOfDeliveryMan;
  // if (slot && slot.maxDelivery) {
  //   numberOfDeliveryMan = daySetting.numberOfDeliveryMan;
  // }
  // else {
  //   numberOfDeliveryMan = daySetting.numberOfDeliveryMan;
  // }
  let maxDelivery = maxDeliveryPerSlotPerMan * numberOfDeliveryMan;
  let maxPreparationTimePerSlot = daySetting.maxPreparationTimePerSlot;

  let excludedDeliveryNumber = slot ? slot.excludedDeliveryNumber || 0 : 0;
  if (slot && slot.deliveryNumber >= maxDelivery - excludedDeliveryNumber &&
    orderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
    return true;
  }

  //compute preparation time
  let detailPrice = computePriceDetail(orderInCreation());
  if (slot && detailPrice.totalPreparationTime + slot.totalPreparationTime > maxPreparationTimePerSlot) {
    return true;
  }
  return false;

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
        setHourFromString(dateToCompare, daySetting.endHourBooking)
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

function BookingSlots({selectCallBack, startDateParam, deliveryMode,
                        selectedKeyParam, setterSelectedKey, brandId, disableNextDay}) {

  //const [bookingSlotStartDate, setBookingSlotStartDate] = useState(startDateParam);

  const [bookingSlotsOccupancy, setBookingSlotsOccupancy] = useState([]);
  const [reload, setReload] = useState(true);
  const {currentEstablishment, getOrderInCreation
    , bookingSlotStartDate, setBookingSlotStartDate} = useAuth();

  const select = (key, value) => {
    if (selectCallBack) {
      selectCallBack(value)
    }
  };

  useEffect(async () => {

    if (currentEstablishment()) {
      let res = await getBookingSlotsOccupancyQueryNoApollo(brandId, currentEstablishment().id);
      //alert("res " + JSON.stringify(res))
      setBookingSlotsOccupancy(res.getBookingSlotsOccupancyByBrandIdAndEstablishmentId);
    }

    const interval = setInterval(async () => {
      if (currentEstablishment()) {
        let res = await getBookingSlotsOccupancyQueryNoApollo(brandId, currentEstablishment().id);
        //alert("res " + JSON.stringify(res))
        setBookingSlotsOccupancy(res.getBookingSlotsOccupancyByBrandIdAndEstablishmentId);
      }
    }, 300000);
    return () => clearInterval(interval);


  }, [currentEstablishment]);

  function getBookingSlotsOccupancy() {
    return bookingSlotsOccupancy;
  }


  useEffect(() => {
    let interval = setInterval(() => {
      setReload(false);
      setReload(true);
    }, 10000);

    // returned function will be called on component unmount
    return () => {
      clearInterval(interval);
    }
  }, [])

  if (currentEstablishment() && !currentEstablishment().serviceSetting.daySetting) {
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
    let selected = getOrderInCreation().bookingSlot != null &&
      getOrderInCreation().bookingSlot.startDate.isSame(slot.startDate) &&
      getOrderInCreation().bookingSlot.endDate.isSame(slot.endDate);
    return selected;
  }

  let timeSlots = buildTimeSlots(currentEstablishment(), getBookingSlotsOccupancy, getOrderInCreation, bookingSlotStartDate, deliveryMode);

  function formatService(service) {
    if (!service) {
      return "";
    }
    return service.dateStart.locale('fr').calendar() + " - " + service.dateEnd.format("HH:mm");
  }

  return (
    <div>
      {bookingSlotStartDate && reload &&
      // <>
        <div style={{ width: '100%' }}>
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

        <Box
          display="flex"
          flexWrap="wrap"
          alignContent="flex-start"
          justifyContent="center"
          p={1}
          m={1}
        >
          {
            timeSlots && timeSlots.allSlots.map((value, key) => {
                let format =
                  value.startDate.format('HH:mm')
                  + "-"
                  + value.endDate.format('HH:mm')
                if (value.available || isSelectedSlot(value)) {
                  return (
                    <Box m={1}>
                      {/*<p>butt</p>*/}
                      <BazarButton variant="contained"
                              //disabled={!value.available && !isSelectedSlot(value)}
                              disabled={value.full || value.closed}
                              color={isSelectedSlot(value) ? "primary" : "inherit"}
                              onClick={() => select(key, value)}
                      >{value.closed ? localStrings.closed : format}</BazarButton>
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
