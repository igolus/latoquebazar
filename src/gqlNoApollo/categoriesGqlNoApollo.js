import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')
const common = `
  id
        external
        category
        creationDate
        brandId
        extId
        extRef
        description
        files {
            path
            url
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

