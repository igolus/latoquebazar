import {gql, request} from 'graphql-request'

const config = require('../conf/config.json')
const common = `
    id
    creationDate
    updateDate
    startDate
    endDate
    totalPreparationTime
    deliveryNumber
    excludedDeliveryNumber
    maxDelivery
    locked
    deliveryMode
`

export const getBookingSlotsOccupancyQueryNoApollo = async (brandId, establishmentId) => {
  // var debug = `
  //    {
  //     getProductTagsByBrandId(brandId : "${brandId}") {
  //         ${common}
  //       }
  //     }
  // `
  // console.log(debug);
    //getBookingSlotsOccupancyByBrandIdAndEstablishmentId(brandId: ID!,  establishmentId: String): [BookingSlotOccupancy]
  const query = gql`
    {
      getBookingSlotsOccupancyByBrandIdAndEstablishmentId(brandId : "${brandId}", establishmentId : "${establishmentId}") {
        ${common}
      }
    }
  `

  let data = await request(config.graphQlUrl, query);
  return data;
}

