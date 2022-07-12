import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  hubriseId
  visible
  external
  extName
  shortCode
  name
  extRef
  creationDate
  updateDate
  newProduct
  dealNotSelectable
  upsellDeal
  newProductExpireDate
  category {
    id
    brandId
    category
    creationDate
  }
  description
  shortDescription
  additionalInformation
  couponCodes
  restrictionsList {
    establishmentId
      dow {
        day
        service
      }
      deliveryZones
      startDate
      endDate
      startTime
      endTime
      
      startBookingTime
      endBookingTime
      bookingAndDeliverySameDay
      
      serviceTypes
      minOrderAmount
      maxPerOrder
      maxPerCustomer
      maxOrderAmount
      minDeliveryDistance
      maxDeliveryDistance
      description
  }
  tags {
    id
    brandId
    tag
    creationDate
  } 
  imageIds
  files {
    creationDate
    name
    url
    path
    size
  }
  lines {
    name
    uuid
    external
    pricingEffect
    pricingValue
    skus {
      name
      extName
      extRef
      price
      optionListExtIds
    }
  }
`

export const getDealsQuery = (brandId) => {
  var debug = `
    query {
      getDealsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    query {
      getDealsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }  
    `
}

export const getDealByIdQuery = (brandId, dealId) => {
  var debug = `
   query {
    getDealByDealId(brandId : "${brandId}", dealId: "${dealId}") {
      ${common}
    }
   }
  `
  console.log(debug);

  return gql`
   query {
      getDealByDealId(brandId : "${brandId}", dealId: "${dealId}") {
        ${common}
      }
    }
  `;
}


export const updateDealMutation = (brandId, data, merge) => {
  var dataString = filterDataGql(data, null, ["service"]);
  var mergeValue = merge || false;
  var debug = `
    mutation {
      updateDeal(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
    mutation {
      updateDeal(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
        ${common}
      }
    }
  `;
}

export const createDealsMutation = (brandId, data) => {
  var dataString = filterDataGql(data, null, ["service"]);

  var debug = `
    mutation {
      addDeal(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      addDeal(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}
//
export const bulkDeleteDealMutation = (brandId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteDeal(brandId: "${brandId}", dealIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteDeal(brandId: "${brandId}", dealIds: ${idsString}) {
        ids
      }
    }
  `;
}
//
export const deletedDataToDealsCache = async (brandId, ids) => {
  const query = getDealsQuery(brandId);
  const result = await executeQueryUtil(query);

  const newData = result.data.getDealsByBrandId.filter(item =>
    !ids.includes(item.id)
  )

  if (newData) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getDealsByBrandId: [...newData]
      },
    });
  }
}

export const addDdealToProductCache = async (brandId, datas) => {
  const query = getDealsQuery(brandId);
  const result = await executeQueryUtil(query);

  if (result) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getDealsByBrandId: [...result.data?.getProductsByBrandId || [], ...datas]
      },
    });
  }
}

export const addDdealToProductCacheSync = (brandId, datas) => {
  return new Promise(async (resolve, reject) => {
    const query = getDealsQuery(brandId);
    executeQueryUtilSync(query).then(async (result) => {
      try {
        // alert("result " + JSON.stringify(result));
        //alert("result.data?.getProductsByBrandId " + JSON.stringify(result.data?.getDealsByBrandId));
        await apolloClient.writeQuery({
          query: query,
          data: {
            getDealsByBrandId: [...result.data?.getDealsByBrandId || [], datas.data.addDeal]
          }
        })
        resolve()
      }
      catch (err) {
        reject(err);
      }
    });
  })
}

