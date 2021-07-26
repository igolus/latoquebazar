import { request, gql } from 'graphql-request'
import {TYPE_DEAL, TYPE_PRODUCT} from "../util/constants";

const config = require('../conf/config.json')
const common = `
  id
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
  newProductExpireDate
  tags {
    id
    brandId
    tag
    creationDate
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
    unavailableInEstablishmentIds
    extName
    extRef
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

