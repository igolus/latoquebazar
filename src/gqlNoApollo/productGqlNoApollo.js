import {gql, request} from 'graphql-request'
import {TYPE_PRODUCT} from "../util/constants";

const config = require('../conf/config.json')
const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  external
  extId
  extName
  creationDate
  updateDate
  name
  price
  discountPercent
  nonDiscountedPrice
  description
  shortDescription
  additionalInformation
  newProduct
  allergens
  notAddableToCart
  newProductExpireDate
  tags {
    id
    brandId
    tag
    creationDate
    color
  } 
  category {
    id
    brandId
    category
    creationDate
  }
  description
  price
  files {
    creationDate
    name
    url
    path
    size
  }
  skus {
    name
    visible
    onlyInDeal
    unavailableInEstablishmentIds
    extName
    extRef
    sourceExtRefDup
    price
    nonDiscountedPrice
    percentDiscount
    valueDiscount
    vat
    preparationTime
    optionListExtIds
    productName
    extraCharge
    shortCode
    restrictionsList {
      establishmentId
      dow {
        day
        service
      }
      deliveryZones
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
  }
`

export const getProductsQueryNoApollo = async (brandId) => {
    var debug = `
     {
      getProductsByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `
    //console.log(debug);

    const query = gql`
    {
      getProductsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

    let products = await request(config.graphQlUrl, query);

    //let deals = await request(config.graphQlUrl, query);
    products.getProductsByBrandId.forEach(deal => deal.type = TYPE_PRODUCT)

    return products;
}

