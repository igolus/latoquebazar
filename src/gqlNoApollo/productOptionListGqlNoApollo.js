import { request, gql } from 'graphql-request'
const config = require('../conf/config.json')

const common = `
    id
    external
    extRef
    creationDate
    updateDate
    extId
    type
    extName
    name
    tags
    minValue
    maxValue
    mandatory
    options {
      extId
      extRef
      extName
      name
      price
    }
`

export const getOptionsListQueryNoApollo = async (brandId) => {
  var debug = `
    query {
      getProductOptionListsByBrandId(brandId : "${brandId}") {
          ${common}
      }
    }
  `
  console.log(debug);

  const query = gql`
    query {
      getProductOptionListsByBrandId(brandId : "${brandId}") {
          ${common}
      }
    }
  `;

  let data = await request(config.graphQlUrl, query);
  return data;
}