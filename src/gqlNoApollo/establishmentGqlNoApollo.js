import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')
const common = `
  id
        counterOrder
        brandId
        city
        companyNumber
        phoneNumber
        establishmentName
        creationDate
        updateDate
        establishmentSiteName
        address
        placeId
        postcode
        citycode
        lat
        lng
        country
        state
        zipCode
        config {
          key
          value  
        }
        offlinePaymentMethods
        onlinePaymentMethods
        serviceSetting {
          slotDuration
          minimalSlotNumberBooking
          minimalSlotNumberBookingNoDelivery
          maxDistanceDelivery
          minimalDeliveryOrderPrice
          enableDelivery
          printDeliveryOnCreate
          deliveryMenIds
          daySetting {
            day
            uuid
            startHourBooking
            endHourBooking
            startHourDelivery
            endHourService
            maxDeliveryPerSlotPerMan
            numberOfDeliveryMan
            maxPreparationTimePerSlot
          }
          closingSlots {
            uuid   
            startDate
            endDate
          }
        }
`

export const getEstablishmentQueryNoApollo = async (brandId, establishmentId) => {
    const query = gql`
    {
      getEstablishment(brandId: "${brandId}", establishmentId: "${establishmentId}") {
        ${common}
      }
    }
  `
    let data = await request(config.graphQlUrl, query);
    return data;
}
