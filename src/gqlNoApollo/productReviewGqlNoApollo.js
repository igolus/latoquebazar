import {gql, request} from 'graphql-request'

const config = require('../conf/config.json')
const common = `
    id
    comment
    stars
    creationDate
    updateDate
    userName
    userIconUrl
    userId
`

export const getProductReviewsQueryNoApollo = async (brandId, productId) => {
    var debug = `
     {
      getProductReviews(brandId : "${brandId}", productId: "${productId}") {
          ${common}
        }
      }
  `
    // console.log(debug);

    const query = gql`
    {
      getProductReviews(brandId : "${brandId}", productId: "${productId}") {
          ${common}
        }
      }
  `

    let productReviews = await request(config.graphQlUrl, query);
    return productReviews.getProductReviews;
}

