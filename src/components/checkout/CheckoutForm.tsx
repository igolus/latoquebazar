import Card1 from '@component/Card1'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core'
import {Formik} from 'formik'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import {
  ORDER_DELIVERY_MODE_DELIVERY,
  ORDER_DELIVERY_MODE_PICKUP_ON_SPOT,
  ORDER_SOURCE_ONLINE,
  ORDER_STATUS_NEW
} from "../../util/constants";
import BookingSlots from '../../components/form/BookingSlots';
import useAuth from "@hook/useAuth";
import moment from 'moment';
import GoogleMapsAutocomplete, {loadScript} from "@component/map/GoogleMapsAutocomplete";
import {setDistanceAndCheck} from "@component/address/AdressCheck";
import {
  computePriceDetail,
  formatDuration,
  getDeliveryDistanceWithFetch,
  getProfileName,
  getSkusListsFromProducts,
  isDeliveryActive
} from "../../util/displayUtil";
import {makeStyles} from "@material-ui/styles";
import {isMobile} from "react-device-detect";
import {cloneDeep} from "@apollo/client/utilities";
import {uuid} from "uuidv4";
import {executeMutationUtil, executeQueryUtil} from "../../apolloClient/gqlUtil";
import AlertHtmlLocal from "../../components/alert/AlertHtmlLocal";
import {createUpdateBookingSlotOccupancyMutation} from '../../gql/BookingSlotOccupancyGql'
import {
  addOrderToCustomer,
  bulkDeleteOrderMutation,
  createOrderMutation,
  getOrderByIdQuery,
  updateOrderMutation
} from '../../gql/orderGql'
import {green} from "@material-ui/core/colors";
import {getCartItems} from "../../util/cartUtil";
import {sendNotif} from "../../util/sendNotif";
import ClipLoaderComponent from "../../components/ClipLoaderComponent"
import {CardElement, CardNumberElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'

import PresenterSelect from "../PresenterSelect"

const config = require('../../conf/config.json')
//import useResponsiveFontSize from "../../hooks/useResponsiveFontSize";

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

  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [useMyAdress, setUseMyAdress] = useState(false);
  const [selectedAddId, setSelectedAddId] = useState(true);
  const [bookWithoutAccount, setBookWithoutAccount] = useState(false);
  const [paymentCardValid, setPaymentCardValid] = useState(false);
  const classes = useStyles();
  const autocomp = useRef(null);
  const router = useRouter()
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  //const [reloadDist, seReloadDist] = useState(false);
  const [adressValue, setAdressValue] = useState("");
  const [adressEditLock, setAdressEditLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setOrderInCreation, getOrderInCreation, currentEstablishment, currentBrand,
    dbUser, resetOrderInCreation, orderInCreation, increaseOrderCount} = useAuth();
  const [distanceInfo, setDistanceInfo] = useState(null);
  const {maxDistanceReached, setMaxDistanceReached, setLoginDialogOpen, setJustCreatedOrder} = useAuth();
  const loaded = React.useRef(false);
  const [paymentMethod, setPaymentMethod] = useState('delivery')

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
      resetDeliveryAdress();
      loaded.current = true;
    }

  },  [])


  // useEffect(async () => {
  //
  //   let lat;
  //   let lng;
  //   let label;
  //
  //   if (currentEstablishment() && orderInCreation) {
  //     if (!dbUser) {
  //       setAdressValue("")
  //       return
  //     }
  //     //if (dbUser) {
  //     lat = dbUser.userProfileInfo.lat;
  //     lng = dbUser.userProfileInfo.lng;
  //     label = dbUser.userProfileInfo.address;
  //     setAdressValue(label)
  //     let distanceInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng, label);
  //
  //     if (distanceInfo) {
  //       setDistanceAndCheck(distanceInfo, setMaxDistanceReached, setDistanceInfo, currentEstablishment);
  //     }
  //
  //     updateCustomer(dbUser)
  //     updateDeliveryAdress(label, lat, lng);
  //     setAdressEditLock(true);
  //   }
  // },  [dbUser])

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

  const processPayment = async(orderId, values) => {
    const cardElement = elements.getElement("card");

    try {

      const billingDetails = {
        name: bookWithoutAccount ? (values.firstName + " " + values.lastName).trim() : getProfileName(dbUser),
        email: bookWithoutAccount ? values.email : dbUser.userProfileInfo.email,
        address: {
          line1: !bookWithoutAccount ? dbUser.userProfileInfo.address : null,
        }
      };

      const { data: clientSecret } = await axios.post(config.paymentUrl, {
        //amount: 200
        orderId: orderId,
        establishmentId: currentEstablishment().id,
        brandId: currentBrand().id
      });

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails

      });

      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        //alert("payment error " + paymentMethodReq.error.message)
        //setProcessingTo(false);
        return null;
      }

      const resPay = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id
      });


      if (resPay.error) {
        setCheckoutError(resPay.error.message);
        //alert("payment error " + resPay.error.message)
        return null;
      }

      //update order
      let resOrder = await executeQueryUtil(getOrderByIdQuery(currentBrand().id, currentEstablishment().id, orderId));
      let order = resOrder?.data?.getOrdersByOrderIdEstablishmentIdAndOrderId;
      if (order) {
        let dataUpdate = cloneDeep(order);
        if (dataUpdate && dataUpdate.payments.length === 1) {
          dataUpdate.payments[0] = {...order.payments[0], extId: resPay.paymentIntent.id}
          await executeMutationUtil(updateOrderMutation(currentBrand().id, currentEstablishment().id, dataUpdate))
        }
      }

      //alert("payment done " + JSON.stringify(resPay))
      return resPay;

    } catch (err) {
      setCheckoutError(err.message);
      //alert(err.message);
      return null;
    }

  }

  const handleFormSubmit = async (values: any) => {

    // alert("handleFormSubmit " );
    // return;
    setLoading(true);
    let orderId = 0;
    // let payResult = await processPayment();
    // if (!payResult) {
    //   setLoading(false);
    //   return
    // }
    //console.log("payResult " + JSON.stringify(payResult, null, 2))

    const currentBrand = contextData.brand;
    try {
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
      dataOrder.additionalInfo = values.additionalInformation || getOrderInCreation().additionalInfo;

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

      // delete dataOrder?.deliveryAddress?.id;
      // delete dataOrder?.deliveryAddress?.additionalInformation;

      if (dataOrder.customer) {
        delete dataOrder.customer.creationDate;
      }
      if (bookWithoutAccount) {
        dataOrder.customer = {
          brandId: currentBrand.id,
          defaultEstablishmentId: currentEstablishment().id,
          establishmentIds: [currentEstablishment().id],
          userProfileInfo: {
            additionalInformation: values.additionalInformation,
            email:  values.email,
            address: getOrderInCreation()?.deliveryAddress?.address,
            lat: getOrderInCreation()?.deliveryAddress?.lat,
            lng: getOrderInCreation()?.deliveryAddress?.lng,
            firstName: values.firstName,
            lastName: values.lastName,
          }
        }
      }
      else {
        dataOrder.customer = dbUser;
      }


      let result;
      delete dataOrder["updateDate"];
      delete dataOrder["initial"];
      if (dataOrder?.deliveryAddress) {
        delete dataOrder.deliveryAddress["id"];
        delete dataOrder.deliveryAddress["additionalInformation"];
      }

      result = await executeMutationUtil(createOrderMutation(currentBrand.id, currentEstablishment().id, dataOrder));
      orderId = result.data.addOrder.id;
      if (paymentMethod === "cc") {
        let payResult = await processPayment(result.data.addOrder.id, values);

        console.log("payResult " + JSON.stringify(payResult, null, 2))
        if (!payResult) {
          //delete the order

          await executeMutationUtil(bulkDeleteOrderMutation(currentBrand.id, currentEstablishment().id, [orderId]));
          setLoading(false);
          return;
        }
      }

      // if (!dataOrder.customer && dbUser) {
      //   dataOrder.customer = dbUser;
      // }
      if (dataOrder.customer && dataOrder.customer.id && !bookWithoutAccount) {
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
      alert(err.message)
    }
    finally {
      setLoading(false);
      //setLoading(false);
    }
    if (orderId != 0) {
      router.push('/confirmed/' + orderId)
    }
  }


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

  function updateDeliveryAdress(address, lat, lng, id, additionalInformation) {
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: {
        address: address,
        lat: lat,
        lng: lng,
        id: id,
        additionalInformation: additionalInformation,
      },
    })
  }


  function resetDeliveryAdress() {
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: null,
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

  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    setPaymentMethod(name)
  }

  async function checkDistance(lat, lng) {
    if (currentEstablishment()) {
      let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
      setDistanceAndCheck(distInfo,
          (maxDistanceReached) => {
            // if (maxDistanceReached) {
            //   setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
            // }
            setMaxDistanceReached(maxDistanceReached);
          },
          setDistanceInfo, currentEstablishment);
    }
  }

  return (


      <>
        {!currentEstablishment() || !orderInCreation ?
            // {false ?
            <ClipLoaderComponent/>
            :
            <Formik
                initialValues={getInitialValues(dbUser)}
                validationSchema={checkoutSchema(bookWithoutAccount)}
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
                    {/*<p>{JSON.stringify(getOrderInCreation().deliveryAddress || {})}</p>*/}
                    {(!dbUser) &&
                    <Card1 sx={{mb: '2rem'}}>
                      <Box mb={2}>
                        <AlertHtmlLocal severity="info"
                                        title={localStrings.warning}
                                        content={localStrings.info.connectToOrder}
                        />

                      </Box>

                      <Grid container spacing={3} mb={2}>
                        <Grid item xs={12} lg={12}>
                          {isMobile ?

                              <Link href="/profile">
                                <Button variant={"contained"}
                                        style={{textTransform: "none"}}
                                        color="primary" type="button" fullWidth>
                                  {localStrings.login}
                                </Button>
                              </Link>
                              :
                              <Box>
                                <Button variant={"contained"}
                                        style={{textTransform: "none"}}
                                        onClick={() => {
                                          setLoginDialogOpen(true);
                                        }}
                                        color="primary" type="button" fullWidth>
                                  {localStrings.login}
                                </Button>

                                <Button variant={"contained"}
                                        style={{textTransform: "none", marginTop: "1rem"}}
                                        onClick={() => {
                                          setBookWithoutAccount(true)
                                        }}
                                        color="primary" type="button" fullWidth>
                                  {localStrings.continueWithoutAccount}
                                </Button>
                              </Box>
                          }
                        </Grid>
                      </Grid>
                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) &&
                    <Card1 sx={{mb: '2rem'}}>
                      <>
                        {isDeliveryPriceDisabled() &&

                        <AlertHtmlLocal severity={"warning"}
                                        title={localStrings.warningMessage.deliveryUnavailable}
                                        content={localStrings.formatString(localStrings.warningMessage.minimalPriceForDeliveryNoReached,
                                            currentEstablishment().serviceSetting.minimalDeliveryOrderPrice)}
                        >
                          <Box display="flex" flexDirection="row-reverse">
                            <Box mt={2}>
                              <Link href="/product/shop/all">
                                <Button variant="contained" color="primary" type="button" fullWidth
                                        style={{textTransform: "none"}}
                                >
                                  {localStrings.continueShopping}
                                </Button>
                              </Link>
                            </Box>
                          </Box>
                        </AlertHtmlLocal>
                        }
                        <Typography fontWeight="800" mb={2} variant="h5">
                          {localStrings.selectDeliveryMode}
                        </Typography>
                        {!isDeliveryPriceDisabled() && currentEstablishment()?.serviceSetting?.enableDelivery &&
                        <PresenterSelect
                            icon={faMotorcycle}
                            title={localStrings.delivery}
                            subtitle={localStrings.deliverySubTitle}
                            selected={getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY}
                            onCLickCallBack={() => {
                              setDeliveryMode(ORDER_DELIVERY_MODE_DELIVERY)
                            }}
                        />
                        }

                        <PresenterSelect
                            icon={faShoppingBag}
                            title={localStrings.clickAndCollect}
                            subtitle={localStrings.clickAndCollectSubTitle}
                            selected={getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT}
                            onCLickCallBack={() => {
                              setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
                            }}
                        />
                      </>
                      <>
                      </>
                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) && getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                    <Card1 sx={{mb: '2rem'}}>
                      <>

                        {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                        getOrderInCreation().deliveryAddress &&
                        getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                        <Box p={1}>
                          <AlertHtmlLocal severity={maxDistanceReached ? "warning" : "success"}
                                          title={maxDistanceReached ?
                                              localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                                          content={localStrings.formatString(localStrings.distanceTime,
                                              (distanceInfo.distance / 1000),
                                              formatDuration(distanceInfo, localStrings))}
                          />
                        </Box>
                        }

                        <Typography fontWeight="600" mb={2} mt={2} variant="h5">
                          {localStrings.selectDeliveryAdress}
                        </Typography>

                        {dbUser &&
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            mb={2}
                        >
                          <Box mr={'2rem'}>
                            <Button
                                style={{marginRight: "20px"}}
                                onClick={() => {
                                  setUseMyAdress(true);
                                  resetDeliveryAdress();
                                }}
                                style={{textTransform: "none"}}
                                variant="contained" color={useMyAdress ? "primary" : "inherit"}>
                              {localStrings.useMyAdresses}
                            </Button>
                          </Box>

                          <Box ml={2}>
                            <Button
                                style={{marginLeft: "20px", textTransform: "none"}}
                                onClick={() => {
                                  setUseMyAdress(false);
                                  resetDeliveryAdress();
                                }}
                                variant="contained" color={!useMyAdress ? "primary" : "inherit"}>
                              {localStrings.useCustomAdresses}
                            </Button>
                          </Box>
                        </Box>
                        }


                        {dbUser && useMyAdress &&
                        <>
                          {!dbUser?.userProfileInfo?.address &&
                          <AlertHtmlLocal
                              severity="warning"
                              title={localStrings.warning}
                              content={localStrings.warningMessage.noMainAddDefined}>

                            <Box display="flex" flexDirection="row-reverse">
                              <Box mt={2}>
                                <Link href={"/address/main" + "?back=" + encodeURI("/checkout")}>
                                  <Button variant="contained" color="primary" type="button" fullWidth
                                          style={{textTransform: "none"}}
                                  >
                                    {localStrings.defineMainAdress}
                                  </Button>
                                </Link>
                              </Box>
                            </Box>
                          </AlertHtmlLocal>

                          }

                          {dbUser?.userProfileInfo?.address &&
                          <PresenterSelect
                              icon={faAddressCard}
                              title={localStrings.mainAddress}
                              subtitle={dbUser?.userProfileInfo?.address}
                              selected={selectedAddId === "main"}
                              onCLickCallBack={async () => {
                                setSelectedAddId("main");

                                await checkDistance(dbUser?.userProfileInfo?.lat, dbUser?.userProfileInfo?.lng);
                                updateDeliveryAdress(dbUser?.userProfileInfo?.address,
                                    dbUser?.userProfileInfo?.lat,
                                    dbUser?.userProfileInfo?.lng,
                                    "main",
                                    dbUser?.userProfileInfo?.additionalInformation

                                );
                              }}
                          />
                          }

                          {dbUser?.userProfileInfo?.address && (dbUser?.userProfileInfo?.otherAddresses || []).map((item, key) =>
                              <PresenterSelect
                                  key={key}
                                  icon={faAddressCard}
                                  title={item.name}
                                  subtitle={item.address}
                                  selected={selectedAddId === item.id}
                                  onCLickCallBack={async () => {
                                    setSelectedAddId(item.id);
                                    await checkDistance(item.lat, item.lng);
                                    updateDeliveryAdress(item.address,
                                        item.lat,
                                        item.lng,
                                        item.id,
                                        item.additionalInformation
                                    );
                                  }}
                              />
                          )}

                          <Box display="flex" flexDirection="row-reverse">
                            <Box mt={2}>
                              <Link href={"/address"}>
                                <Button variant="contained" color="primary" type="button" fullWidth
                                        style={{textTransform: "none"}}
                                >
                                  {localStrings.manageMyAdresses}
                                </Button>
                              </Link>
                            </Box>
                          </Box>


                        </>
                        }

                        {(!dbUser || !useMyAdress) &&
                        <Grid container spacing={3}>
                          {/*<Box display="flex" p={1}>*/}
                          <Grid item xs={12} lg={adressEditLock ? 8 : 12}>
                            <GoogleMapsAutocomplete
                                //ref={autocomp}
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
                                    style={{textTransform: "none"}}
                                    onClick={() => setAdressEditLock(false)}
                                    type="button" fullWidth>
                              {localStrings.deliverToOtherAddress}
                            </Button>
                          </Grid>
                          }
                        </Grid>
                        }

                      </>
                    </Card1>
                    }

                    {(bookWithoutAccount && !dbUser) &&
                    <Card1 sx={{mb: '2rem'}}>

                      <Typography fontWeight="600" mb={2} variant="h5">
                        {localStrings.personalInformation}
                      </Typography>
                      <Grid container spacing={6}>


                        <Grid item sm={12} xs={12}>

                          {/*<Box display="flex" flexDirection="row-reverse">*/}
                          {/*  <Box mt={2} mb={2}>*/}
                          {/*    <Link href="/profile/edit">*/}
                          {/*      <Button variant="contained" color="primary" type="button" fullWidth*/}
                          {/*              style={{textTransform: "none"}}*/}
                          {/*      >*/}
                          {/*        {localStrings.modifyMyAccount}*/}
                          {/*      </Button>*/}
                          {/*    </Link>*/}
                          {/*  </Box>*/}
                          {/*</Box>*/}

                          <TextField
                              className={classes.textField}
                              name="firstName"
                              label={localStrings.firstName}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.firstName}
                              error={!!touched.firstName && !!errors.firstName}
                              helperText={touched.firstName && errors.firstName}
                          />

                          <TextField
                              className={classes.textField}
                              name="lastName"
                              label={localStrings.lastName}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.lastName}
                              error={!!touched.lastName && !!errors.lastName}
                              helperText={touched.lastName && errors.lastName}
                          />

                          <TextField
                              className={classes.textField}
                              name="email"
                              label={localStrings.email}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.email}
                              error={!!touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                          />

                          <TextField
                              className={classes.textField}
                              name="phone"
                              label={localStrings.phone}
                              fullWidth
                              sx={{mb: '1rem'}}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.phone}
                              error={!!touched.phone && !!errors.phone}
                              helperText={touched.phone && errors.phone}
                          />
                        </Grid>
                      </Grid>
                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) &&
                    <Card1 sx={{mb: '2rem'}}>
                      <Typography fontWeight="600" mb={2} variant="h5">
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
                          brandId={contextData && contextData?.brand?.id}
                      />
                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                    <Card1 sx={{mb: '2rem'}}>

                      <Typography fontWeight="600" mb={2}>
                        {localStrings.bookingadditionalInformation}
                      </Typography>

                      <Typography variant="body2" fontWeight="400" mb={2}>
                        {localStrings.bookingadditionalInformationExample}
                      </Typography>

                      <TextField
                          multiline
                          rows={4}
                          className={classes.textField}
                          name="additionalInformation"
                          //label={!useMyAdress || localStrings.additionalInformation}
                          fullWidth
                          sx={{mb: '1rem'}}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={useMyAdress}
                          value={dbUser && useMyAdress ?
                              getOrderInCreation()?.deliveryAddress?.additionalInformation
                              :
                              values.additionalInformation
                          }
                          //error={!!touched.additionalInformation && !!errors.additionalInformation}
                          helperText={touched.additionalInformation && errors.additionalInformation}
                      />


                      {useMyAdress && getOrderInCreation()?.deliveryAddress?.id &&
                      <Box display="flex" flexDirection="row-reverse">
                        <Box mt={2}>
                          <Link href={"/address/" + getOrderInCreation().deliveryAddress.id + "?back=" + encodeURI("/checkout")}>
                            <Button variant="contained" color="primary" type="button" fullWidth
                                    style={{textTransform: "none"}}
                            >
                              {localStrings.updateAddtionalInformation}
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                      }



                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) &&
                    <Card1 sx={{mb: '2rem'}}>

                      {checkoutError &&
                      <AlertHtmlLocal severity={"error"}
                                      title={localStrings.warningMessage.paymentIssue}
                                      content={checkoutError.toString()}
                      />
                      }

                      <Typography fontWeight="600" mb={2}>
                        {localStrings.payementMethod}
                      </Typography>

                      <FormControlLabel
                          name="delivery"
                          label={<Typography fontWeight="300">{localStrings.paymentDelivery}</Typography>}
                          control={
                            <Radio
                                checked={paymentMethod === 'delivery'}
                                color="secondary"
                                size="small"
                            />
                          }
                          sx={{ mb: '.5rem' }}
                          onChange={handlePaymentMethodChange}
                      />

                      {currentBrand()?.config?.paymentWebConfig?.activateOnlinePayment &&
                      <>
                        <br/>
                        <FormControlLabel
                            name="cc"
                            label={<Typography fontWeight="300">{localStrings.paymentCreditCard}</Typography>}
                            control={
                              <Radio
                                  checked={paymentMethod === 'cc'}
                                  color="secondary"
                                  size="small"
                              />
                            }
                            sx={{ mb: '0.5rem' }}
                            onChange={handlePaymentMethodChange}
                        />
                      </>
                      }

                      {paymentMethod === 'cc' &&
                      <>

                        {/*<CardNumberElement/>*/}

                        {/*<Typography variant="subtitle2" mb={2}>*/}
                        {/*  {localStrings.creditCardDetail}*/}
                        {/*</Typography>*/}
                        <div
                            style={
                              {
                                border: '1px solid #C4CCD5',
                                borderRadius: "5px",
                                padding: '9px'
                              }
                            }
                        >
                          <CardElement
                              id="card-element"

                              //onComplete={}
                              onReady={() => {

                                //setPaymentCardValid(true);
                                console.log("Card ready")
                              }}

                              onChange={(event) => {

                                if (event.complete) {
                                  setPaymentCardValid(true);
                                } else if (event.error) {
                                  setPaymentCardValid(false);
                                }
                              }}

                              options={{
                                style: {
                                  base: {
                                    fontSize: '14px',
                                    color: '#424770',
                                    '::placeholder': {
                                      color: '#aab7c4',
                                    },
                                  },
                                  invalid: {
                                    color: '#9e2146',
                                  },
                                },
                              }}/>
                        </div>

                      </>
                      }
                    </Card1>
                    }

                    {(dbUser || bookWithoutAccount) &&
                    <Grid container spacing={6}>
                      <Grid item sm={6} xs={12}>
                        <Link href="/cart">
                          <Button
                              style={{textTransform: "none"}}
                              variant="outlined" color="primary" type="button" fullWidth style={{textTransform: "none"}}>
                            {localStrings.backToCart}
                          </Button>
                        </Link>
                      </Grid>

                      <Grid item sm={6} xs={12}>
                        {/*<p>{JSON.stringify(getOrderInCreation()?.bookingSlot || {})}</p>*/}
                        {/*<p>{getCartItems(getOrderInCreation).length}</p>*/}
                        {/*<p>{JSON.stringify(getOrderInCreation()?.deliveryAddress)}</p>*/}
                        {/*<p>{getOrderInCreation()?.deliveryMode}</p>*/}

                        <Button
                            style={{textTransform: "none"}}
                            variant="contained" color="primary" type="submit" fullWidth
                            type="submit"
                            //endIcon={<SaveIcon />}
                            disabled={
                              !checkoutSchema(bookWithoutAccount).isValidSync(values) ||
                              !getOrderInCreation().bookingSlot ||
                              loading || getCartItems(getOrderInCreation).length == 0 ||
                              (!getOrderInCreation()?.deliveryAddress && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) ||
                              (getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && maxDistanceReached) ||
                              (paymentMethod === "cc" && !paymentCardValid)
                            }
                            endIcon={loading ? <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
                        >
                          {paymentMethod === "cc" ?
                              localStrings.formatString(localStrings.checkOutNowAndPayCard,
                                  computePriceDetail(orderInCreation).total.toFixed(2))
                              :
                              localStrings.formatString(localStrings.checkOutNowAndPayLater,
                                  computePriceDetail(orderInCreation).total.toFixed(2))
                          }
                          {/*<CircularProgress size={24}/>*/}
                          {/*{loading && <CircularProgress size={24} className={classes.buttonProgress}/>}*/}

                        </Button>
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
    firstName: '',
    lastName:  '',
    email:  '',
    phone: '',
    // address:  '',
    additionalInformation: '',
  }
}

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const checkoutSchema = (bookWithoutAccount) => {

  if (bookWithoutAccount) {
    return yup.object().shape({
          lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
          email: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
          phone: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}'))
              .matches(phoneRegExp, localStrings.check.badPhoneFormat)
        }
    )
  }
  else {
    return yup.object().shape({});
  }

}


// uncommect these fields below for from validation
// const checkoutSchema = yup.object().shape({
//
// })

export default CheckoutForm

