import { request, gql } from 'graphql-request'

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
  console.log(debug);

  const query = gql`
    {
      getProductsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

  let data = await request(config.graphQlUrl, query);
  return data;
}

