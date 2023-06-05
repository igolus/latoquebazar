import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
  id
  loyaltyPoints
  stuartFollowUrl
  stuartErrorMessage
  stuartError
  tempOrder
  creationDate
  orderNumber
  hubriseId
  establishmentId
  status
  stuartStatus
  totalPrice
  totalPreparationTime
  valueDiscount
  percentDiscount
  totalPriceNoTax
  source
  deliveryMode
  taxDetail {
    rate
    amount
  }
  order {
    items
    {
      extName
      hubriseId
      name
      extRef
      shortCode
      productExtId
      productName
      quantity
      price
      nonDiscountedPrice
      discountApplied
      percentDiscount
      valueDiscount
      vat
      preparationTime
      extraCharge
      options
      {
        option_list_name
        option_list_extRef
        option_list_internal_name
        name
        ref
        price
        nonDiscountedPrice
        percentDiscount
        valueDiscount
      }
    }
    deals {
      quantity
      deal {
        id
        external
        extName
        shortCode
        name
        extRef
        creationDate
        updateDate
        category {
          id
          brandId
          category
          creationDate
        }
        description
        shortDescription
        additionalInformation
        couponCodes
        restrictionsList {
          establishmentId
            dow {
              day
              service
            }
            startDate
            endDate
            startTime
            
            startBookingTime
            endBookingTime
            bookingAndDeliverySameDay
            
            endTime
            serviceTypes
            minOrderAmount
            maxPerOrder
            maxPerCustomer
        }
        tags {
          id
          brandId
          tag
          creationDate
        } 
        imageIds
        files {
          creationDate
          name
          url
          path
          size
        }
        lines {
          name
          uuid
          external
          pricingEffect
          pricingValue
          skus {
            name
            extName
            extRef
            price
            optionListExtIds
          }
        }
      }
      productAndSkusLines {
        extName
        hubriseId
        name
        extRef
        shortCode
        productExtId
        productName
        quantity
        price
        vat
        preparationTime
        extraCharge
        options
        {
          option_list_name
          option_list_extRef
          option_list_internal_name
          name
          ref
          price
        }      
      }
    }
  }

  payments {
      name
      deleted
      uuid
      valuePayment
      hubriseId
      ref
      amount
      extId
   }
   
   expectedPayments {
      name
      uuid
      valuePayment
      ref
      amount
      extId
   }
   
   bookingSlot {
      startDate
      startDateIso
      endDate
      endDateIso
  }
  
  charges {
    id
    external
    extName
    name
    extRef
    creationDate
    updateDate
    pricingEffect
    pricingValue
    price
  }
  
  discounts {
    id
    external
    extName
    name
    extRef
    description
    couponCodes
    couponCodeValues
    pricingEffect
    pricingValue
    pricingOff
  }
  
  confirmedTime
  deliveryAddress {
      address
      lat
      lng
      customerDeliveryInformation
  }
  additionalInfo
  customer {
      id
      userProfileInfo {
        firstName
        lastName
        email
        phoneNumber
        address
      }
    }
`

export const updateOrderStatusMutation = (brandId, establishmentId, orderId, status) => {
  var debug =
    `
    mutation {
      updateOrderStatus(brandId : "${brandId}", establishmentId: "${establishmentId}", 
        orderId: "${orderId}", status: ${status}) {
        ${common}
      }  
    }
  `
  console.log(debug);

  return gql`
     mutation {
      updateOrderStatus(brandId : "${brandId}", establishmentId: "${establishmentId}", 
        orderId: "${orderId}", status: ${status}) {
        ${common}
      }  
    }
  `;
}


export const getOrdersQuery = (brandId, establishmentId) => {
  var debug = `
    query {
      getOrdersByBrandIdAndEstablishmentId(brandId : "${brandId}", establishmentId: "${establishmentId}") {
        ${common}
      }  
    }
  `
  console.log(debug);

  return gql`
     query {
      getOrdersByBrandIdAndEstablishmentId(brandId : "${brandId}", establishmentId: "${establishmentId}") {
        ${common}
      }  
    }
  `;
}


export const getOrderByIdQuery = (brandId, establishmentId, orderId) => {
  var debug = `
    query {
      getOrdersByOrderIdEstablishmentIdAndOrderId(brandId : "${brandId}", establishmentId: "${establishmentId}" ,orderId: "${orderId}") {
         ${common}
      }
    }
  `
  console.log(debug);

  return gql`
     query {
      getOrdersByOrderIdEstablishmentIdAndOrderId(brandId : "${brandId}", establishmentId: "${establishmentId}" ,orderId: "${orderId}") {
         ${common}
      }
    }
  `;
}

export const updateOrderMutation = (brandId, establishmentId, data) => {
  delete data.creationDate;
  delete data.updateDate;
  var dataString = filterDataGql(data, null, ["status", "source", "service"]);

  var debug = `
    mutation {
      updateOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
   mutation {
      updateOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

export const getSiteUserOrderById = (brandId, siteUserId, orderId) => {
    var debug = `
    query {
      getSiteUserOrderById(brandId: "${brandId}", siteUserId: "${siteUserId}", orderId: "${orderId}") {
          ${common}
      }
    }
  `
    console.log(debug);

    return gql`
   query {
      getSiteUserOrderById(brandId: "${brandId}", siteUserId: "${siteUserId}", orderId: "${orderId}") {
          ${common}
      }
    }
  `;

}

export const getCustomerOrdersOnlyIdQuery = (brandId, siteUserId) => {
    var debug = `
    query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        orders {
          id
        }
      }
    }
  `
    console.log(debug);

    return gql`
   query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        orders {
          id
        }
      }
    }
  `;
}


export const getCustomerOrdersQuery = (brandId, siteUserId) => {
  var debug = `
    query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        orders {
          ${common}
        }
      }
    }
  `
  console.log(debug);

  return gql`
   query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        orders {
          ${common}
        }
      }
    }
  `;
}

export const addOrderToCustomer = (brandId, siteUserId, data) => {
  var dataString = filterDataGql(data, null, ["status", "source", "service"]);

  var debug = `
    mutation {
      addOrderToCustomer(brandId: "${brandId}", siteUserId: "${siteUserId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
   mutation {
      addOrderToCustomer(brandId: "${brandId}", siteUserId: "${siteUserId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

export const createOrderMutation = (brandId, establishmentId, data) => {
  var dataString = filterDataGql(data, null, ["status", "source", "service"]);

  var debug = `
    mutation {
      addOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
   mutation {
      addOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

export const bulkDeleteOrderMutation = (brandId, establishmentId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", orderIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteOrder(brandId: "${brandId}", establishmentId: "${establishmentId}", orderIds: ${idsString}) {
        ids
      }
    }
  `;
}
//
// export const deletedDataToChargeCache = async (brandId, ids) => {
//   const query = getChargesQuery(brandId);
//   const result = await executeQueryUtil(query);
//
//   const newData = result.data.getChargesByBrandId.filter(item =>
//     !ids.includes(item.id)
//   )
//
//   if (newData) {
//     await apolloClient.writeQuery({
//       query: query,
//       data: {
//         getChargesByBrandId: [...newData]
//       },
//     });
//   }
// }
//
//
// export const addDataToChargeCache = async (brandId, datas) => {
//   const query = getChargesQuery(brandId);
//   const result = await executeQueryUtil(query);
//
//   if (result) {
//     await apolloClient.writeQuery({
//       query: query,
//       data: {
//         getChargesByBrandId: [...result.data.getChargesByBrandId, ...datas]
//       },
//     });
//   }
// }

