import {gql} from "@apollo/client";

const common = `
  id
  external
  extName
  name
  extRef
  description
  couponCodes
  couponCodeValues
  restrictions {
    dow {
      day
      service
    }
    establishmentIds
    couponCodes
    startDate
    endDate
    
    serviceTypes
    minOrderAmount
    maxPerOrder
    maxPerCustomer
  }
  restrictionsList {
      establishmentId
      dow {
        day
        service
      }
      deliveryZones
      deliveryZonesMap
      startDate
      endDate
      startTime
      endTime
      
      startBookingTime
      endBookingTime
      bookingAndDeliverySameDay
      
      serviceTypes
      minOrderAmount
      maxPerOrder
      maxPerCustomer
      maxOrderAmount
      minDeliveryDistance
      maxDeliveryDistance
      description
  }
  pricingEffect
  pricingValue
  files {
    creationDate
    name
    url
    path
    size
  }
  imageIds
  valid
  invalidReason
`


export const getCouponCodeDiscount = (brandId, userId, couponCode, amount) => {
  var debug = `
   query {
    getCouponCodeDiscount(brandId : "${brandId}", userId: "${userId}", couponCode: "${couponCode}", amount: "${amount}") {
      ${common}
    }
   }
  `
  console.log(debug);

  return gql`
    query {
        getCouponCodeDiscount(brandId : "${brandId}", userId: "${userId}", couponCode: "${couponCode}", amount: "${amount}") {
            ${common}
        }
   }
  `;

}

