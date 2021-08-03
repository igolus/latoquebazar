import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
  id
  startDate
  endDate
  totalPreparationTime
  deliveryNumber
  excludedDeliveryNumber
  maxDelivery
  locked
`

export const createUpdateBookingSlotOccupancyMutation = (brandId, establishmentId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addOrUpdateBookingSlotsOccupancy(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
   mutation {
      addOrUpdateBookingSlotsOccupancy(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}


export const updateBookingSlotOccupancyMutation = (brandId, establishmentId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      updateBookingSlotsOccupancy(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
   mutation {
      updateBookingSlotsOccupancy(brandId: "${brandId}", establishmentId: "${establishmentId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}
