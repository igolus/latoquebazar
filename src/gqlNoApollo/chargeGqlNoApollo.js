import {gql, request} from 'graphql-request'

const config = require('../conf/config.json')
const common = `
        id
        external
        extName
        name
        extRef
        creationDate
        updateDate
        pricingEffect
        pricingValue
        restrictionsList {
          establishmentId
            dow {
              day
              service
            }
            startDate
            endDate
            startTime
            endTime
            serviceTypes
            minOrderAmount
            maxPerOrder
            maxPerCustomer
            maxOrderAmount
            minDeliveryDistance
            maxDeliveryDistance
            description
        } 
`

export const getChargeQueryNoApollo = async (brandId) => {
    var debug = `
     {
      getChargesByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `
    //console.log(debug);

    const query = gql`
    {
      getChargesByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

    let charges = await request(config.graphQlUrl, query);
    return charges;
}