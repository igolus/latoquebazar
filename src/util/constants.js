import localStrings from "../localStrings";

export const SEP = "-";
export const ORDER_STATUS_NEW = "new";
export const ORDER_STATUS_COMPLETE = "complete";
export const ORDER_STATUS_FINISHED = "finished";
export const ORDER_STATUS_DELIVERING = "delivering";
export const ORDER_STATUS_PREPARATION = "preparation";
export const ORDER_STATUS_READY = "ready";

export const ORDER_SOURCE_ONLINE = "online";
export const ORDER_SOURCE_OFFLINE = "offline";

export const ORDER_DELIVERY_MODE_DELIVERY = "delivery";
export const ORDER_DELIVERY_MODE_PICKUP_ON_SPOT = "pickupOnSpot";
export const ORDER_DELIVERY_MODE_ON_THE_SPOT = "onTheSpot";

export const DOW_LUNCH = "lunch";
export const DOW_DINNER = "dinner";

export const PRODUCT_USER_COLLECTION = 'productUsers';
export const BRAND_COLLECTION = 'brands';
export const ESTABLISHMENT_COLLECTION = 'establishments';
export const SITE_USER_COLLECTION = 'siteUsers';
export const STAT_COLLECTION = 'stats';
export const ORDER_COLLECTION = 'orders';
export const DELIVERY_COLLECTION = 'deliveries';
export const BOOKING_SLOT_OCCUPAMCY_COLLECTION = 'bookingSlotsOccupancy';

export const DELIVERY_STATUS_NOT_STARTED = 'notStarted';
export const DELIVERY_STATUS_ON_GOING = 'ongoing';
export const DELIVERY_STATUS_DONE = 'done';

export const USER_STATUS_NONE = "none";
export const USER_STATUS_DELIVERING = "delivering";

// export const orderSource = [
//   {
//     name: localStrings.orderSourceOnline,
//     value: ORDER_SOURCE_ONLINE,
//   },
//   {
//     name: localStrings.orderSourceOffline,
//     value: ORDER_SOURCE_OFFLINE,
//   },
// ]
//

export const getOrderDeliveryMode = (localStrings) => {
  return[
    {
      name: localStrings.delivery,
      value: ORDER_DELIVERY_MODE_DELIVERY,
    },
    {
      name: localStrings.clickAndCollect,
      value: ORDER_DELIVERY_MODE_PICKUP_ON_SPOT,
    },
  ]
}


export const getOrderStatus = (localStrings) => {
  return[
    {
      name: localStrings.orderStatusNew,
      value: ORDER_STATUS_NEW,
    },
    {
      name: localStrings.orderStatusComplete,
      value: ORDER_STATUS_COMPLETE,
    },
    {
      name: localStrings.orderStatusDelivering,
      value: ORDER_STATUS_DELIVERING,
    },
    {
      name: localStrings.orderStatusPreparation,
      value: ORDER_STATUS_PREPARATION,
    },
    {
      name: localStrings.orderStatusReady,
      value: ORDER_STATUS_READY,
    },
    {
      name: localStrings.orderStatusFinished,
      value: ORDER_STATUS_FINISHED,
    }
  ]
}

// export const orderDeliveryMode = [
//   {
//     name: localStrings.delivery,
//     value: ORDER_DELIVERY_MODE_DELIVERY,
//   },
//   {
//     name: localStrings ? localStrings.clickAndCollect : "toto",
//     value: ORDER_DELIVERY_MODE_PICKUP_ON_SPOT,
//   },
// ]
//
//
// export const deliveryStatus = [
//   {
//     name: localStrings.deliveryStatusOnGoing,
//     value: DELIVERY_STATUS_ON_GOING,
//   },
//   {
//     name: localStrings.deliveryStatusNotStarted,
//     value: DELIVERY_STATUS_NOT_STARTED,
//   },
//   {
//     name: localStrings.deliveryStatusDone,
//     value: DELIVERY_STATUS_DONE,
//   },
//
// ]
//
// export const orderStatus = [
//   {
//     name: localStrings.orderStatusNew,
//     value: ORDER_STATUS_NEW,
//   },
//   {
//     name: localStrings.orderStatusComplete,
//     value: ORDER_STATUS_COMPLETE,
//   },
//   {
//     name: localStrings.orderStatusDelivering,
//     value: ORDER_STATUS_DELIVERING,
//   },
//   {
//     name: localStrings.orderStatusPreparation,
//     value: ORDER_STATUS_PREPARATION,
//   },
//   {
//     name: localStrings.orderStatusReady,
//     value: ORDER_STATUS_READY,
//   },
//   {
//     name: localStrings.orderStatusFinished,
//     value: ORDER_STATUS_FINISHED,
//   }
// ]
//
// export const paymentMethods = [
//   {
//     name: localStrings.paymentMethodCash,
//     valuePayment: "PAYMENT_METHOD_CASH",
//   },
//   {
//     name: localStrings.paymentMethodCC,
//     valuePayment: "PAYMENT_METHOD_CC",
//   },
//   {
//     name: localStrings.paymentMethodTicket,
//     valuePayment: "PAYMENT_METHOD_TICKET",
//   },
//   {
//     name: localStrings.paymentMethodCheque,
//     valuePayment: "PAYMENT_METHOD_CHEQUE",
//   },
//   {
//     name: localStrings.paymentMethodStripe,
//     valuePayment: "PAYMENT_METHOD_STRIPE",
//   }
// ]

export const establishmentSetting = {
  printerUrl: "printerUrl",
  printerServiceUrl: "printerServiceUrl",
  printerHeader: "printerHeader",
  printerFooter: "printerFooter",
  printerBrand: "printerBrand",
  printOnCreateOrder: "printOnCreateOrder",
  printOnCreateOrderNumber: "printOnCreateOrderNumber",
}

export const PRICING_EFFECT_UNCHANGED = "unchanged";
export const PRICING_EFFECT_FIXED_PRICE = "fixed_price";
export const PRICING_EFFECT_PRICE_OFF = "price_off";
export const PRICING_EFFECT_PERCENTAGE_OFF = "percentage_off";

export const CHARGE_DELIVERY = "delivery";
export const CHARGE_PAYMENT_FEE = "payment_fee";
export const CHARGE_TIP = "tip";
export const CHARGE_TAX = "tax";
export const CHARGE_OTHER = "other";

export const PRINTER_MODEL_STAR = "STAR";
export const PRINTER_MODEL_EPSON = "EPSON";

export const TYPE_DEAL = "deal"
export const TYPE_PRODUCT = "product"

export const deviceSize = {
  xs: 425,
  sm: 768,
  md: 1024,
  lg: 1440,
}

export const layoutConstant = {
  topbarHeight: 40,
  grocerySidenavWidth: 280,
  containerWidth: 1200,
  mobileNavHeight: 64,
  headerHeight: 80,
  mobileHeaderHeight: 64,
}
