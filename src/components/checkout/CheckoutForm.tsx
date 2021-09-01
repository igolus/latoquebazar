import Card1 from '@component/Card1'
import Parser from 'html-react-parser';
import {
  Alert, AlertTitle,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'
import {Formik} from 'formik'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useRef, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import {
  ORDER_DELIVERY_MODE_DELIVERY,
  ORDER_DELIVERY_MODE_PICKUP_ON_SPOT,
  ORDER_SOURCE_OFFLINE, ORDER_SOURCE_ONLINE,
  ORDER_STATUS_NEW
} from "../../util/constants";
import BookingSlots from '../../components/form/BookingSlots';
import useAuth from "@hook/useAuth";
import moment from 'moment';
import GoogleMapsAutocomplete, {loadScript} from "@component/map/GoogleMapsAutocomplete";
import {setDistanceAndCheck, setDistanceAndCheckNoCall} from "@component/address/AdressCheck";
import {
  computePriceDetail,
  formatDuration,
  getDeliveryDistance, getDeliveryDistanceWithFetch, getMaxDistanceDelivery, getProfileName,
  getSkusLists, getSkusListsFromProducts,
  isDeliveryActive
} from "../../util/displayUtil";
import {makeStyles} from "@material-ui/styles";
import {isMobile} from "react-device-detect";
import {cloneDeep} from "@apollo/client/utilities";
import {uuid} from "uuidv4";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import AlertHtmlLocal from "../../components/alert/AlertHtmlLocal";
import {createUpdateBookingSlotOccupancyMutation} from '../../gql/BookingSlotOccupancyGql'
import {addOrderToCustomer, createOrderMutation} from '../../gql/orderGql'
import {green} from "@material-ui/core/colors";
import {getCartItems} from "../../util/cartUtil";
import {sendNotif} from "../../util/sendNotif";
import ClipLoaderComponent from "../../components/ClipLoaderComponent"

const config = require("../../conf/config.json")

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .Mui-disabled": {
      WebkitTextFillColor: "rgba(0, 0, 0, 0.65)"
    }
  },
  wrapper: {
    //margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
  },
}));

export interface CheckoutFormProps {
  contextData: any
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({contextData}) => {
  const classes = useStyles();
  const autocomp = useRef(null);
  const router = useRouter()
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  //const [reloadDist, seReloadDist] = useState(false);
  const [adressValue, setAdressValue] = useState("");
  const [adressEditLock, setAdressEditLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setOrderInCreation, getOrderInCreation, currentEstablishment,
    dbUser, resetOrderInCreation, orderInCreation, increaseOrderCount} = useAuth();
  const [distanceInfo, setDistanceInfo] = useState(null);
  const {maxDistanceReached, setMaxDistanceReached, setLoginDialogOpen, setJustCreatedOrder} = useAuth();
  const loaded = React.useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !loaded.current) {
      let element = document.querySelector('#google-maps');
      if (element) {
        element.setAttribute("src",
            'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places");
      }
      else {
        loadScript(
            'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places",
            document.querySelector('head'),
            'google-maps',
        );
      }
      loaded.current = true;
    }

  },  [])


  useEffect(async () => {

    let lat;
    let lng;
    let label;

    if (currentEstablishment() && orderInCreation) {
      if (!dbUser) {
        setAdressValue("")
        return
      }
      //if (dbUser) {
      lat = dbUser.userProfileInfo.lat;
      lng = dbUser.userProfileInfo.lng;
      label = dbUser.userProfileInfo.address;
      setAdressValue(label)
      let distanceInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng, label);

      if (distanceInfo) {
        setDistanceAndCheck(distanceInfo, setMaxDistanceReached, setDistanceInfo, currentEstablishment);
      }

      updateCustomer(dbUser)
      updateDeliveryAdress(label, lat, lng);
      setAdressEditLock(true);
    }
  },  [dbUser])

  useEffect(() => {
    if (currentEstablishment() &&
        isDeliveryPriceDisabled() && orderInCreation.deliveryMode !== ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
      setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
    }
  }, [orderInCreation])

  function buildOrderInformation() {
    let ret = "";
    for (let i=0; i< getOrderInCreation().order.deals.length; i++) {
      let item = getOrderInCreation().order.deals[i];
      ret += item.quantity + " X " + item.name;
      if (i<getOrderInCreation().order.deals.length - 1) {
        ret += "/";
      }
    }
    return ret;
  }

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    //console.log(values);

    //cleanUp


    const currentBrand = contextData.brand;
    try {
      //setLoading(true);
      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null,2))

      let dataOrder = cloneDeep(getOrderInCreation());

      if (dataOrder.order.items && dataOrder.order.items.length > 0) {
        dataOrder.order.items.forEach(item => {
          delete item.productId;
          delete item.creationTimestamp;
          delete item.uuid;
        });

      }

      if (dataOrder.order.deals && dataOrder.order.deals.length > 0) {
        let allSkus = getSkusListsFromProducts(contextData.products);

        dataOrder.order.deals
            .forEach(deal => {
              if (deal !== null) {
                delete deal.deal.type;
                delete deal.deal.creationTimestamp;
                delete deal.uuid;
                delete deal.creationTimestamp;

                let productAndSkusLines = cloneDeep(deal.productAndSkusLines);
                deal.productAndSkusLines = [];
                //deal.productAndSkusLines.productAndSkusLines = [];
                productAndSkusLines.forEach(productAndSkusLine => {
                  delete productAndSkusLine.creationTimestamp;
                  delete productAndSkusLine.lineNumber;
                  delete productAndSkusLine.creationTimestamp;

                  let existingSku = (allSkus ? allSkus.data : []).find(sku => sku.extRef == productAndSkusLine.extRef);
                  if (existingSku) {
                    let productItem = {...existingSku, ...productAndSkusLine};
                    delete productItem.productId;
                    delete productItem.id;
                    delete productItem.creationTimestamp;
                    deal.productAndSkusLines.push(productItem)
                  } else {
                    deal.productAndSkusLines.push(productAndSkusLine)
                  }
                })

              }

            });
      }

      let createBookingSlotOccupancy = false;
      if (dataOrder.bookingSlot) {
        createBookingSlotOccupancy = true;
        //dataOrder.bookingSlot = {...orderInCreation().bookingSlot}
        delete dataOrder.bookingSlot.available;
        delete dataOrder.bookingSlot.full;
        delete dataOrder.bookingSlot.closed;
        dataOrder.bookingSlot.startDate = moment(dataOrder.bookingSlot.startDate).unix();
        dataOrder.bookingSlot.endDate = moment(dataOrder.bookingSlot.endDate).unix();
      }
      else {
        dataOrder.bookingSlot = {
          startDate: moment().unix(),
          endDate: moment().unix(),
        }
      }

      if (dataOrder.order.items) {
        dataOrder.order.items.forEach(item => {
              delete item.selectId;
              delete item.creation;
              delete item.optionListExtIds;
            }
        )
      }

      if (dataOrder.order.deals) {
        dataOrder.order.deals.forEach(deal => {
              delete deal.selectId;
              delete deal.creation;
            }
        )
      }


      dataOrder.information = buildOrderInformation();
      dataOrder.additionalInfo = getOrderInCreation().additionalInfo;

      let detailPrice = computePriceDetail(getOrderInCreation());

      dataOrder.totalPreparationTime = detailPrice.totalPreparationTime;
      dataOrder.totalPrice = parseFloat(detailPrice.total);
      dataOrder.totalPriceNoTax = parseFloat(detailPrice.totalNoTax);
      let taxDetailForOrder = [];

      Object.keys(detailPrice.taxDetail).forEach(key => {
        taxDetailForOrder.push({
          rate: key.toString(),
          amount: detailPrice.taxDetail[key]
        })
      })

      dataOrder.establishmentId = currentEstablishment().id;
      dataOrder.taxDetail = taxDetailForOrder;
      dataOrder.status = ORDER_STATUS_NEW;
      dataOrder.source = ORDER_SOURCE_ONLINE;

      if (dataOrder.payments) {
        dataOrder.payments.forEach(payment => {
          payment.uuid = uuid();
        })
      }

      delete dataOrder.creationDate;
      if (dataOrder.customer) {
        delete dataOrder.customer.creationDate;
      }

      dataOrder.customer = dbUser;

      let message = null;
      let result;

      result = await executeMutationUtil(createOrderMutation(currentBrand.id, currentEstablishment().id, dataOrder));

      //alert("result " + JSON.stringify(result))
      setJustCreatedOrder(cloneDeep(result.data.addOrder));

      if (!dataOrder.customer && dbUser) {
        dataOrder.customer = dbUser;
      }
      if (dataOrder.customer && dataOrder.customer.id) {
        await executeMutationUtil(addOrderToCustomer(currentBrand.id, dataOrder.customer.id, {
          ...dataOrder,
          id:result.data.addOrder.id,
          orderNumber: result.data.addOrder.orderNumber
        }))
      }


      if (createBookingSlotOccupancy) {
        await executeMutationUtil(createUpdateBookingSlotOccupancyMutation(currentBrand.id, currentEstablishment().id,
            {
              startDate: dataOrder.bookingSlot.startDate,
              endDate: dataOrder.bookingSlot.endDate,
              totalPreparationTime: dataOrder.totalPreparationTime,
              deliveryNumber: dataOrder.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY ? 1 : 0
            }));
      }

      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null, 2))
      let messageNotif = localStrings.formatString(localStrings.notifForBackEnd.orderCreated, getProfileName(dbUser))
      let link = "/app/management/Orders/detail/" + result.data.addOrder.id;
      await sendNotif(currentBrand.id, currentEstablishment().id, messageNotif,
          link, "");
      increaseOrderCount();
      resetOrderInCreation();
    }
    catch (err) {
      console.log(err);
      alert(err)
    }
    finally {
      setLoading(false);
      //setLoading(false);
    }

    router.push('/confirmed')
  }

  // const handleCheckboxChange =
  //     (values: typeof initialValues, setFieldValue: any) => (e: any, _: boolean) => {
  //       const checked = e.currentTarget.checked
  //
  //       setSameAsShipping(checked)
  //       setFieldValue('same_as_shipping', checked)
  //       setFieldValue('billing_name', checked ? values.shipping_name : '')
  //     }


  function setSelectedBookingSlot(bookingSlot) {
    setOrderInCreation({
      ...getOrderInCreation(),
      bookingSlot: bookingSlot,
    })
  }

  function setDeliveryMode(deliveryMode: string) {
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryMode: deliveryMode,
    })
  }

  function updateDeliveryAdress(address, lat, lng) {
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: {
        address: address,
        lat: lat,
        lng: lng,
      },
    })
  }

  function updateCustomer(customer) {
    setOrderInCreation({
      ...getOrderInCreation(),
      customer: customer,
    })
  }

  function getUserAdress() {
    if (!dbUser || !dbUser.userProfileInfo || !dbUser.userProfileInfo.address) {
      return null
    }
    return dbUser.userProfileInfo.address;
  }

  function isDeliveryPriceDisabled() {
    return isDeliveryActive(currentEstablishment()) &&
        getOrderInCreation() &&
        currentEstablishment().serviceSetting &&
        currentEstablishment().serviceSetting.minimalDeliveryOrderPrice &&
        computePriceDetail(getOrderInCreation()).total < currentEstablishment().serviceSetting.minimalDeliveryOrderPrice;
  }

  return (
      <>
        {!currentEstablishment() || !orderInCreation ?
              <ClipLoaderComponent/>
            :
            <Formik
                initialValues={getInitialValues(dbUser)}
                validationSchema={checkoutSchema}
                onSubmit={handleFormSubmit}
            >
              {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    {dbUser &&
                    <Card1 sx={{mb: '2rem'}}>
                      {/*<p>maxDistanceReached: {maxDistanceReached}</p>*/}
                      {/*<p>distanceInfo: {JSON.stringify(distanceInfo)}</p>*/}
                      {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                      getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                      <Box p={1}>
                        <AlertHtmlLocal severity={maxDistanceReached ? "warning" : "success"}
                                        title={maxDistanceReached ?
                                            localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                                        content={localStrings.formatString(localStrings.distanceTime,
                                            (distanceInfo.distance / 1000),
                                            formatDuration(distanceInfo, localStrings))}
                        />
                        {/*<p>{currentEstablishment() ? JSON.stringify(currentEstablishment().serviceSetting) : "0"}</p>*/}
                        {/*<p>{currentEstablishment() ? currentEstablishment().serviceSetting.minimalDeliveryOrderPrice : "0"}</p>*/}
                        {/*<p>{contextData && contextData.brand && contextData.brand.serviceSetting ? JSON.stringify(contextData.brand.serviceSetting) : "0"}</p>*/}
                        {/*<p>{computePriceDetail(getOrderInCreation()).total}</p>*/}
                        {/*<p>{isDeliveryPriceDisabled()}</p>*/}


                        <p>{JSON.stringify(getOrderInCreation().deliveryAddress)}</p>
                        {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
                        {/*<Alert severity={maxDistanceReached ? "warning" : "success"} style={{marginBottom: 2}}>*/}
                        {/*  {maxDistanceReached ?*/}
                        {/*      localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}*/}
                        {/*  {*/}
                        {/*    localStrings.formatString(localStrings.distanceTime,*/}
                        {/*        (distanceInfo.distance / 1000),*/}
                        {/*        formatDuration(distanceInfo, localStrings))*/}
                        {/*  }*/}

                        {/*</Alert>*/}
                      </Box>
                      }

                      {isDeliveryPriceDisabled() &&

                      <AlertHtmlLocal severity={"warning"}
                                      title={localStrings.warningMessage.deliveryUnavailable}
                                      content={localStrings.formatString(localStrings.warningMessage.minimalPriceForDeliveryNoReached,
                                          currentEstablishment().serviceSetting.minimalDeliveryOrderPrice)}
                      >
                        <Box display="flex" flexDirection="row-reverse">
                          <Box mt={2}>
                            <Link href="/product/shop/all">
                              <Button variant="contained" color="primary" type="button" fullWidth>
                                {localStrings.continueShopping}
                              </Button>
                            </Link>
                          </Box>
                        </Box>
                      </AlertHtmlLocal>
                      }


                      {dbUser &&
                      <>
                        <Typography fontWeight="600" mb={2}>
                          {localStrings.deliveryMode}
                        </Typography>
                        <FormControl component="fieldset">
                          <RadioGroup aria-label="gender" name="gender1"
                                      value={getOrderInCreation() && getOrderInCreation().deliveryMode}
                                      onChange={(event) => setDeliveryMode(event.target.value)}>
                            <Grid item sm={12} xs={12}>
                              {/*{!isDeliveryPriceDisabled() && !maxDistanceReached &&*/}
                              {!isDeliveryPriceDisabled() &&
                                < FormControlLabel value={ORDER_DELIVERY_MODE_DELIVERY} control={<Radio/>}
                                label={localStrings.delivery} />
                              }
                                <FormControlLabel value={ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} control={<Radio/>}
                                                label={localStrings.clickAndCollect}/>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </>
                      }
                      {dbUser && getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                      <>
                        <Typography fontWeight="600" mb={2} mt={2}>
                          {localStrings.deliveryAdress}
                        </Typography>

                        <Grid container spacing={3}>
                          {/*<Box display="flex" p={1}>*/}
                          <Grid item xs={12} lg={adressEditLock ? 8 : 12}>
                            <GoogleMapsAutocomplete
                                ref={autocomp}
                                noKeyKnown
                                required
                                setterValueSource={setAdressValue}
                                valueSource={adressValue}
                                disabled={adressEditLock}
                                setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                  if (currentEstablishment()) {
                                    let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                    setDistanceAndCheck(distInfo,
                                        (maxDistanceReached) => {
                                          if (maxDistanceReached) {
                                            setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
                                          }
                                          setMaxDistanceReached(maxDistanceReached);
                                        },
                                        setDistanceInfo, currentEstablishment);
                                  }
                                  //setAdressValue(label)
                                  updateDeliveryAdress(label, lat, lng);
                                  setAdressEditLock(true);
                                }}/>
                          </Grid>
                          {adressEditLock &&
                          <Grid item xs={12} lg={4}>
                            <Button variant="contained"
                                    onClick={() => setAdressEditLock(false)}
                                    color="primary" type="button" fullWidth>
                              {localStrings.deliverToOtherAddress}
                            </Button>
                          </Grid>
                          }
                        </Grid>
                      </>
                      }

                    </Card1>
                    }

                    <Card1 sx={{ mb: '2rem' }}>
                      <Typography fontWeight="600" mb={2}>
                        {localStrings.profileInformation}
                      </Typography>

                      {!dbUser &&
                      <Box mb={2}>
                        <AlertHtmlLocal severity="info"
                                        title={localStrings.warning}
                                        content={localStrings.info.connectToOrder}
                        />

                      </Box>
                      }

                      {!dbUser &&
                      <>

                        <Grid container spacing={3} mb={2}>
                          <Grid item xs={12} lg={12}>
                            {isMobile ?
                                <Link href="/profile">
                                  <Button variant={"contained"}
                                          color="primary" type="button" fullWidth>
                                    {localStrings.login}
                                  </Button>
                                </Link>
                                :
                                <Button variant={"contained"}
                                        onClick={() => {
                                          setLoginDialogOpen(true);
                                        }}
                                        color="primary" type="button" fullWidth>
                                  {localStrings.login}
                                </Button>
                            }
                          </Grid>
                        </Grid>
                      </>
                      }
                      {dbUser &&
                      <Grid container spacing={6}>
                        <Grid item sm={12} xs={12}>
                          <TextField
                              className={classes.textField}
                              disabled={dbUser}
                              name="firstName"
                              label={localStrings.firstName}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={dbUser ? dbUser.userProfileInfo.firstName : (values.firstName || '')}
                              error={!!touched.firstName && !!errors.firstName}
                              helperText={touched.firstName && errors.firstName}
                          />

                          <TextField
                              className={classes.textField}
                              disabled={dbUser}
                              name="lastname"
                              label={localStrings.lastName}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={dbUser ? dbUser.userProfileInfo.lastName : (values.lastname || '')}
                              error={!!touched.lastname && !!errors.lastname}
                              helperText={touched.lastname && errors.lastname}
                          />

                          <TextField
                              className={classes.textField}
                              disabled={dbUser}
                              name="email"
                              label={localStrings.email}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={dbUser ? dbUser.userProfileInfo.email : (values.email || '')}
                              error={!!touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                          />

                          <TextField
                              className={classes.textField}
                              disabled={dbUser}
                              name="address"
                              label={localStrings.address}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={dbUser ? dbUser.userProfileInfo.address : (values.address || '')}
                              error={!!touched.address && !!errors.address}
                              helperText={touched.address && errors.address}
                          />

                          <TextField
                              className={classes.textField}
                              disabled={dbUser}
                              name="phone"
                              label={localStrings.phone}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={dbUser ? dbUser.userProfileInfo.phoneNumber : (values.phoneNumber || '')}
                              error={!!touched.phone && !!errors.phone}
                              helperText={touched.phone && errors.phone}
                          />
                        </Grid>
                      </Grid>
                      }

                    </Card1>

                    {dbUser &&
                    <Card1 sx={{mb: '2rem'}}>
                      <Typography fontWeight="600" mb={2}>
                        {getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY ?
                            localStrings.selectDeliveryTimeSlot : localStrings.selectPickupTimeSlot}
                      </Typography>

                      <BookingSlots
                          disableNextDay
                          startDateParam={moment()}
                          selectCallBack={(bookingSlot) => setSelectedBookingSlot(bookingSlot)}
                          deliveryMode={getOrderInCreation().deliveryMode}
                          selectedKeyParam={selectedSlotKey}
                          setterSelectedKey={setSelectedSlotKey}
                          brandId={contextData && contextData.brand.id}
                      />
                    </Card1>
                    }

                    {dbUser &&
                    <Grid container spacing={6}>
                      <Grid item sm={6} xs={12}>
                        <Link href="/cart">
                          <Button variant="outlined" color="primary" type="button" fullWidth>
                            {localStrings.backToCart}
                          </Button>
                        </Link>
                      </Grid>

                      <Grid item sm={6} xs={12}>
                        {
                          maxDistanceReached && currentEstablishment() &&
                          getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY ||
                          !getOrderInCreation().bookingSlot
                              ?
                              // <Tooltip title={localStrings.warningMessage.selectValidDeliveryAddress}>
                              //   <>
                              <Button
                                  disabled={true}
                                  variant="contained" color="primary" type="submit" fullWidth>
                                {localStrings.checkOutNow}
                              </Button>
                              //   </>
                              // </Tooltip>
                              :

                              // <div className={classes.wrapper}>
                              <Button
                                  variant="contained" color="primary" type="submit" fullWidth
                                  //endIcon={<SaveIcon />}
                                  disabled={loading || getCartItems(getOrderInCreation).length == 0}
                                  endIcon={loading ? <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
                              >
                                {localStrings.checkOutNow}
                                {/*<CircularProgress size={24}/>*/}
                                {/*{loading && <CircularProgress size={24} className={classes.buttonProgress}/>}*/}

                              </Button>
                          // </div>
                          // </Tooltip>
                        }
                      </Grid>
                    </Grid>
                    }
                  </form>
              )}
            </Formik>

        }
      </>
  )
}

const getInitialValues = (dbUser) => {
  return {
    firstName: dbUser ? dbUser.userProfileInfo.firstName : '',
    lastname:  dbUser ? dbUser.userProfileInfo.lastName : '',
    email:  dbUser ? dbUser.userProfileInfo.email : '',
    address:  dbUser ? dbUser.userProfileInfo.address : '',
    phoneNumber:  dbUser ? dbUser.userProfileInfo.phoneNumber : '',
    // billing_country: countryList[229],
    // billing_address1: '',
    // billing_address2: '',
  }
}


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


// uncommect these fields below for from validation
const checkoutSchema = yup.object().shape({

  // firstName: yup.string().required(localStrings.check.requiredField),
  // lastName: yup.string().required(localStrings.check.requiredField),
  // email: yup.string().email("invalid email").required(localStrings.check.requiredField),
  // address: yup.string().required(localStrings.check.requiredField),
  // phoneNumber: yup.string().matches(phoneRegExp, localStrings.check.badPhoneFormat)
  // shipping_contact: yup.string().required("required"),
  // shipping_zip: yup.string().required("required"),
  // shipping_country: yup.object().required("required"),
  // shipping_address1: yup.string().required("required"),
  // billing_name: yup.string().required("required"),
  // billing_email: yup.string().required("required"),
  // billing_contact: yup.string().required("required"),
  // billing_zip: yup.string().required("required"),
  // billing_country: yup.object().required("required"),
  // billing_address1: yup.string().required("required"),
})

export default CheckoutForm
