export const MODE_EDIT = 1;
export const MODE_CREATE = 2;

export const SEP = "-";
// export const ORDER_STATUS_NEW = "ltnew";
// export const ORDER_STATUS_COMPLETE = "ltcomplete";
// export const ORDER_STATUS_NEW = "ltnew";
// export const ORDER_STATUS_COMPLETE = "ltcomplete";
// export const ORDER_STATUS_FINISHED = "ltfinished";
// export const ORDER_STATUS_DELIVERING = "ltdelivering";
// export const ORDER_STATUS_PREPARATION = "ltpreparation";
// export const ORDER_STATUS_READY = "ltready";

export const ORDER_STATUS_NEW = "new";
export const ORDER_STATUS_COMPLETE = "completed";
export const ORDER_STATUS_FINISHED = "finished";
export const ORDER_STATUS_DELIVERING = "in_delivery";
export const ORDER_STATUS_PREPARATION = "in_preparation";
export const ORDER_STATUS_READY = "awaiting_shipment";
export const ORDER_STATUS_PENDING_PAYMENT = "pending_payment";

export const HUBRISE_ORDER_STATUS_NEW = "new";
export const HUBRISE_ORDER_STATUS_RECEIVED = "received";
export const HUBRISE_ORDER_STATUS_ACCEPTED = "accepted";
export const HUBRISE_ORDER_STATUS_IN_PREPARATION = "in_preparation";
export const HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT= "awaiting_shipment";
export const HUBRISE_ORDER_STATUS_AWAITING_COLLECTION= "awaiting_collection";
export const HUBRISE_ORDER_STATUS_IN_DELIVERY= "in_delivery";
export const HUBRISE_ORDER_STATUS_COMPLETED= "completed";
export const HUBRISE_ORDER_STATUS_REJECTED= "rejected";
export const HUBRISE_ORDER_STATUS_CANCELLED= "cancelled";
export const HUBRISE_ORDER_STATUS_DELIVERY_FAILED= "delivery_failed";

export const ORDER_SOURCE_ONLINE = "online";
export const ORDER_SOURCE_OFFLINE = "offline";

export const ORDER_DELIVERY_MODE_DELIVERY = "delivery";
export const ORDER_DELIVERY_MODE_PICKUP_ON_SPOT = "pickupOnSpot";
export const ORDER_DELIVERY_MODE_ON_THE_SPOT = "onTheSpot";
export const ORDER_DELIVERY_MODE_ALL = "all";

export const DOW_LUNCH = "lunch";
export const DOW_DINNER = "dinner";

export const PRODUCT_USER_COLLECTION = 'productUsers';
export const BRAND_COLLECTION = 'brands';
export const RELOAD_COLLECTION = 'reload';
export const ESTABLISHMENT_COLLECTION = 'establishments';
export const TAKE_PAYMENT_TEMP_COLLECTION = 'takePaymentTemps';
export const SITE_USER_COLLECTION = 'siteUsers';
export const STAT_COLLECTION = 'stats';
export const ORDER_COLLECTION = 'orders';
export const DELIVERY_COLLECTION = 'deliveries';
export const BOOKING_SLOT_OCCUPANCY_COLLECTION = 'bookingSlotsOccupancy';

export const DELIVERY_STATUS_NOT_STARTED = 'notStarted';
export const DELIVERY_STATUS_ON_GOING = 'ongoing';
export const DELIVERY_STATUS_DONE = 'done';

export const USER_STATUS_NONE = "none";
export const USER_STATUS_DELIVERING = "delivering";

export const PAYMENT_MODE_STRIPE = "stripe";
export const PAYMENT_MODE_SYSTEM_PAY = "systemPay";
export const PAYMENT_MODE_TAKE_PAYMENTS = "takepayments";

export const WIDTH_DISPLAY_MOBILE = 900;

export const CUSTOM_PAGE_CAROUSEL = "carrousel";
export const CUSTOM_HTML_SOURCE = "htmlSource";
export const CUSTOM_HTML_HOME_COMPONENT = "homeComponent";

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
      name: localStrings.hrorderStatusNew,
      value: ORDER_STATUS_NEW,
    },
    {
      name: localStrings.hrorderStatusCompleted,
      value: ORDER_STATUS_COMPLETE,
    },
    {
      name: localStrings.hrorderStatusinDelivery,
      value: ORDER_STATUS_DELIVERING,
    },
    {
      name: localStrings.hrorderStatusInPreparation,
      value: ORDER_STATUS_PREPARATION,
    },
    {
      name: localStrings.orderStatusReady,
      value: ORDER_STATUS_READY,
    },
    {
      name: localStrings.hrorderStatusCompleted,
      value: ORDER_STATUS_COMPLETE,
    },
    {
      name: localStrings.orderStatusPendingPayment,
      value: ORDER_STATUS_PENDING_PAYMENT,
    },
    {
      name: localStrings.hrorderStatusNew,
      value: HUBRISE_ORDER_STATUS_NEW,
    },
    {
      name: localStrings.hrorderStatusReceived,
      value: HUBRISE_ORDER_STATUS_RECEIVED,
    },
    {
      name: localStrings.hrorderStatusAccepted,
      value: HUBRISE_ORDER_STATUS_ACCEPTED,
    },
    {
      name: localStrings.hrorderStatusInPreparation,
      value: HUBRISE_ORDER_STATUS_IN_PREPARATION,
    },
    {
      name: localStrings.hrorderStatusAwaitingShipment,
      value: HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT,
    },
    {
      name: localStrings.hrorderStatusAwaitingCollection,
      value: HUBRISE_ORDER_STATUS_AWAITING_COLLECTION,
    },


    {
      name: localStrings.hrorderStatusinDelivery,
      value: HUBRISE_ORDER_STATUS_IN_DELIVERY,
    },
    {
      name: localStrings.hrorderStatusCompleted,
      value: HUBRISE_ORDER_STATUS_COMPLETED,
    },
    {
      name: localStrings.hrorderStatusRejected,
      value: HUBRISE_ORDER_STATUS_REJECTED,
    },
    {
      name: localStrings.hrorderStatusCancelled,
      value: HUBRISE_ORDER_STATUS_CANCELLED,
    },
    {
      name: localStrings.hrorderStatusDeliveryFailed,
      value: HUBRISE_ORDER_STATUS_DELIVERY_FAILED,
    },
  ]
}

// export const HUBRISE_ORDER_STATUS_NEW = "new";
// export const HUBRISE_ORDER_STATUS_RECEIVED = "received";
// export const HUBRISE_ORDER_STATUS_ACCEPTED = "accepted";
// export const HUBRISE_ORDER_STATUS_IN_PREPARATION = "in_preparation";
// export const HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT= "awaiting_shipment";
// export const HUBRISE_ORDER_STATUS_AWAITING_COLLECTION= "awaiting_collection";
// export const HUBRISE_ORDER_STATUS_IN_DELIVERY= "in_delivery";
// export const HUBRISE_ORDER_STATUS_COMPLETED= "completed";
// export const HUBRISE_ORDER_STATUS_REJECTED= "rejected";
// export const HUBRISE_ORDER_STATUS_CANCELLED= "cancelled";
// export const HUBRISE_ORDER_STATUS_DELIVERY_FAILED= "delivery_failed";
export const PAYMENT_METHOD_STRIPE = "PAYMENT_METHOD_STRIPE";
export const PAYMENT_METHOD_SYSTEMPAY = "PAYMENT_METHOD_SYSTEMPAY";
export const PAYMENT_METHOD_TAKE_PAYMENTS = "PAYMENT_METHOD_TAKE_PAYMENTS";

export const getPaymentMethods = (localStrings) => {
  return  [
  {
    name: localStrings.paymentMethodCash,
    valuePayment: "PAYMENT_METHOD_CASH",
  },
  {
    name: localStrings.paymentMethodCC,
    valuePayment: "PAYMENT_METHOD_CC",
  },
  {
    name: localStrings.paymentMethodTicket,
    valuePayment: "PAYMENT_METHOD_TICKET",
  },
  {
    name: localStrings.paymentMethodCheque,
    valuePayment: "PAYMENT_METHOD_CHEQUE",
  },
  {
    name: localStrings.paymentMethodStripe,
    valuePayment: PAYMENT_METHOD_STRIPE,
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
export const PRICING_EFFECT_PRICE = "price";
export const PRICING_EFFECT_PERCENTAGE = "percentage";

export const CHARGE_DELIVERY = "delivery";
export const CHARGE_PAYMENT_FEE = "payment_fee";
export const CHARGE_TIP = "tip";
export const CHARGE_TAX = "tax";
export const CHARGE_OTHER = "other";

export const PRINTER_MODEL_STAR = "STAR";
export const PRINTER_MODEL_EPSON = "EPSON";

export const TYPE_DEAL = "deal"
export const TYPE_PRODUCT = "product"

export const STRIPE_SUB_STATUS_ACTIVE= "active";
export const STRIPE_SUB_STATUS_TRIALING= "trialing";

export const ALREADY_CONSUMED = "alreadyConsumed";
export const TOO_SOON = "codeTooSoon";
export const TOO_LATE = "codeTooLate";
export const PRICE_LOWER = "priceLower";

export const TOP_STICKY = "90px";

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
