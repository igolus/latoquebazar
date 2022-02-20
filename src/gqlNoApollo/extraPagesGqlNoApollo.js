import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')

const common = `
id
    active
    title
    content
    displayInUtil
    variablesValues
`

export const getExtraPagesQueryNoApollo = async (brandId) => {

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
      getExtraPages(brandId : "${brandId}") {
        ${common}
      }
    }
  `

    let data = await request(config.graphQlUrl, query);
    return data;
}

