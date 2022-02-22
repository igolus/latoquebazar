import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')
const common = `
    id
    tag
    color
`

export const getTagsQueryNoApollo = async (brandId) => {
  // var debug = `
  //    {
  //     getProductTagsByBrandId(brandId : "${brandId}") {
  //         ${common}
  //       }
  //     }
  // `
  // console.log(debug);

  const query = gql`
    {
      getProductTagsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

  let data = await request(config.graphQlUrl, query);
  return data;
}

