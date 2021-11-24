import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";

//getEstablishmentByBrandId
const common = `
  id
  counter
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
  contactMail
  sendOrderInHubiseAuto
  sendCustomerInHubiseAuto
  deliverExternalOrder
  config {
    key
    value  
  }
  offlinePaymentMethods
  onlinePaymentMethods
  serviceSetting {
    slotDuration
    lunchDinnerSeparator
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
      limitHourEligibility
      deliveryMode
      slotDuration
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

export const establishmentsQuery = (brandId) => {
  var debug = `
    query {
      getEstablishmentByBrandId(brandId: "${brandId}") {
        ${common}
      }
    }
  `

  console.log(debug);

  return gql `query {
    getEstablishmentByBrandId(brandId: "${brandId}") {
      ${common}
    }
  }
`;
}


export const getEstablishmentQuery = (brandId, establishmentId) => {
  var debug = `
    query {
    getEstablishment(brandId: "${brandId}", establishmentId: "${establishmentId}") {
      ${common}
    }
  }
  `

  console.log(debug);

  return gql `
  query {
    getEstablishment(brandId: "${brandId}", establishmentId: "${establishmentId}") {
      ${common}
    }
  }
`;
}

export const createEstablishmentMutation = (data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addEstablishment(data: ${dataString}) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      addEstablishment(data: ${dataString}) {
        ${common}
      }
    }
  `;
}

export const updateEstablishmentMutation = (data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      updateEstablishment(data: ${dataString}) {
        ${common}
      }
    }
  `


  console.log(debug);

  return gql`
    mutation {
      updateEstablishment(data: ${dataString}) {
        ${common}
      }
    }
  `;
}

export const deleteEstablishmentMutation = (data) => {
  console.log("data) " + JSON.stringify(data));
  var dataString = filterDataGql(data);

  return gql`
    mutation deleteEstablishment{
      deleteEstablishment(data: ${dataString}) {
        ${common}
      }
    }
  `;
}

export const bulkDeleteEstablishmentMutation = (brandId, establishments) => {
  var establishmentIdsString =  JSON.stringify(establishments);

  return gql`
    mutation bulkDeleteEstablishment{
      bulkDeleteEstablishment(brandId: "${brandId}", establishmentIds: ${establishmentIdsString}) {
        ids
      }
    }
  `;
}

export const deletedDataToEstablishmentsCache = async (brandId, ids) => {
  const queryEstablishments = establishmentsQuery(brandId);
  const dataEstablishments = await executeQueryUtil(queryEstablishments);
  const newData = dataEstablishments.data.getEstablishmentByBrandId.filter(establishment =>
    !ids.includes(establishment.id)
  )

  if (dataEstablishments) {
    await apolloClient.writeQuery({
      query: queryEstablishments,
      data: {
        getEstablishmentByBrandId: [...newData]
      },
    });
  }
}


export const addDataToEstablishmentCache = async (brandId, datas) => {
  const queryEstablishments = establishmentsQuery(brandId);
  const dataEstablishments = await executeQueryUtil(queryEstablishments);

  if (dataEstablishments) {
    await apolloClient.writeQuery({
      query: queryEstablishments,
      data: {
        getEstablishmentByBrandId: [...dataEstablishments.data.getEstablishmentByBrandId, ...datas]
      },
    });
  }
}

export const resetOrderCounterMutation = (brandId, establishmentId) => {

  var debug = `
    mutation resetOrderCounter{
      resetOrderCounter(brandId: "${brandId}", establishmentId: "${establishmentId}") {
        result
      }
    }
  `

  console.log(debug);

  return gql`
    mutation resetOrderCounter{
      resetOrderCounter(brandId: "${brandId}", establishmentId: "${establishmentId}") {
        result
      }
    }
  `;
}

