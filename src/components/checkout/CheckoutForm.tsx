import Card1 from '@component/Card1'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Radio,
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
  BRAND_COLLECTION, ESTABLISHMENT_COLLECTION, ORDER_COLLECTION,
  ORDER_DELIVERY_MODE_DELIVERY,
  ORDER_DELIVERY_MODE_PICKUP_ON_SPOT,
  ORDER_SOURCE_ONLINE,
  ORDER_STATUS_NEW, PAYMENT_METHOD_STRIPE,
  PAYMENT_METHOD_SYSTEMPAY, PAYMENT_METHOD_TAKE_PAYMENTS,
  PAYMENT_MODE_STRIPE,
  PAYMENT_MODE_SYSTEM_PAY, PAYMENT_MODE_TAKE_PAYMENTS, PRICING_EFFECT_FIXED_PRICE, TAKE_PAYMENT_TEMP_COLLECTION
} from "../../util/constants";
import BookingSlots from '../../components/form/BookingSlots';
import useAuth from "@hook/useAuth";
import moment from 'moment';
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import {ACCES_ERROR, OUT_OF_RANGE, distanceAndCheck} from "@component/address/AdressCheck";
import {
  computePriceDetail, firstOrCurrentEstablishment,
  formatPaymentMethod, getBrandCurrency,
  getDeliveryDistanceWithFetch, getEstablishmentSettings,
  getProfileName,
  getSkusListsFromProducts,
  isDeliveryActive
} from "../../util/displayUtil";
import {makeStyles} from "@material-ui/styles";
import {isMobile} from "react-device-detect";
import {cloneDeep} from "@apollo/client/utilities";
import {uuid} from "uuidv4";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import AlertHtmlLocal from "../../components/alert/AlertHtmlLocal";
import {
  addOrderToCustomer,
  bulkDeleteOrderMutation,
  createOrderMutation,
} from '../../gql/orderGql'
import {addErrorMutation} from '../../gql/errorGql'

import {green} from "@material-ui/core/colors";
import {addDiscountToCart, addToCartOrder, getCartItems, removeStuartChargeToCart} from "../../util/cartUtil";
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
import {H6} from "@component/Typography";
import MdRender from "@component/MdRender";
import * as ga from '../../../lib/ga'
import CloseIcon from "@material-ui/icons/Close";
import UpSellDeal from "@component/products/UpSellDeal";
import {Base64} from 'js-base64';
import {pixelInitiateCheckout, pixelPurchaseContent} from "../../util/faceBookPixelUtil";
import TakePaymentPopup from  './TakePaymentPopup'
import firebase from "../../lib/firebase";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";

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
  setAddressLoading: any
  addressLoading: any
}

export function getStuartAmountAndRound(initalAmount : any, currentEstablishment: any, contextData: any) {
  const feeByShopPercent =  getEstablishmentSettings(firstOrCurrentEstablishment(currentEstablishment, contextData), 'feeByShopPercent');
  const amount = parseFloat(initalAmount) - (parseFloat(initalAmount) * (parseFloat(feeByShopPercent) / 100 || 0));
  return (Math.round(amount * 100) / 100).toFixed(2);
}

function getStuartMessage(orderInCreation, stuartError, stuartAmount, ret: {}) {
  if (orderInCreation?.deliveryMode !== ORDER_DELIVERY_MODE_DELIVERY) {
    return null;
  }

  if (!orderInCreation.bookingSlot) {
    return null;
  }
  // if (!orderInCreation.bookingSlot?.startDate || (!stuartError && !stuartAmount)) {
  if (!orderInCreation.bookingSlot?.startDate) {
    return null;
  }
  if (stuartError === ACCES_ERROR) {
    ret.message = localStrings.warningMessage.stuartConnectionIssue;
    ret.severity = "error";
    return ret
  }
  else if (stuartError === OUT_OF_RANGE) {
    ret.message = localStrings.warningMessage.stuartOutOfRange;
    ret.severity = "error";
    return ret
  }
  else if (stuartError) {
    ret.message = stuartError;
    ret.severity = "error";
    return ret
  }

  //console.log(stuartError)
  ret.message = localStrings.warningMessage.stuartDeliveryPossible;
  ret.severity = "success";
  return ret
}

export function getMessagDeliveryAddress(currentEstablishment, orderInCreation, maxDistanceReached, stuartError, stuartAmount, zoneMap) {

  const ret = {};
  if (getEstablishmentSettings(currentEstablishment(), 'deliveryStuartActive')) {
    return getStuartMessage(orderInCreation, stuartError, stuartAmount, ret);
  }

  ret.message =  maxDistanceReached && !zoneMap ?
      localStrings.warningMessage.maxDistanceDelivery :
      (
          zoneMap ?
              localStrings.formatString(localStrings.warningMessage.maxDistanceDeliveryOkZone, zoneMap)
              :
              localStrings.warningMessage.maxDistanceDeliveryOk
      );

  ret.severity = maxDistanceReached && !zoneMap ? "warning" : "success";
  return ret;
}

export function getOrderAmount(getOrderInCreation) {
  let detailPrice = computePriceDetail(getOrderInCreation());
  return parseFloat(detailPrice.total);
}

function isStuartInactiveOrSlotSelected(currentEstablishment, getOrderInCreation) {
  return !getEstablishmentSettings(currentEstablishment(), 'deliveryStuartActive') || getOrderInCreation().bookingSlot?.startDate;
}

function isStuartActive(currentEstablishment, contextData) {
  return getEstablishmentSettings(firstOrCurrentEstablishment(currentEstablishment, contextData), 'deliveryStuartActive');
}

var paymentOk = false;

const CheckoutForm: React.FC<CheckoutFormProps> = ({contextData, noStripe, setAddressLoading, addressLoading}) => {
  const formRef = useRef()
  const language = contextData?.brand?.config?.language || 'fr';
  let stripe;
  let elements;
  if (!noStripe) {
    stripe = useStripe();
    elements = useElements();
  }
  const classes = useStyles();
  const [cgvChecked, setCgvChecked] = React.useState(false);
  const [pickupAlert, setPickupAlert] = React.useState(false);

  const [checkoutError, setCheckoutError] = useState();
  const [useMyAdress, setUseMyAdress] = useState(false);
  const [selectedAddId, setSelectedAddId] = useState(null);
  const [customAddressSelected, setCustomAddressSelected] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const [bookWithoutAccount, setBookWithoutAccount] = useState(false);
  const [paymentCardValid, setPaymentCardValid] = useState(false);
  const router = useRouter()
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  const [adressValue, setAdressValue] = useState("");
  const [adressSearch, setAdressSearch] = useState(false);
  const [checkAddLoading, setCheckAddLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const { setOrderInCreation, getOrderInCreation, currentEstablishment, currentBrand,
    dbUser, resetOrderInCreation, orderInCreation, increaseOrderCount, setOrderInCreationNoLogic,
    maxDistanceReached, setMaxDistanceReached, setLoginDialogOpen,setGlobalDialog,
    checkDealProposal, dealCandidates, setDealCandidates, setPrefferedDealToApply,
    orderUpdating, setRefusedDeals, refusedDeals,
    stuartCurrency, setStuartCurrency,
    stuartError, setStuartError,
    stuartAmount, setStuartAmount,
    zoneMap, setZoneMap
  } = useAuth();
  const [distanceInfo, setDistanceInfo] = useState(null);

  const loaded = React.useRef(false);
  const [paymentMethod, setPaymentMethod] = useState('delivery')
  const [wantedDeliveryMode, setWantedDeliveryMode] = useState(null)
  const [expectedPaymentMethods, setExpectedPaymentMethods] = useState([])
  const [dialogDealProposalContent, setDialogDealProposalContent] = useState(false)
  const [maxPointsToSpend, setMaxPointsToSpend] = useState(0)
  const [saveAmountWithPoint, setSaveAmountWithPoint] = useState(0)

  const [maxPointsToSpendSave, setMaxPointsToSpendSave] = useState(0)
  const [saveAmountWithPointSave, setSaveAmountWithPointSave] = useState(0)

  const [pointsUsed, setPointsUsed] = useState(false);
  const [manualAddressOutOfBound, setManualAddressOutOfBound] = useState(false);
  const [priceDetails, setPriceDetails] = useState(false);
  const [excludedPayments, setExcludedPayments]=useState([]);
  const [displayTakePaymentsDialog, setDisplayTakePaymentsDialog]=useState(false);
  const [uuidPayment, setUuidPayment] = useState("");


  const db = firebase.firestore();

  useEffect(() => {

    let tempId = uuid();
    db.collection(BRAND_COLLECTION)
        .doc(config.brandId)
        .collection(TAKE_PAYMENT_TEMP_COLLECTION)
        .where("uuidPayment", "==", tempId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
              //console.log("New city: ", change.doc.data());
              let data = change.doc.data();
              // alert("Current data: " + data);
              setDisplayTakePaymentsDialog(false);
              if (data.responseStatus !== "0") {
                setCheckoutError(data.responseMessage)
              }
              else {
                paymentOk = true;
                if (formRef.current) {
                  formRef.current.handleSubmit()
                }
                //await handleFormSubmit()
              }
            }
          });
        });

    setUuidPayment(tempId);
  }, [currentBrand()])

  useEffect(() => {
    pixelInitiateCheckout(currentBrand(), getOrderInCreation())
  }, [])

  useEffect(() => {
    setPaymentMethod(
        (currentBrand()?.config?.paymentWebConfig?.activateOnlinePayment &&
            currentBrand()?.config?.paymentWebConfig?.forceOnlinePaymentDelivery) ? "cc" : "delivery");
  }, [currentBrand()])

  useEffect(() => {
    setPriceDetails(computePriceDetail(getOrderInCreation()))
  }, [getOrderInCreation])

  useEffect(() => {
    if (currentEstablishment() &&
        isDeliveryPriceDisabled() && !orderInCreation?.deliveryMode && orderInCreation?.deliveryMode !== ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
      setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
    }
    ga.gaCheckout(getOrderInCreation(), currentBrand())
    setSelectedAddId(getOrderInCreation()?.deliveryAddress?.id);
    setRefusedDeals([]);
    pixelInitiateCheckout(currentBrand(), getOrderInCreation())
  }, [])

  useEffect(() => {
    if (dealCandidates && dealCandidates.length > 0) {
      setDialogDealProposalContent(true);
    }
    else {
      setDialogDealProposalContent(false);
    }
  }, [dealCandidates])



  useEffect(() => {
    if (dbUser) {
      let priceDetail = computePriceDetail(orderInCreation);
      const conversion = currentBrand()?.config?.loyaltyConfig?.loyaltyConversionSpend;
      const pointOwned = dbUser.loyaltyPoints;
      const priceInPoints = priceDetail.total * conversion
      const maxPointToSpend = Math.min(Math.ceil(priceInPoints), pointOwned);
      const saveAmount = Math.min(priceDetail.total, pointOwned / conversion);
      setMaxPointsToSpend(maxPointToSpend);
      setSaveAmountWithPoint(saveAmount);
    }
  }, [orderInCreation, dbUser])



  useEffect(() => {

    const initEffect = async () => {
      if (currentEstablishment() &&
          isDeliveryPriceDisabled() && !orderInCreation?.deliveryMode && orderInCreation?.deliveryMode !== ORDER_DELIVERY_MODE_PICKUP_ON_SPOT) {
        setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT)
      }
      ga.gaCheckout(getOrderInCreation(), currentBrand())
      setSelectedAddId(getOrderInCreation()?.deliveryAddress?.id);
      setRefusedDeals([]);
      pixelInitiateCheckout(currentBrand(), getOrderInCreation())

    };

    initEffect()
  }, [])


  function firstOrCurrentEstablishment() {
    if (currentEstablishment()) {
      return currentEstablishment();
    }
    return contextData?.establishments[0];
  }

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

  function getPaymentOnDeliveryValue() {
    return getEstablishmentSettings(currentEstablishment(), 'paymentOnDelivery') &&
        getEstablishmentSettings(currentEstablishment(), 'deliveryStuartActive');
  }

  const processPayment = async(orderId, values, dataOrder) => {

    if (noStripe) {
      return;
    }

    try {
      const data = await axios.post(config.paymentUrl, {
        //amount: 200
        orderId: orderId,
        establishmentId: currentEstablishment().id,
        brandId: currentBrand().id
      });


      if ( getPaymentOnDeliveryValue() && !data.errorMessage &&
          getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
        dataOrder.stripeSecret = data.data;
        return data.data;
      }

      if (data.errorMessage) {
        setCheckoutError(data.errorMessage);
        return null;
      }

      const paymentMethodReq = await processPaymentMethod(values);


      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        return null;
      }


      const resPay = await stripe.confirmCardPayment(data.data, {
        payment_method: paymentMethodReq.paymentMethod.id
      });

      if (resPay.error) {
        setCheckoutError(resPay.error.message);
        return null;
      }

      //update order
      //await executeQueryUtil(getOrderByIdQuery(currentBrand().id, currentEstablishment().id, orderId));
      return resPay;

    } catch (err) {
      setCheckoutError(err.message);
      console.log("error pay" + JSON.stringify(err, null,2));
      return null;
    }

  }

  async function processPaymentMethod(values: any) {
    const cardElement = elements.getElement("card");
    const billingDetails = {
      name: bookWithoutAccount ? (values.firstName + " " + values.lastName).trim() : getProfileName(dbUser),
      email: bookWithoutAccount ? values.email : dbUser.userProfileInfo.email,
      address: {
        line1: !bookWithoutAccount ? dbUser.userProfileInfo.address : null,
      }
    };
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails
    });
    return paymentMethodReq;
  }

  const handleFormSubmit = async (values: any, transactionId: string, uuidvalue: string) => {

    if (isPaymentTakepayment() && paymentMethod === "cc" && !paymentOk) {
      if (!paymentOk) {
        setDisplayTakePaymentsDialog(true)
        return;
      }
    }
    paymentOk = false;
    let errorOccured;
    setLoading(true);
    let orderId = 0;
    let dataOrder;
    const currentBrand = contextData.brand;
    try {
      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null,2))

      dataOrder = cloneDeep(getOrderInCreation());

      if (dataOrder.deliveryMode !== ORDER_DELIVERY_MODE_DELIVERY ) {
        dataOrder.deliveryAddress = null;
      }

      if (transactionId) {
        dataOrder.paymentTransactionId = transactionId;
      }
      if (uuidvalue) {
        dataOrder.paymentUuid = uuidvalue;
      }

      //filerRestricted
      let itemsIdToDelete = [];
      let dealsIdToDelete = [];

      if (dataOrder.order.items && dataOrder.order.items.length > 0) {
        dataOrder.order.items.forEach(item => {
          if (itemHaveRestriction(item)) {
            itemsIdToDelete.push(item.extRef)
          }
          delete item.productId;
          delete item.creationTimestamp;
          delete item.uuid;

          delete item.canditeDeal;
          delete item.takenFromCart;
          delete item.lineIndex;

          (item.options || []).forEach(opt => {
            delete opt.defaultSelected;
            delete opt.noSelectOption;
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

                deal.deal.lines.forEach(line => {
                  delete line.quantity;
                  line.pricingValue = line.pricingValueAfterDisc ? line.pricingValueAfterDisc.toString() : "0";
                  delete line.pricingValueAfterDisc;
                  if (typeof line.pricingValue !== "string") {
                    line.pricingValue = line.pricingValue.toString()
                  }
                })

                let productAndSkusLines = cloneDeep(deal.productAndSkusLines);
                deal.productAndSkusLines = [];
                //deal.productAndSkusLines.productAndSkusLines = [];
                productAndSkusLines.forEach(productAndSkusLine => {
                  delete productAndSkusLine.creationTimestamp;
                  delete productAndSkusLine.lineNumber;
                  delete productAndSkusLine.creationTimestamp;
                  delete productAndSkusLine.restrictionsApplied;
                  delete productAndSkusLine.restrictionsList;
                  delete productAndSkusLine.takenFromCart;
                  if (typeof productAndSkusLine.price !== "string") {
                    productAndSkusLine.price = productAndSkusLine.price.toString()
                  }
                  delete productAndSkusLine.restrictionsList;
                  (productAndSkusLine.options || []).forEach(opt => {
                    delete opt.defaultSelected;
                    delete opt.noSelectOption;
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

      if (dataOrder.bookingSlot) {
        delete dataOrder.bookingSlot.available;
        delete dataOrder.bookingSlot.full;
        delete dataOrder.bookingSlot.closed;
        delete dataOrder.bookingSlot.totalPreparionTime;
        delete dataOrder.bookingSlot.deliveryNumber;
        delete dataOrder.bookingSlot.locked;

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

              const options = item.options || [];
              options.forEach(option => {
                delete option.unavailableInEstablishmentIds;
              })
            }
        )
      }

      if (dataOrder.charges) {
        dataOrder.charges.forEach(charge => {
              delete charge.restrictionsList;
              delete charge.restrictionsApplied;
              delete charge.nonDiscountedPrice;
              delete charge.stuart;
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

      if (dataOrder.discounts) {
        dataOrder.discounts.forEach(discount => {
              delete discount.uuid;
              delete discount.initialPricingValue;
              delete discount.restrictionsApplied;
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
      dataOrder.totalPriceNoCharge = parseFloat(detailPrice.totalNoCharge);
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
      if (paymentMethod === "cc" && !isPaymentSystemPay() && !isPaymentTakepayment() && !getPaymentOnDeliveryValue()) {
        dataOrder.tempOrder = true;
      }

      if (isPaymentSystemPay() && isPaymentSystemPayAndCCSelected()) {

        dataOrder.payments = [{
          uuid: uuid(),
          valuePayment: PAYMENT_METHOD_SYSTEMPAY,
          amount: detailPrice.total.toFixed(2)
        }]

      }

      if (isPaymentStripe() && isPaymentStripeAndCCSelected()) {

        dataOrder.payments = [{
          uuid: uuid(),
          valuePayment: PAYMENT_METHOD_STRIPE,
          amount: detailPrice.total.toFixed(2)
        }]

      }

      if (isPaymentTakepayment()) {
        dataOrder.payments = [{
          uuid: uuid(),
          valuePayment: PAYMENT_METHOD_TAKE_PAYMENTS,
          amount: detailPrice.total.toFixed(2)
        }]
      }

      if (dataOrder.payments) {
        dataOrder.payments.forEach(payment => {
          payment.uuid = uuid();
          if (getPaymentOnDeliveryValue() &&
              getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY){
            delete payment.amount;
          }
        })
      }

      if (paymentMethod === "cc" && !noStripe && isPaymentStripe() && getPaymentOnDeliveryValue()) {
        const paymentMethodReq = await processPaymentMethod(values);
        dataOrder.paymentMethodId = paymentMethodReq.paymentMethod.id;
      }

      result = await executeMutationUtil(createOrderMutation(currentBrand.id, currentEstablishment().id, dataOrder));
      orderId = result.data.addOrder.id;
      if (paymentMethod === "cc" && !noStripe && isPaymentStripe() &&
          (!getPaymentOnDeliveryValue() || getOrderInCreation().deliveryMode !== ORDER_DELIVERY_MODE_DELIVERY)) {
        let payResult = await processPayment(result.data.addOrder.id, values, dataOrder);

        console.log("payResult " + JSON.stringify(payResult, null, 2))
        if (!payResult) {
          //delete the order

          await executeMutationUtil(bulkDeleteOrderMutation(currentBrand.id, currentEstablishment().id, [orderId]));
          setLoading(false);
          return;
        }
      }
      if (dataOrder.customer && dataOrder.customer.id && !bookWithoutAccount) {
        await executeMutationUtil(addOrderToCustomer(currentBrand.id, dataOrder.customer.id, {
          ...dataOrder,
          id:result.data.addOrder.id,
          orderNumber: result.data.addOrder.orderNumber
        }))
      }

      ga.gaPurchase(result.data.addOrder, () => currentBrand);
      pixelPurchaseContent(currentBrand, result.data.addOrder);
      console.log("orderInCreation " + JSON.stringify(getOrderInCreation(), null, 2))
      increaseOrderCount();
      resetOrderInCreation();
    }
    catch (err) {
      console.log(err);
      errorOccured = err;
      alert(err.message)
    }
    finally {
      setLoading(false);
      //setLoading(false);
    }
    if (errorOccured) {
      let query = addErrorMutation(currentBrand.id,
          Base64.encodeURI(JSON.stringify({
            error: errorOccured.message,
            //customer: errorOccured.message,
            order: dataOrder
          })));

      await executeMutationUtil(query)
    }
    if (orderId != 0) {
      router.push('/confirmed/confirmedOrder?orderId=' + orderId + '&establishmentId=' + currentEstablishment().id)
    }
  }

  function setSelectedBookingSlot(bookingSlot, charge) {
    const chargeWithoutStuart = (getOrderInCreation().charges || []).filter(c => !c.stuart)

    if (charge) {
      setOrderInCreation({
        ...getOrderInCreation(),
        charges: [...chargeWithoutStuart, charge],
        bookingSlot: bookingSlot,
      });
    }
    else {
      setOrderInCreationNoLogic({
        ...getOrderInCreation(),
        bookingSlot: bookingSlot,
        charges: [...chargeWithoutStuart]
      });
    }
  }

  async function setDeliveryMode(deliveryMode: string) {
    setWantedDeliveryMode(deliveryMode)
    setExpectedPaymentMethods([])
    let charges = [];
    if (deliveryMode == ORDER_DELIVERY_MODE_DELIVERY)
    {
      charges = getOrderInCreation().charges.filter(c => !c.stuart)
    }
    await setOrderInCreation({
      ...getOrderInCreation(),
      charges: charges,
      deliveryMode: deliveryMode,
      bookingSlot: null,
    })
    setWantedDeliveryMode(null)
  }

  function resetDeliveryAddress() {
    setSelectedAddId(null)
    setOrderInCreationNoLogic({
      ...getOrderInCreation(),
      deliveryAddress: null
    }, false, null, null, null, true)
  }

  function updateDeliveryAdress(address, lat, lng, id, name, customerDeliveryInformation, distance, zoneId, charge, deliveryMode) {
    setOrderInCreation({
      ...getOrderInCreation(),
      charges: [charge],
      deliveryMode: deliveryMode || getOrderInCreation().deliveryMode,
      bookingSlot: null,
      deliveryAddress: {
        address: address,
        lat: lat,
        lng: lng,
        id: id,
        name: name,
        customerDeliveryInformation: customerDeliveryInformation,
        distance: distance,
        zoneId: zoneId,

      },
    }, false, null, null, null, true)
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

  function isDeliveryPriceDisabled() {
    let totalDiscounts = 0;
    if (getOrderInCreation() && getOrderInCreation().discounts) {
      getOrderInCreation().discounts.forEach(d => totalDiscounts += parseFloat(d.pricingOff))
    }


    return isDeliveryActive(currentEstablishment()) &&
        getOrderInCreation() &&
        currentEstablishment().serviceSetting &&
        currentEstablishment().serviceSetting.minimalDeliveryOrderPrice &&
        computePriceDetail(getOrderInCreation()).totalNoCharge + totalDiscounts < currentEstablishment().serviceSetting.minimalDeliveryOrderPrice;
  }

  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    setPaymentMethod(name)
  }

  function setStuartAmountAndRound(data: { distanceInfo: null, amount: null, charge: null, currency: null, error: null, maxDistanceReached: boolean, zoneMap: null } | undefined, doNotCheckBookingSlot) {
    if (!doNotCheckBookingSlot && !getOrderInCreation().bookingSlot || !data.amount) {
      return;
    }
    let stuartAmountAndRound = getStuartAmountAndRound(data.amount, currentEstablishment, contextData);
    if (parseFloat(stuartAmountAndRound) > 0) {
      setStuartAmount(stuartAmountAndRound);
    }
    else {
      setStuartAmount(null);
    }

  }



  async function checkDistance(lat, lng, address) {
    let distInfo;
    if (currentEstablishment()) {
      distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
      setCheckAddLoading(true);
      const data = await distanceAndCheck(distInfo,
          currentEstablishment, getOrderInCreation(),
          currentBrand().id,  lat, lng, getOrderInCreation().bookingSlot, address, contextData);
      setZoneMap(data.zoneMap);
      setMaxDistanceReached(data.maxDistanceReached);
      setDistanceInfo(data.distanceInfo);
      setStuartError(data.error);
      setStuartAmountAndRound(data);
      setStuartCurrency(data.currency);
      setCheckAddLoading(false);
      return {
        distInfo: distInfo,
        charge: data.charge,
      };
    }
    return {};
  }

  function getSubmitText(values) {
    // if (!paymentMethod) {
    //   return localStrings.check.noSelectPaymentMethod;
    // }
    if (paymentMethod === "delivery"  && expectedPaymentMethods.length === 0 && priceDetails.total > 0) {
      return localStrings.check.noSelectPaymentMethod;
    }

    if (!getOrderInCreation().bookingSlot) {
      return localStrings.check.noSelectSlotMethod;
    }

    if (getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && maxDistanceReached && !zoneMap) {
      return localStrings.check.maxDistanceReached;
    }

    if (!getOrderInCreation()?.deliveryAddress && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      return localStrings.check.noDeliveryAdress;
    }

    if (getCartItems(getOrderInCreation).length === 0) {
      return localStrings.check.noItemInCart;
    }

    if (!checkoutSchema(bookWithoutAccount, language).isValidSync(values)) {
      return localStrings.check.badContactInfo;
    }

    if (isDeliveryPriceDisabled() && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
      return localStrings.check.deliveryMinPrice;
    }

    if (!cgvChecked) {
      return localStrings.check.pleaseAcceptCgv;
    }

    if ( priceDetails?.total === 0) {
      return localStrings.orderFree;
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
    return currentEstablishment().offlinePaymentMethods
        .filter(item => !(excludedPayments || []).includes(item))
        //.filter(item => false)
        .map(methodkey => {
          return ({
            valuePayment: methodkey,
            name: formatPaymentMethod(methodkey, localStrings)
          })
        })
  }

  function isPaymentDisabled(values) {
    return (paymentMethod === "delivery" && expectedPaymentMethods.length === 0 && priceDetails.total > 0) ||
        !cgvChecked ||
        (isDeliveryPriceDisabled() && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) ||
        !checkoutSchema(bookWithoutAccount, language).isValidSync(values) ||
        !getOrderInCreation().bookingSlot ||
        loading || getCartItems(getOrderInCreation).length == 0 ||
        (!getOrderInCreation()?.deliveryAddress && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) ||
        (getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && maxDistanceReached && !zoneMap) ||
        paymentMethod === "cc" && (!paymentCardValid && !isPaymentSystemPay()) && !isPaymentTakepayment();
  }

  function isPaymentSystemPay() {
    return currentBrand()?.config?.paymentWebConfig?.paymentType === PAYMENT_MODE_SYSTEM_PAY
  }

  function isPaymentSystemPayAndCCSelected() {
    return isPaymentSystemPay() && paymentMethod === 'cc'
  }

  function isPaymentStripeAndCCSelected() {
    return isPaymentStripe() && paymentMethod === 'cc'
  }

  function isPaymentStripe() {
    return currentBrand()?.config?.paymentWebConfig?.paymentType === PAYMENT_MODE_STRIPE
  }

  function isPaymentTakepayment() {
    return currentBrand()?.config?.paymentWebConfig?.paymentType === PAYMENT_MODE_TAKE_PAYMENTS
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


  async function setAddMain(deliveryMode) {
    setSelectedAddId("main");
    setCustomAddressSelected(false);
    setAdressValue(null);
    let {distInfo, charge} = await checkDistance(dbUser?.userProfileInfo?.lat, dbUser?.userProfileInfo?.lng, dbUser?.userProfileInfo?.address);
    updateDeliveryAdress(
        dbUser?.userProfileInfo?.address,
        dbUser?.userProfileInfo?.lat,
        dbUser?.userProfileInfo?.lng,
        "main",
        "main",
        dbUser?.userProfileInfo?.customerDeliveryInformation,
        distInfo?.distance,
        distInfo?.deliveryZoneId,
        charge,
        deliveryMode
    );
  }


  function selectDealProposal(selectedProductAndSku, deal) {
    addToCartOrder(setGlobalDialog, selectedProductAndSku, orderInCreation, setOrderInCreation, null,
        deal.candidate.deal, checkDealProposal, currentEstablishment, currentBrand());
  }

  function formatPointsAppliedMessage() {
    return localStrings.formatString(localStrings.usedLoyaltyPoints, saveAmountWithPointSave + " " + getBrandCurrency(currentBrand()), maxPointsToSpendSave)
  }

  function spendPoints() {
    const saveAmount = saveAmountWithPoint + " " + getBrandCurrency(currentBrand());
    let discount = {
      id: uuid(),
      saveAmount: saveAmountWithPoint.toFixed(2),
      name: localStrings.formatString(localStrings.discountsLoyaltyName, saveAmount, maxPointsToSpend),
      pricingEffect: PRICING_EFFECT_FIXED_PRICE,
      pricingValue: saveAmountWithPoint.toFixed(2),
      loyaltyPointCost: maxPointsToSpend,
    }
    setMaxPointsToSpendSave(maxPointsToSpend);
    setSaveAmountWithPointSave(saveAmountWithPoint);

    addDiscountToCart(discount, getOrderInCreation, setOrderInCreation);

    setPointsUsed(true);
  }


  const paymentPopup = useMemo(() => {

    let amount = computePriceDetail(orderInCreation).total;
    return (<TakePaymentPopup brandId={currentBrand()?.id} amount={amount} uuidPayment={uuidPayment}/>)
  }, [currentBrand]);



  return (
      <>
        {/*<p>{JSON.stringify(tempTakePayment|| {})}</p>*/}
        <Dialog open={displayTakePaymentsDialog} fullScreen style={{overflow: 'hidden'}}>
          <DialogContent style={{padding: 0}}>
            {paymentPopup}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDisplayTakePaymentsDialog(false)} color="primary">
              {localStrings.cancel}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={manualAddressOutOfBound} maxWidth="sm">
          <DialogContent className={classes.dialogContent}>
            <AlertHtmlLocal
                severity="warning"
                //title={localStrings.tooFarAddress}
            >
              {localStrings.tooFarAddress}
            </AlertHtmlLocal>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setManualAddressOutOfBound(false)} color="primary">
              {localStrings.IUnderstand}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={pointsUsed} maxWidth="sm">
          <DialogContent className={classes.dialogContent}>
            <AlertHtmlLocal
                severity="success"
                title={localStrings.bravo}
                // content={config.alertOnSelectPickup}
            >
              <MdRender content = {formatPointsAppliedMessage()}/>
            </AlertHtmlLocal>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setPointsUsed(false)} color="primary">
              {localStrings.IUnderstand}
            </Button>
          </DialogActions>
        </Dialog>


        {dealCandidates && dealCandidates.length > 0 &&
            <Dialog
                onClose={() => {
                  setRefusedDeals([...refusedDeals, ...
                      dealCandidates[0].missingLine.skus
                  ]);
                  setDealCandidates([...dealCandidates].slice(1))
                }}
                open={dialogDealProposalContent}
                fullWidth>
              {/*<DialogContent className={classes.dialogContent}>*/}
              <DialogTitle sx={{ m: 0, p: 2 }}>

                <IconButton
                    aria-label="close"
                    onClick={() => setDialogDealProposalContent(false)}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                {/*  <p>TEST</p>*/}
                <UpSellDeal
                    orderInCreation={getOrderInCreation()}
                    candidateDeal={dealCandidates[0]}
                    cancelCallBack={() => {
                      setRefusedDeals([...refusedDeals, ...
                          dealCandidates[0].missingLine.skus
                      ]);
                      setDealCandidates([...dealCandidates].slice(1))
                    }}
                    selectCallBack={
                      async (selectedProductAndSku) => {
                        selectDealProposal(selectedProductAndSku, dealCandidates[0])
                      }
                    }
                    contextData={contextData}/>
              </DialogContent>
            </Dialog>
        }



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
              {/*<p>{JSON.stringify(dealCandidates)}</p>*/}
              {(!firstOrCurrentEstablishment() || !orderInCreation) ?
                  // {false ?
                  <ClipLoaderComponent/>
                  :
                  <>
                    {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
                    <Formik
                        innerRef={formRef}
                        initialValues={getInitialValues(dbUser)}
                        validationSchema={checkoutSchema(bookWithoutAccount, language)}
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
                                                              currentEstablishment().serviceSetting.minimalDeliveryOrderPrice, contextData.brand.config.currency)}
                                          >
                                            <Box display="flex" flexDirection="row-reverse">
                                              <Box mt={2}>
                                                <Link href="/product/shop/all">
                                                  <Button variant="outlined" color="primary" type="button" fullWidth
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
                                    {getOrderInCreation() ?
                                        <>
                                          {!isDeliveryPriceDisabled() && currentEstablishment()?.serviceSetting?.enableDelivery &&
                                              <PresenterSelect
                                                  icon={faMotorcycle}
                                                  loading={wantedDeliveryMode === ORDER_DELIVERY_MODE_DELIVERY}
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
                                              loading={wantedDeliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT}
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
                                        :
                                        <ClipLoaderComponent size={100}/>
                                    }
                                  </>
                                  <>
                                  </>
                                </Card1>
                            }
                            {(dbUser || bookWithoutAccount) && isDeliveryActive(currentEstablishment()) && getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                                <Card1 sx={{mb: '2rem'}}>
                                  <>
                                    {isDeliveryActive(currentEstablishment()) &&
                                        getOrderInCreation().deliveryAddress &&
                                        getOrderInCreation() && getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                                        getMessagDeliveryAddress(currentEstablishment, getOrderInCreation(), maxDistanceReached, stuartError, stuartAmount, zoneMap) &&
                                        <Box p={1}>
                                          <AlertHtmlLocal severity={getMessagDeliveryAddress(currentEstablishment, getOrderInCreation(),
                                              maxDistanceReached, stuartError, stuartAmount, zoneMap)?.severity}
                                              title={getMessagDeliveryAddress(currentEstablishment, getOrderInCreation(),
                                                  maxDistanceReached, stuartError, stuartAmount, zoneMap)?.message}
                                          >
                                            {checkAddLoading &&
                                                <CircularProgress size={30} className={classes.buttonProgress}/>
                                            }
                                          </AlertHtmlLocal>
                                        </Box>
                                    }


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
                                             <>
                                              <Typography fontWeight="600" mb={2} mt={2} variant="h5">
                                                {/*{dbUser?.userProfileInfo?.address ? localStrings.selectDeliveryAdressManualAlternate : localStrings.selectDeliveryAdressManual }*/}
                                                {localStrings.selectDeliveryAdress}
                                              </Typography>

                                              <PresenterSelect
                                                  icon={faAddressCard}
                                                  title={localStrings.mainAddress}
                                                  subtitle={dbUser?.userProfileInfo?.address}
                                                  selected={selectedAddId === "main"}
                                                  onCLickCallBack={async () => {
                                                    //await resetBookingSlot();
                                                    setAddressLoading(true);
                                                    await setAddMain();
                                                    setAddressLoading(false);
                                                  }}
                                              />
                                             </>
                                          }

                                          {dbUser?.userProfileInfo?.address && (dbUser?.userProfileInfo?.otherAddresses || []).map((item, key) =>
                                              <PresenterSelect
                                                  key={key}
                                                  icon={faAddressCard}
                                                  title={item.name}
                                                  subtitle={item.address}
                                                  selected={selectedAddId === item.id}
                                                  onCLickCallBack={async () => {
                                                    setAddressLoading(true);
                                                    setSelectedAddId(item.id);
                                                    const {distInfo, charge} = await checkDistance(item.lat, item.lng, item.address);
                                                    setAdressValue(null);
                                                    setCustomAddressSelected(false)
                                                    updateDeliveryAdress(item.address,
                                                        item.lat,
                                                        item.lng,
                                                        item.id,
                                                        item.name,
                                                        //item.additionalInformation,
                                                        item.customerDeliveryInformation || "",
                                                        distInfo?.distance,
                                                        distInfo?.deliveryZoneId,
                                                        charge,
                                                        null,
                                                        true
                                                    );
                                                    setAddressLoading(false);
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
                                        <>
                                          <Typography fontWeight="600" mb={2} mt={2} variant="h5">
                                            {dbUser?.userProfileInfo?.address ? localStrings.selectDeliveryAdressManualAlternate : localStrings.selectDeliveryAdressManual }
                                          </Typography>

                                          <Grid container spacing={3}>
                                            {/*<Box display="flex" p={1}>*/}
                                            {/*<Grid item xs={adressSearch ? 10 : 12} lg={adressSearch ? 10 : 12} ml={adressSearch ? 0 : 2} mr={adressSearch ? 0 : 2}>*/}
                                            <Grid item xs={12} lg={12} ml={2} mr={2}>
                                              <GoogleMapsAutocomplete
                                                  modeUk={currentBrand()?.country === 'gb'}
                                                  //ref={autocomp}
                                                  borderColor={customAddressSelected && "primary.main"}
                                                  border={customAddressSelected ? 4 : 0}
                                                  borderRadius={"8px"}
                                                  placeholderArg={dbUser ?
                                                      localStrings.fillAddressDeliveryConnected : localStrings.fillAddressDelivery}
                                                  noKeyKnown
                                                  required
                                                  setterValueSource={(value) => {
                                                    setAdressSearch(true);
                                                    setAdressValue(value);
                                                  }}
                                                  valueSource={adressValue}
                                                  setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                                    setAddressLoading(true);
                                                    //let distInfo;
                                                    if (currentEstablishment() && (getOrderInCreation().bookingSlot && !getEstablishmentSettings(currentEstablishment(), 'deliveryStuartActive') ) ) {
                                                      let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                                      //alert("distInfo?.distance " + JSON.stringify(distInfo || {}))
                                                      setCheckAddLoading(true);
                                                      const data = await distanceAndCheck(distInfo,
                                                          currentEstablishment, getOrderInCreation(),
                                                          currentBrand().id,  lat, lng,
                                                          getOrderInCreation().bookingSlot, label, contextData);

                                                      if (maxDistanceReached) {
                                                        //setDeliveryMode(ORDER_DELIVERY_MODE_PICKUP_ON_SPOT);
                                                        setSelectedAddId(null);
                                                        setCustomAddressSelected(false)
                                                        setManualAddressOutOfBound(true);
                                                      }
                                                      else {
                                                        setCustomAddressSelected(true)
                                                        setSelectedAddId(null);
                                                      }
                                                      setMaxDistanceReached(data.maxDistanceReached);
                                                      //setAdressSearch(false);
                                                      setZoneMap(data.zoneMap);
                                                      setMaxDistanceReached(data.maxDistanceReached);
                                                      setDistanceInfo(data.distanceInfo);
                                                      setStuartError(data.error);
                                                      setStuartAmountAndRound(data);
                                                      setStuartCurrency(data.currency);
                                                      setCheckAddLoading(false);
                                                      updateDeliveryAdress(label, lat, lng, null, null, null, distInfo?.distance, distInfo?.deliveryZoneId, data.charge);
                                                    } else {
                                                      setSelectedAddId(null);
                                                      let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                                      const data = await distanceAndCheck(distInfo,
                                                          currentEstablishment, getOrderInCreation(),
                                                          currentBrand().id,  lat, lng,
                                                          getOrderInCreation().bookingSlot, label, contextData);

                                                      setMaxDistanceReached(data.maxDistanceReached);
                                                      //setAdressSearch(false);
                                                      setZoneMap(data.zoneMap);
                                                      setMaxDistanceReached(data.maxDistanceReached);
                                                      setDistanceInfo(data.distanceInfo);

                                                      updateDeliveryAdress(label, lat, lng, null, null, null, distInfo?.distance, distInfo?.deliveryZoneId);
                                                    }
                                                    setAddressLoading(false);
                                                  }}/>
                                            </Grid>
                                          </Grid>
                                        </>
                                    }

                                    {!maxDistanceReached && !zoneMap &&
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
                                                href={"/address/adressDetail?addId=" + getOrderInCreation()?.deliveryAddress?.id}>
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


                                  {/*{isStuartActive(currentEstablishment, contextData)*/}
                                  {/*    && checkAddLoading && getOrderInCreation().bookingSlot &&*/}
                                  {/*    <AlertHtmlLocal*/}
                                  {/*        severity="warning"*/}
                                  {/*        title={localStrings.stuartLoadingTitle}*/}
                                  {/*        content={localStrings.stuartLoading}>*/}
                                  {/*    </AlertHtmlLocal>*/}

                                  {/*}*/}

                                  {isStuartActive(currentEstablishment, contextData)
                                      && getOrderInCreation().bookingSlot && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                                      <>
                                        {checkAddLoading ?
                                            <AlertHtmlLocal
                                                severity="warning"
                                                title={localStrings.stuartLoading}>
                                            </AlertHtmlLocal>
                                            :
                                            <AlertHtmlLocal severity={getMessagDeliveryAddress(currentEstablishment, getOrderInCreation(),
                                                maxDistanceReached, stuartError, stuartAmount, zoneMap)?.severity}
                                                title={getMessagDeliveryAddress(currentEstablishment, getOrderInCreation(),
                                                    maxDistanceReached, stuartError, stuartAmount, zoneMap)?.message}
                                            >
                                              {checkAddLoading &&
                                                  <CircularProgress size={30} className={classes.buttonProgress}/>
                                              }
                                            </AlertHtmlLocal>
                                        }
                                      </>

                                  }

                                  {/*{(checkAddLoading || selectedAddId !== getOrderInCreation()?.deliveryAddress?.id) &&*/}
                                  {(checkAddLoading) &&
                                      <Box
                                          display="flex"
                                          justifyContent="center"
                                          alignItems="center"
                                          p={1}
                                      >
                                        <CircularProgress size={50} className={classes.buttonProgress}/>
                                      </Box>
                                  }
                                  <BookingSlots
                                      globalDisabled={checkAddLoading ||
                                          (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && !getOrderInCreation().deliveryAddress) }
                                      excludedPaymentsSetter={setExcludedPayments}
                                      contextData={contextData}
                                      disableNextDay
                                      startDateParam={moment()}
                                      selectCallBack={(bookingSlot) => {
                                        setSelectedBookingSlot(bookingSlot, null);
                                        //if (getOrderInCreation().deliveryMode !== ORDER_DELIVERY_MODE_DELIVERY) {
                                        //removeStuartChargeToCart(getOrderInCreation(), setOrderInCreation)
                                        //}
                                        if (getOrderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY && isStuartActive(currentEstablishment, contextData)) {
                                          setCheckAddLoading(true);
                                          distanceAndCheck(null,
                                              currentEstablishment, getOrderInCreation(),
                                              currentBrand().id, null, null, bookingSlot,
                                              getOrderInCreation()?.deliveryAddress?.address, contextData
                                          ).then(data => {
                                            setSelectedBookingSlot(bookingSlot, data.charge);
                                            setMaxDistanceReached(data.maxDistanceReached)
                                            setStuartAmountAndRound(data, true);
                                            setStuartCurrency(data.currency);
                                            setStuartError(data.error);
                                            setCheckAddLoading(false);
                                          })
                                        }
                                      }}
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
                                    {priceDetails && priceDetails.total > 0 &&
                                        <>
                                          <Typography fontWeight="600" mb={2}>
                                            {localStrings.paymentMethod}
                                          </Typography>

                                          {(!currentBrand()?.config?.paymentWebConfig?.forceOnlinePaymentDelivery
                                                  || getOrderInCreation()?.deliveryMode !== ORDER_DELIVERY_MODE_DELIVERY) &&
                                              <FormControlLabel
                                                  name="delivery"
                                                  label={<Typography
                                                      fontWeight="300">{localStrings.paymentDelivery}</Typography>}
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
                                          }

                                          {currentBrand()?.config?.paymentWebConfig?.activateOnlinePayment &&
                                              <>
                                                <br/>
                                                <FormControlLabel
                                                    name="cc"
                                                    label={<Typography fontWeight="300">{localStrings.paymentCreditCard}</Typography>}
                                                    control={
                                                      <Radio
                                                          checked={paymentMethod === 'cc' ||
                                                              (currentBrand()?.config?.paymentWebConfig?.forceOnlinePaymentDelivery
                                                                  && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY)
                                                          }
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
                                          {/*<p>{paymentMethod}</p>*/}
                                          {paymentMethod !== 'cc' &&
                                              <FormGroup>
                                                {/*<p>{JSON.stringify(excludedPayments)}</p>*/}
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
                                                              amount={getOrderAmount(getOrderInCreation)}
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
                                      </FormGroup>
                                    </Box>
                                  </Card1>
                                </>
                            }

                            {stuartAmount && stuartCurrency && !checkAddLoading && getOrderInCreation()?.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                                <AlertHtmlLocal
                                    severity="warning"
                                    title={localStrings.warning}
                                    content={localStrings.formatString(localStrings.warningMessage.deliveryFeeOccurs,
                                        stuartAmount, stuartCurrency
                                    )}>

                                </AlertHtmlLocal>

                            }


                            {dbUser &&
                                currentBrand()?.config?.loyaltyConfig?.useLoyalty &&
                                dbUser?.loyaltyPoints >= currentBrand()?.config?.loyaltyConfig?.minPointSpend &&
                                (!orderInCreation.discounts || orderInCreation.discounts.length === 0) &&
                                <>
                                  <AlertHtmlLocal
                                      severity="success"
                                      title={localStrings.useYouPoints}
                                      // content={config.alertOnSelectPickup}
                                  >
                                    <MdRender content = {localStrings.formatString(localStrings.useYouPointsDetail, maxPointsToSpend, saveAmountWithPoint.toString() + ' ' + getBrandCurrency(currentBrand()))}/>
                                    <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row-reverse',
                                        }}
                                    >
                                      <Button
                                          style={{textTransform: "none"}}
                                          variant="outlined" color="primary"
                                          onClick={spendPoints}
                                      >
                                        {localStrings.use}
                                      </Button>
                                    </Box>

                                  </AlertHtmlLocal>
                                </>
                            }



                            {(dbUser || bookWithoutAccount) &&
                                <Grid container spacing={6} mt={1}>
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
                                                isPaymentDisabled(values) || orderUpdating || checkAddLoading || addressLoading
                                            }
                                            endIcon={(loading || addressLoading)?
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

const checkoutSchema = (bookWithoutAccount, language) => {

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
                    const phoneNumber = parsePhoneNumber(value, language === 'fr' ? 'FR' : 'UK');
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
export default CheckoutForm
