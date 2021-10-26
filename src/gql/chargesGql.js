import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

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
export const getChargesQuery = (brandId) => {
  var debug = `
    query {
      getChargesByBrandId(brandId : "${brandId}") {
        ${common}
      }  
    }
  `
  console.log(debug);

  return gql`
    query {
      getChargesByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `;
}


export const getChargeByChargeIdQuery = (brandId, chargeId) => {
  var debug = `
    query {
      getChargeByChargeId(brandId : "${brandId}", chargeId: "${chargeId}") {
          ${common}
        }
      }
  `
  console.log(debug);

  return gql`
     query {
      getChargeByChargeId(brandId : "${brandId}", chargeId: "${chargeId}") {
          ${common}
        }
      }
  `;
}

export const updateChargeMutation = (brandId, data, merge) => {
  var dataString = filterDataGql(data);
  var mergeValue = merge || false;
  var debug = `
    mutation {
      updateCharge(brandId: "${brandId}", data: ${dataString}, merge: ${mergeValue} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      updateCharge(brandId: "${brandId}", data: ${dataString}, merge: ${mergeValue} ) {
        ${common}
      }
    }
  `;
}

export const createChargeMutation = (brandId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addCharge(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
   mutation {
      addCharge(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

export const bulkDeleteChargeMutation = (brandId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteCharge(brandId: "${brandId}", chargeIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteCharge(brandId: "${brandId}", chargeIds: ${idsString}) {
        ids
      }
    }
  `;
}

export const deletedDataToChargeCache = async (brandId, ids) => {
  const query = getChargesQuery(brandId);
  const result = await executeQueryUtil(query);

  const newData = result.data.getChargesByBrandId.filter(item =>
    !ids.includes(item.id)
  )

  if (newData) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getChargesByBrandId: [...newData]
      },
    });
  }
}


export const addDataToChargeCache = async (brandId, datas) => {
  const query = getChargesQuery(brandId);
  const result = await executeQueryUtil(query);

  if (result) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getChargesByBrandId: [...result.data?.getChargesByBrandId || [], ...datas]
      },
    });
  }
}

