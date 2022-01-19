import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

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
    couponCodes
    startDate
    endDate
    serviceTypes
    minOrderAmount
    maxPerOrder
    maxPerCustomer
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


export const getCouponCodeDiscount = (brandId, userId, couponCode) => {
  var debug = `
   query {
    getCouponCodeDiscount(brandId : "${brandId}", userId: "${userId}", couponCode: "${couponCode}") {
      ${common}
    }
   }
  `
  console.log(debug);

  return gql`
    query {
        getCouponCodeDiscount(brandId : "${brandId}", userId: "${userId}", couponCode: "${couponCode}") {
            ${common}
        }
   }
  `;

}
