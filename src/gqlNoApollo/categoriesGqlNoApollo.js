import {gql, request} from 'graphql-request'

const config = require('../conf/config.json')
const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  external
  category
  creationDate
  brandId
  extId
  extRef
  description
  files {
    creationDate
    name
    url
    path
    size
  }
`

export const getCategoriesQueryNoApollo = async (brandId) => {
  // var debug = `
  //    {
  //     getProductCategoriesByBrandId(brandId : "${brandId}") {
  //         ${common}
  //       }
  //     }
  // `
  // console.log(debug);

  const query = gql`
    {
      getProductCategoriesByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

  let data = await request(config.graphQlUrl, query);
  return data;
}

