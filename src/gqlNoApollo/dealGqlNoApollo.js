import { request, gql } from 'graphql-request'
import {TYPE_DEAL} from "../util/constants";

const config = require('../conf/config.json')
const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  hubriseId
  visible
  external
  extName
  shortCode
  name
  extRef
  creationDate
  updateDate
  newProduct
  newProductExpireDate
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
      endTime
      serviceTypes
      minOrderAmount
      maxPerOrder
      maxPerCustomer
      maxOrderAmount
      minDeliveryDistance
      maxDeliveryDistance
      description
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
`

export const getDealsQueryNoApollo = async (brandId) => {
  var debug = `
     {
      getDealsByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `
  console.log(debug);

  const query = gql`
    {
      getDealsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

  let deals = await request(config.graphQlUrl, query);
    deals.getDealsByBrandId.forEach(deal => deal.type = TYPE_DEAL)
    
  return deals;
}