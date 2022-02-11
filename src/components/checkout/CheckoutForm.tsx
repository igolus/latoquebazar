import Card1 from '@component/Card1'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress, Dialog, DialogActions, DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  TextField,
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
  ORDER_SOURCE_ONLINE,
  ORDER_STATUS_NEW, PAYMENT_METHOD_SYSTEMPAY, PAYMENT_MODE_STRIPE, PAYMENT_MODE_SYSTEM_PAY
} from "../../util/constants";
import BookingSlots from '../../components/form/BookingSlots';
import useAuth from "@hook/useAuth";
import moment from 'moment';
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import {setDistanceAndCheck} from "@component/address/AdressCheck";
import {
  computePriceDetail,
  formatPaymentMethod, getBrandCurrency,
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
import {
  addOrderToCustomer,
  bulkDeleteOrderMutation,
  createOrderMutation,
  getOrderByIdQuery,
  updateOrderMutation
} from '../../gql/orderGql'
import {green} from "@material-ui/core/colors";
import {getCartItems, getItemNumberInCart} from "../../util/cartUtil";
import ClipLoaderComponent from "../../components/ClipLoaderComponent"
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";
import {faAddressCard, faMotorcycle, faShoppingBag} from '@fortawesome/free-solid-svg-icons'

import PresenterSelect from "../PresenterSelect"
import {itemHaveRestriction} from "@component/mini-cart/MiniCart";
import parsePhoneNumber from 'libphonenumber-js'
import KRPayment from "../../components/payment/KRPayment";
import EmptyBasket from "@component/shop/EmptyBasket";
import FlexBox from "@component/FlexBox";
import {H6, Tiny2} from "@component/Typography";
import ReactMarkdown from "react-markdown";
import MdRender from "@component/MdRender";

const config = require('../../conf/config.json')

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
  dialogContent: {
    paddingBottom: '1.25rem',
  },
}));

export interface CheckoutFormProps {
  contextData: any
  noStripe: boolean
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({contextData, noStripe}) => {

  function removeGoogleMapScript() {
    console.debug('removing google script...');
    let keywords = ['maps.googleapis'];

    //Remove google from BOM (window object)
    window.google = undefined;

    //Remove google map scripts from DOM
    let scripts = document.head.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      let scriptSource = scripts[i].getAttribute('src');
      if (scriptSource != null) {
        if (keywords.filter(item => scriptSource.includes(item)).length) {
          scripts[i].remove();
          // scripts[i].parentNode.removeChild(scripts[i]);
        }
      }
    }
  }

  let stripe;
  let elements;
  if (!noStripe) {
    stripe = useStripe();
    elements = useElements();
  }
  const classes = useStyles();
  const autocomp = useRef(null);
  const [cgvChecked, setCgvChecked] = React.useState(false);
  const [pickupAlert, setPickupAlert] = React.useState(false);

  const [checkoutError, setCheckoutError] = useState();
  const [useMyAdress, setUseMyAdress] = useState(false);
  const [selectedAddId, setSelectedAddId] = useState(true);
  const [customAddressSelected, setCustomAddressSelected] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const [bookWithoutAccount, setBookWithoutAccount] = useState(false);
  const [paymentCardValid, setPaymentCardValid] = useState(false);
  const router = useRouter()
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  //const [reloadDist, seReloadDist] = useState(false);
  const [adressValue, setAdressValue] = useState("");
  const [adressEditLock, setAdressEditLock] = useState(false);

  const [loading, setLoading] = useState(false);
  const { setOrderInCreation, getOrderInCreation, currentEstablishment, currentBrand,
    dbUser, resetOrderInCreation, orderInCreation, increaseOrderCount, setOrderInCreationNoLogic, setGlobalDialog, setRedirectPageGlobal, bookingSlotStartDate} = useAuth();
  const [distanceInfo, setDistanceInfo] = useState(null);
  const {maxDistanceReached, setMaxDistanceReached, setLoginDialogOpen, setJustCreatedOrder} = useAuth();

  const loaded = React.useRef(false);
  const [paymentMethod, setPaymentMethod] = useState('delivery')
  const [expectedPaymentMethods, setExpectedPaymentMethods] = useState([])

  function firstOrCurrentEstablishment() {
    if (currentEstablishment()) {
      return currentEstablishment();
    }
    return contextData.establishments[0];
  }

  // useEffect(() => {
  //   //resetDeliveryAdress();
  //   if (typeof window !== 'undefined' && !loaded.current) {
  //     let element = document.querySelector('#google-maps');
  //     if (element) {
  //       element.setAttribute("src",
  //           'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places");
  //     }
  //     else {
  //       loadScript(
  //           'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places",
  //           document.querySelector('head'),
  //           'google-maps',
  //       );
  //     }
  //     resetDeliveryAdress();
  //     loaded.current = true;
  //   }
  //
  // },  [])

  useEffect(() => {
    if (currentEstablishment() &&
        isDeliveryPriceDisabled() && orderInCreation.deliveryMode !== ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
      setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
    }
  }, [orderInCreation])

  useEffect(() => {
    //removeGoogleMapScript()
  }, [])




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

    if (noStripe) {
      return;
    }
    const cardElement = elements.getElement("card");

    try {

      const billingDetails = {
        name: bookWithoutAccount ? (values.firstName + " " + values.lastName).trim() : getProfileName(dbUser),
        email: bookWithoutAccount ? values.email : dbUser.userProfileInfo.email,
        address: {
          line1: !bookWithoutAccount ? dbUser.userProfileInfo.address : null,
        }
      };

      const data = await axios.post(config.paymentUrl, {
        //amount: 200
        orderId: orderId,
        establishmentId: currentEstablishment().id,
        brandId: currentBrand().id
      });
      if (data.errorMessage) {
        setCheckoutError(data.errorMessage);
        return null;
      }

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails

      });

      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        return null;
      }


      const resPay = await stripe.confirmCardPayment(data.data, {
        payment_method: paymentMethodReq.paymentMethod.id
      });

      //alert(JSON.stringify(resPay))
      if (resPay.error) {
        setCheckoutError(resPay.error.message);
        //alert("payment error " + resPay.error.message)
        return null;
      }

      //update order
      let resOrder = await executeQueryUtil(getOrderByIdQuery(currentBrand().id, currentEstablishment().id, orderId));
      let order = resOrder?.data?.getOrdersByOrderIdEstablishmentIdAndOrderId;
      //if (order) {
        //let dataUpdate = cloneDeep(order);
        // if (dataUpdate && dataUpdate.payments.length === 1) {
        //   dataUpdate.payments[0] = {...order.payments[0], extId: resPay.paymentIntent.id}
        //   await executeMutationUtil(updateOrderMutation(currentBrand().id, currentEstablishment().id, dataUpdate))
        // }
      //}

      //alert("payment done " + JSON.stringify(resPay))
      return resPay;

    } catch (err) {
      setCheckoutError(err.message);
      console.log("error pay" + JSON.stringify(err, null,2));
      //alert("error pay" + JSON.stringify(err));
      return null;
    }

  }

  const handleFormSubmit = async (values: any, transactionId: string, uuidvalue: string) => {

    setLoading(true);
    let orderId = 0;

    const currentBrand = contextData.brand;
    try {
      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null,2))

      let dataOrder = cloneDeep(getOrderInCreation());

      if (transactionId) {
        dataOrder.paymentTransactionId = transactionId;
      }
      if (uuidvalue) {
        dataOrder.paymentUuid = uuidvalue;
      }

      //filerRestricted
      let itemsIdToDelete = [];
      let dealsIdToDelete = [];
      //dataOrder.order.items.forEach(item => )



      if (dataOrder.order.items && dataOrder.order.items.length > 0) {
        dataOrder.order.items.forEach(item => {
          if (itemHaveRestriction(item)) {
            itemsIdToDelete.push(item.extRef)
          }
          delete item.productId;
          delete item.creationTimestamp;
          delete item.uuid;

          (item.options || []).forEach(opt => {
            delete opt.defaultSelected
          })

        });

      }

      if (dataOrder.order.deals && dataOrder.order.deals.length > 0) {
        let allSkus = getSkusListsFromProducts(contextData.products);

        dataOrder.order.deals
            .forEach(deal => {
              if (deal !== null) {
                if (itemHaveRestriction(deal.deal)) {
                  dealsIdToDelete.push(deal.deal.id)
                }

                delete deal.deal.type;
                delete deal.deal.creationTimestamp;
                delete deal.uuid;
                delete deal.creationTimestamp;
                delete deal.deal.restrictionsApplied;
                delete deal.restrictionsList;

                let productAndSkusLines = cloneDeep(deal.productAndSkusLines);
                deal.productAndSkusLines = [];
                //deal.productAndSkusLines.productAndSkusLines = [];
                productAndSkusLines.forEach(productAndSkusLine => {
                  delete productAndSkusLine.creationTimestamp;
                  delete productAndSkusLine.lineNumber;
                  delete productAndSkusLine.creationTimestamp;
                  delete productAndSkusLine.restrictionsApplied;
                  delete productAndSkusLine.restrictionsList;

                  delete productAndSkusLine.restrictionsList;
                  (productAndSkusLine.options || []).forEach(opt => {
                    delete opt.defaultSelected
                  })
                  // (productAndSkusLine.options || []).forEach(option =>
                  //   delete option.defaultSelected;
                  // })

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


      dataOrder.order.deals = dataOrder.order.deals.filter(deal => {
        return !dealsIdToDelete.includes(deal.deal.id)
      })

      dataOrder.order.items = dataOrder.order.items.filter(item => {
        return !itemsIdToDelete.includes(item.extRef)
      })

      // alert("dataOrder.order.deals.length " + dataOrder.order.deals.length)
      // alert("dataOrder.order.items.length " + dataOrder.order.items.length)

      //let createBookingSlotOccupancy = false;
      if (dataOrder.bookingSlot) {
        //createBookingSlotOccupancy = true;
        //dataOrder.bookingSlot = {...getOrderInCreation().bookingSlot}
        delete dataOrder.bookingSlot.available;
        delete dataOrder.bookingSlot.full;
        delete dataOrder.bookingSlot.closed;
        delete dataOrder.bookingSlot.totalPreparionTime;
        delete dataOrder.bookingSlot.deliveryNumber;


        dataOrder.bookingSlot.startDateIso = dataOrder.bookingSlot.startDate.format();
        dataOrder.bookingSlot.endDateIso = dataOrder.bookingSlot.endDate.format();
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
              delete item.restrictionsApplied;
              delete item.restrictionsList;
            }
        )
      }

      if (dataOrder.charges) {
        dataOrder.charges.forEach(charge => {
              delete charge.restrictionsList;
              delete charge.restrictionsApplied;
              charge.price = parseFloat(charge.price.toFixed(2))
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

      if (dataOrder.order.discounts) {
        dataOrder.order.discounts.forEach(discount => {
              delete discount.uuid;
            }
        )
      }

      dataOrder.information = buildOrderInformation();
      dataOrder.additionalInfo = values.additionalInfo || getOrderInCreation().additionalInfo;

      let detailPrice = computePriceDetail(getOrderInCreation());

      dataOrder.totalPreparationTime = detailPrice.totalPreparationTime;
      dataOrder.totalPrice = parseFloat(detailPrice.total);
      dataOrder.totalNonDiscounted = parseFloat(detailPrice.totalNonDiscounted);
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
      if (bookWithoutAccount) {
        dataOrder.customer = {
          brandId: currentBrand.id,
          anonymous: true,
          defaultEstablishmentId: currentEstablishment().id,
          establishmentIds: [currentEstablishment().id],
          userProfileInfo: {
            customerDeliveryInformation: values.customerDeliveryInformation,
            email:  values.email,
            address: getOrderInCreation()?.deliveryAddress?.address || "",
            lat: getOrderInCreation()?.deliveryAddress?.lat,
            lng: getOrderInCreation()?.deliveryAddress?.lng,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: parsePhoneNumber(values.phone, 'FR').number
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

      dataOrder.expectedPayments = expectedPaymentMethods;
      if (paymentMethod === "cc" && !isPaymentSystemPay()) {
        dataOrder.tempOrder = true;
      }

      if (isPaymentSystemPay() && isPaymentSystemPayAndCCSelected()) {

        dataOrder.payments = [{
          uuid: uuid(),
          valuePayment: PAYMENT_METHOD_SYSTEMPAY,
          amount: detailPrice.total.toFixed(2)
        }]

      }

      result = await executeMutationUtil(createOrderMutation(currentBrand.id, currentEstablishment().id, dataOrder));
      orderId = result.data.addOrder.id;
      if (paymentMethod === "cc" && !noStripe && !isPaymentSystemPay()) {
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

      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null, 2))
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
      router.push('/confirmed/confirmedOrder?orderId=' + orderId)
    }
  }

  function setSelectedBookingSlot(bookingSlot) {
    //alert("setSelectedBookingSlot " + JSON.stringify(bookingSlot))
    setOrderInCreation({
      ...getOrderInCreation(),
      bookingSlot: bookingSlot,
    })
  }

  function setDeliveryMode(deliveryMode: string) {
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryMode: deliveryMode,
      bookingSlot: null,
    })
  }

  function updateDeliveryAdress(address, lat, lng, id, name, customerDeliveryInformation, distance) {
    //alert("updateDeliveryAdress " + distance);

    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: {
        address: address,
        lat: lat,
        lng: lng,
        id: id,
        name: name,
        customerDeliveryInformation: customerDeliveryInformation || getOrderInCreation().deliveryAddress?.customerDeliveryInformation,
        distance: distance
      },
    })
  }

  function updateCustomerDeliveryInformation(customerDeliveryInformation) {
    setOrderInCreationNoLogic({
      ...getOrderInCreation(),
      deliveryAddress: {
        ...getOrderInCreation().deliveryAddress,
        customerDeliveryInformation: customerDeliveryInformation,
      },
    })
  }


  function resetDeliveryAdress() {
    //alert("resetDeliveryAdress")
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: null,
    })
  }

  function resetCustomerDeliveryInformation() {
    //alert("resetDeliveryAdress")
    setOrderInCreation({
      ...getOrderInCreation(),
      deliveryAddress: {
        ...getOrderInCreation().deliveryAddress,
        customerDeliveryInformation: null
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

  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    setPaymentMethod(name)
  }

  async function checkDistance(lat, lng) {
    let distInfo;
    if (currentEstablishment()) {
      distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
      setDistanceAndCheck(distInfo,
          (maxDistanceReached) => {
            setMaxDistanceReached(maxDistanceReached);
          },
          setDistanceInfo, currentEstablishment);
      // const currentService = getCurrentService(currentEstablishment(), bookingSlotStartDate);
      // processOrderInCreation(currentEstablishment, currentService, orderInCreation,
      //     setGlobalDialog, setRedirectPageGlobal, distInfo)
    }
    return distInfo;
  }

  function getSubmitText(values) {
    // if (!paymentMethod) {
    //   return localStrings.check.noSelectPaymentMethod;
    // }
    if (paymentMethod === "delivery"  && expectedPaymentMethods.length === 0) {
      return localStrings.check.noSelectPaymentMethod;
    }

    if (!getOrderInCreation().bookingSlot) {
      return localStrings.check.noSelectSlotMethod;
    }

    if (getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && maxDistanceReached) {
      return localStrings.check.maxDistanceReached;
    }

    if (!getOrderInCreation()?.deliveryAddress && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      return localStrings.check.noDeliveryAdress;
    }

    if (getCartItems(getOrderInCreation).length === 0) {
      return localStrings.check.noItemInCart;
    }

    if (!checkoutSchema(bookWithoutAccount).isValidSync(values)) {
      return localStrings.check.badContactInfo;
    }

    if (!cgvChecked) {
      return localStrings.check.pleaseAcceptCgv;
    }

    return paymentMethod === "cc" ?
        localStrings.formatString(localStrings.checkOutNowAndPayCard,
            computePriceDetail(orderInCreation).total.toFixed(2))
        :
        localStrings.formatString(localStrings.checkOutNowAndPayLater,
            computePriceDetail(orderInCreation).total.toFixed(2))
  }

  function getPaymentsOnline() {
    if (!currentEstablishment() || !currentEstablishment().offlinePaymentMethods)
    {
      return [];
    }
    return currentEstablishment().offlinePaymentMethods.map(methodkey => {
      return ({
        valuePayment: methodkey,
        name: formatPaymentMethod(methodkey, localStrings)
      })
    })
  }

  function isPaymentDisabled(values) {
    return (paymentMethod === "delivery" && expectedPaymentMethods.length === 0) ||
        !cgvChecked ||
        !checkoutSchema(bookWithoutAccount).isValidSync(values) ||
        !getOrderInCreation().bookingSlot ||
        loading || getCartItems(getOrderInCreation).length == 0 ||
        (!getOrderInCreation()?.deliveryAddress && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) ||
        (getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && maxDistanceReached) ||
        paymentMethod === "cc" && !paymentCardValid && !isPaymentSystemPay();
  }

  function isPaymentSystemPay() {
    return currentBrand()?.config?.paymentWebConfig?.paymentType === PAYMENT_MODE_SYSTEM_PAY
  }

  function isPaymentSystemPayAndCCSelected() {
    return isPaymentSystemPay() && paymentMethod === 'cc'
  }

  function isPaymentStripe() {
    return currentBrand()?.config?.paymentWebConfig?.paymentType === PAYMENT_MODE_STRIPE
  }

  function getOrderAmount() {
    let detailPrice = computePriceDetail(getOrderInCreation());
    return parseFloat(detailPrice.total);
  }

  function getEmailCustomer(values) {
    if (bookWithoutAccount) {
      return values.email
    }
    else {
      return dbUser.userProfileInfo.email;
    }
  }

  function getSystemPublicKey() {
    return contextData.brand.config.paymentWebConfig.systemPayPublicKey;
  }

  function getSystemEndPoint() {
    let systemPayEndPoint = contextData.brand.config.paymentWebConfig.systemPayEndPoint;

    var pathArray = systemPayEndPoint.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var url = protocol + '//' + host;

    return url;
  }

  return (
      <>
        <Dialog open={pickupAlert} maxWidth="sm"
        >
          <DialogContent className={classes.dialogContent}>
            <AlertHtmlLocal
                title={localStrings.warning}
                content={config.alertOnSelectPickup}
            >
            </AlertHtmlLocal>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setPickupAlert(false)} color="primary">
              {localStrings.IUnderstand}
            </Button>
          </DialogActions>
        </Dialog>


        {!payLoading && getCartItems(getOrderInCreation, true).length === 0 && (
            <>
              <EmptyBasket/>
            </>
        )}

        {payLoading &&
        <ClipLoaderComponent/>
        }

        {/*<p>{firstOrCurrentEstablishment().id}</p>*/}
        {!payLoading && getCartItems(getOrderInCreation, true).length > 0 &&
        <>
          {(!firstOrCurrentEstablishment() || !orderInCreation) ?
              // {false ?
              <ClipLoaderComponent/>
              :
              <>
                {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
                <Formik
                    initialValues={getInitialValues(dbUser)}
                    validationSchema={checkoutSchema(bookWithoutAccount)}
                    onSubmit={(values) => handleFormSubmit(values, null, null)}
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
                        {/*<p>{JSON.stringify(dbUser || {})}</p>*/}
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
                                  <Box>
                                    <Link href="/profile">
                                      <Button variant={"contained"}
                                              style={{textTransform: "none"}}
                                              color="primary" type="button" fullWidth>
                                        {localStrings.login}
                                      </Button>
                                    </Link>

                                    <Button variant={"contained"}
                                            style={{textTransform: "none", marginTop: "1rem"}}
                                            onClick={() => {
                                              setBookWithoutAccount(true)
                                            }}
                                            color="primary" type="button" fullWidth>
                                      {localStrings.continueWithoutAccount}
                                    </Button>
                                  </Box>
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
                            {isDeliveryPriceDisabled() === true &&
                            <>
                              {/*<p>DeliveryPriceDisabled</p>*/}
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
                            </>
                            }
                            <Typography fontWeight="800" mb={2} variant="h5">
                              {localStrings.selectDeliveryMode}
                            </Typography>
                            {/*<p>{JSON.stringify(getOrderInCreation() || {})}</p>*/}
                            {!isDeliveryPriceDisabled() && currentEstablishment()?.serviceSetting?.enableDelivery &&
                            <PresenterSelect
                                icon={faMotorcycle}
                                title={localStrings.delivery}
                                subtitle={localStrings.deliverySubTitle}
                                selected={getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY}
                                onCLickCallBack={() => {
                                  //setSelectedBookingSlot({});
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
                                  //setSelectedBookingSlot({});
                                  setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
                                  if (config.alertOnSelectPickup) {
                                    setPickupAlert(true)
                                  }
                                }}
                            />
                          </>
                          <>
                          </>
                        </Card1>
                        }

                        {(dbUser || bookWithoutAccount) && isDeliveryActive(currentEstablishment()) && getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&


                        <Card1 sx={{mb: '2rem'}}>
                          <>

                            {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                            getOrderInCreation().deliveryAddress &&
                            getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                            <Box p={1}>
                              <AlertHtmlLocal severity={maxDistanceReached ? "warning" : "success"}
                                              title={maxDistanceReached ?
                                                  localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                                              content={localStrings.formatString(localStrings.distanceOnly,
                                                  (distanceInfo.distance / 1000))}
                              />
                            </Box>
                            }
                            <Typography fontWeight="600" mb={2} mt={2} variant="h5">
                              {localStrings.selectDeliveryAdress}
                            </Typography>

                            {dbUser &&
                            <>
                              {!dbUser?.userProfileInfo?.address &&
                              <AlertHtmlLocal
                                  severity="warning"
                                  title={localStrings.warning}
                                  content={localStrings.warningMessage.noMainAddDefined}>

                                <Box display="flex" flexDirection="row-reverse">
                                  <Box mt={2}>
                                    <Link href={"/address/adressDetail?addId=main&back=" + encodeURI("/checkout")}>
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
                                    setCustomAddressSelected(false);
                                    setAdressValue(null);
                                    let distInfo = await checkDistance(dbUser?.userProfileInfo?.lat, dbUser?.userProfileInfo?.lng);
                                    updateDeliveryAdress(
                                        dbUser?.userProfileInfo?.address,
                                        dbUser?.userProfileInfo?.lat,
                                        dbUser?.userProfileInfo?.lng,
                                        "main",
                                        "main",
                                        dbUser?.userProfileInfo?.customerDeliveryInformation,
                                        distInfo?.distance,
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
                                        const distInfo = await checkDistance(item.lat, item.lng);
                                        setAdressValue(null);
                                        setCustomAddressSelected(false)
                                        updateDeliveryAdress(item.address,
                                            item.lat,
                                            item.lng,
                                            item.id,
                                            item.name,
                                            //item.additionalInformation,
                                            item.customerDeliveryInformation,
                                            distInfo?.distance
                                        );
                                      }}
                                  />
                              )}

                              <Box display="flex" flexDirection="row-reverse">
                                <Box mt={2} mb={2}>
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
                              <Grid item xs={12} lg={12} ml={2} mr={2}>
                                <GoogleMapsAutocomplete
                                    //ref={autocomp}
                                    borderColor={customAddressSelected && "primary.main"}
                                    border={customAddressSelected ? 4 : 0}
                                    borderRadius={"8px"}
                                    placeholderArg={dbUser ?
                                        localStrings.fillAddressDeliveryConnected : localStrings.fillAddressDelivery}
                                    noKeyKnown
                                    required
                                    setterValueSource={setAdressValue}
                                    valueSource={adressValue}
                                    disabled={adressEditLock}
                                    setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                      //let distInfo;
                                      if (currentEstablishment()) {
                                        let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                        //alert("distInfo?.distance " + JSON.stringify(distInfo || {}))
                                        setDistanceAndCheck(distInfo,
                                            (maxDistanceReached) => {
                                              if (maxDistanceReached) {
                                                setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT);
                                                setSelectedAddId(null);
                                                setCustomAddressSelected(false)
                                              }
                                              else {
                                                setCustomAddressSelected(true)
                                                setSelectedAddId(null);

                                              }
                                              setMaxDistanceReached(maxDistanceReached);

                                            },
                                            setDistanceInfo, currentEstablishment);
                                        updateDeliveryAdress(label, lat, lng, null, null, null, distInfo?.distance);
                                        //resetCustomerDeliveryInformation();
                                        // const currentService = getCurrentService(currentEstablishment(), bookingSlotStartDate);
                                        // processOrderInCreation(currentEstablishment, currentService, orderInCreation,
                                        //     setGlobalDialog, setRedirectPageGlobal, distInfo)
                                      } else {
                                        updateDeliveryAdress(label, lat, lng);
                                      }
                                      //setAdressValue(label)
                                      //alert("distInfo?.distance " + JSON.stringify(distInfo || {}))
                                      //updateDeliveryAdress(label, lat, lng, null, distInfo?.distance);
                                      //setAdressEditLock(true);
                                    }}/>
                              </Grid>
                            </Grid>
                            }

                            {!maxDistanceReached &&
                            <>
                              <Typography fontWeight="600" mb={2} mt={2}>
                                {localStrings.customerDeliveryInformation}
                              </Typography>

                              <Grid item xs={12} lg={12} ml={2} mr={2}>
                                <TextField

                                    multiline
                                    rows={4}
                                    className={classes.textField}
                                    name="customerDeliveryInformation"
                                    placeholder={localStrings.customerDeliveryInformationPlaceHolder}
                                    //label={!useMyAdress || localStrings.additionalInformation}
                                    fullWidth
                                    sx={{mb: '1rem'}}
                                    onBlur={handleBlur}
                                    onChange={(event) =>
                                        updateCustomerDeliveryInformation(event.target.value)}
                                    disabled={getOrderInCreation()?.deliveryAddress?.id}
                                    value={
                                      getOrderInCreation()?.deliveryAddress?.customerDeliveryInformation

                                    }
                                    //error={!!touched.additionalInformation && !!errors.additionalInformation}
                                    helperText={touched.additionalInfo && errors.additionalInfo}
                                />
                              </Grid>
                            </>
                            }


                            {getOrderInCreation()?.deliveryAddress?.id &&
                            <Box display="flex" flexDirection="row-reverse">
                              <Box mt={2}>
                                <Link
                                    // href={"/address/adressDetail?addId=" + getOrderInCreation().deliveryAddress.id + "?back=" + encodeURI("/checkout")}>
                                    href={"/address/adressDetail?addId=" + getOrderInCreation().deliveryAddress.id}>
                                  <Button variant="contained" color="primary" type="button" fullWidth
                                          style={{textTransform: "none"}}
                                  >
                                    {localStrings.updateCustomerDeliveryInformation}
                                  </Button>
                                </Link>
                              </Box>
                            </Box>
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
                          {getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && config.notesDelivery &&
                          <Box mb={2}>
                          <AlertHtmlLocal severity={"info"}
                                          //title={localStrings.warningMessage.paymentIssue}
                                          //content={getOrderInCreation().deliveryMode}
                          >
                            <MdRender content = {config.notesDelivery}/>
                          </AlertHtmlLocal>
                          </Box>
                          }

                          <Typography fontWeight="600" mb={2} variant="h5">
                            {getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY ?
                                localStrings.selectDeliveryTimeSlot : localStrings.selectPickupTimeSlot}
                          </Typography>

                          <BookingSlots
                              contextData={contextData}
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

                        {(dbUser || bookWithoutAccount) &&

                        <>
                          <Card1 sx={{mb: '2rem'}}>

                            <Typography fontWeight="600" mb={2}>
                              {localStrings.bookingadditionalInformationNotes}
                            </Typography>

                            <TextField
                                multiline
                                rows={4}
                                className={classes.textField}
                                name="additionalInfo"
                                placeholder={localStrings.bookingadditionalInformationNotesPlaceHolder}
                                //label={!useMyAdress || localStrings.additionalInformation}
                                fullWidth
                                sx={{mb: '1rem'}}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                //disabled={getOrderInCreation()?.deliveryAddress?.id}
                                value={
                                  values.additionalInfo
                                }
                                //error={!!touched.additionalInformation && !!errors.additionalInformation}
                                helperText={touched.additionalInfo && errors.additionalInfo}
                            />

                          </Card1>
                          <Card1 sx={{mb: '2rem'}}>

                            {checkoutError &&
                            <AlertHtmlLocal severity={"error"}
                                            title={localStrings.warningMessage.paymentIssue}
                                            content={checkoutError.toString()}
                            />
                            }

                            <Typography fontWeight="600" mb={2}>
                              {localStrings.paymentMethod}
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
                                sx={{mb: '.5rem'}}
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
                                  sx={{mb: '0.5rem'}}
                                  onChange={handlePaymentMethodChange}
                              />
                            </>
                            }

                            <Typography fontWeight="600" mb={2}>
                              {localStrings.paymentMethodsForPickup}
                            </Typography>


                            {paymentMethod !== 'cc' &&
                            <FormGroup>
                              {getPaymentsOnline().map((item, key) =>
                                  <FormControlLabel key={key}
                                                    control={
                                                      <Checkbox
                                                          checked={expectedPaymentMethods.map(p => p.valuePayment).includes(item.valuePayment)}
                                                          onChange={(event) => {
                                                            //alert("checked " + event.target.checked);
                                                            if (event.target.checked) {
                                                              setExpectedPaymentMethods([...expectedPaymentMethods, item])
                                                            } else {
                                                              let filter = expectedPaymentMethods.filter(p => p.valuePayment !== item.valuePayment);
                                                              setExpectedPaymentMethods(filter)
                                                            }
                                                          }}
                                                      />
                                                    }
                                                    label={item.name}/>
                              )}
                            </FormGroup>
                            }

                            {paymentMethod === 'cc' &&
                            <>
                              {isPaymentSystemPay() &&
                              <>
                                {!loading &&
                                <KRPayment
                                    paidCallBack={async (transactionId, uuidvalue) => await handleFormSubmit(values, transactionId, uuidvalue)}
                                    publicKey={getSystemPublicKey()}
                                    endPoint={getSystemEndPoint()}
                                    email={getEmailCustomer(values)}
                                    amount={getOrderAmount()}
                                    currency={contextData.brand.config.currency}
                                    errorCallBack={message => setCheckoutError(message)}
                                    brandId={contextData.brand.id}
                                    text={getSubmitText(values)}
                                    disabled={
                                      isPaymentDisabled(values)
                                    }
                                    checkingPayCallBack={() => setPayLoading(true)}
                                />
                                }

                                {isPaymentDisabled(values) && !loading &&
                                <Button
                                    style={{textTransform: "none"}}
                                    variant="contained" color="primary" type="submit" fullWidth
                                    disabled
                                >
                                  {getSubmitText(values)}
                                </Button>
                                }
                              </>
                              }
                              {isPaymentStripe() &&
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
                              }
                            </>
                            }
                            <Box display="flex" flexDirection="row" mt={2}>
                              <FormGroup>
                                <Box>
                                  <FormControlLabel control={
                                    <Checkbox checked={cgvChecked}
                                              onChange={event => setCgvChecked(event.target.checked)} />
                                  }
                                                    label={
                                                      <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                                                        {/*{localStrings.bySigningTermsAndConditions}*/}
                                                        <a href="/cgv" target="_blank">
                                                          <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                                                            {localStrings.cgvAccept}
                                                          </H6>
                                                        </a>
                                                      </FlexBox>
                                                    } />
                                </Box>


                                {/*<Checkbox defaultChecked />*/}
                                {/*<Box>*/}
                                {/*  <a href={"/cgv"} target="new">*/}
                                {/*      {localStrings.seeCgvAccept}*/}
                                {/*  </a>*/}
                                {/*</Box>*/}
                              </FormGroup>
                            </Box>

                          </Card1>
                        </>
                        }



                        {(dbUser || bookWithoutAccount) &&
                        <Grid container spacing={6}>
                          <Grid item sm={isPaymentSystemPayAndCCSelected() ? 12 : 6} xs={12}>
                            <Link href="/cart">
                              <Button
                                  style={{textTransform: "none"}}
                                  variant="outlined" color="primary" type="button" fullWidth
                                  style={{textTransform: "none"}}>
                                {localStrings.backToCart}
                              </Button>
                            </Link>
                          </Grid>

                          {!isPaymentSystemPayAndCCSelected() &&
                          <Grid item sm={6} xs={12}>
                            <Button
                                style={{textTransform: "none"}}
                                variant="contained" color="primary" type="submit" fullWidth
                                type="submit"
                                //endIcon={<SaveIcon />}
                                disabled={
                                  isPaymentDisabled(values)
                                }
                                endIcon={loading ?
                                    <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
                            >
                              {getSubmitText(values)}
                            </Button>
                          </Grid>
                          }
                        </Grid>
                        }
                      </form>
                  )}
                </Formik>
              </>
          }
        </>
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
    additionalInfo: '',
    customerDeliveryInformation: '',
  }
}

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const checkoutSchema = (bookWithoutAccount) => {

  if (bookWithoutAccount) {
    return yup.object().shape({
          lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
          email: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
          phone: yup.string()
              .test(
                  'goodFormat',
                  localStrings.check.badPhoneFormat,
                  value => {
                    if (!value) {
                      return false;
                    }
                    const phoneNumber = parsePhoneNumber(value, 'FR');
                    //console.log("phoneNumber " + JSON.stringify(phoneNumber, null, 2))
                    return phoneNumber?.isValid();
                  })
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

