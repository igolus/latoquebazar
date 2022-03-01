import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";

const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  external
  extId
  extName
  creationDate
  updateDate
  name
  price
  discountPercent
  nonDiscountedPrice
  description
  shortDescription
  additionalInformation
  newProduct
  allergens
  notAddableToCart
  newProductExpireDate
  tags {
    id
    brandId
    tag
    creationDate
    color
  } 
  category {
    id
    brandId
    category
    creationDate
  }
  description
  price
  files {
    creationDate
    name
    url
    path
    size
  }
  skus {
    name
    visible
    onlyInDeal
    unavailableInEstablishmentIds
    extName
    extRef
    sourceExtRefDup
    price
    nonDiscountedPrice
    percentDiscount
    valueDiscount
    vat
    preparationTime
    optionListExtIds
    productName
    extraCharge
    shortCode
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
  }
`

export const getProductsQuery = async (brandId) => {
  var debug = `
     query {
      getProductsByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `
  console.log(debug);

  return gql`
    query {
      getProductsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `;
}

export const getProductsByIdQuery = (brandId, productId) => {
  var debug = `
     query {
      getProductByProductId(brandId : "${brandId}", productId: "${productId}") {
          ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    query {
      getProductByProductId(brandId : "${brandId}", productId: "${productId}") {
        ${common}
      }
    }
  `;
}


export const updateProductsMutation = (brandId, data, merge) => {
  var dataString = filterDataGql(data);
  var mergeValue = merge || false;
  var debug = `
    mutation {
      updateProduct(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
    mutation {
      updateProduct(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
        ${common}
      }
    }
  `;
}

export const updateMultiProductsMutation = (brandId, datas) => {
  let dataString="["

  datas.forEach(data => {
    dataString += filterDataGql(data);
  })

  dataString+="]"

  var debug = `
    mutation {
      updateProducts(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
   `
  console.log(debug);

  return gql`
     mutation {
      updateProducts(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
   `
}

export const createMultiProductsMutation = (brandId, datas) => {
  let dataString="["

  datas.forEach(data => {
    dataString += filterDataGql(data);
  })

  dataString+="]"

  var debug = `
    mutation {
      addProducts(brandId: "${brandId}", data: ${dataString} ) {
          id
      }
    }
   `
  console.log(debug);

  return gql`
     mutation {
      addProducts(brandId: "${brandId}", data: ${dataString} ) {
          id
      }
    }
   `
}

export const createProductsMutation = (brandId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addProduct(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
     mutation {
      addProduct(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
     }
  `;
}

export const bulkDeleteProductMutation = (brandId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteProduct(brandId: "${brandId}", productIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteProduct(brandId: "${brandId}", productIds: ${idsString}) {
        ids
      }
    }
  `;
}

export const deletedDataToProductsCache = async (brandId, ids) => {
  const query = getProductsQuery(brandId);
  const result = await executeQueryUtil(query);

  const newData = result.data.getProductsByBrandId.filter(item =>
    !ids.includes(item.id)
  )

  if (newData) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductsByBrandId: [...newData]
      },
    });
  }
}


export const addDataToProductCache = async (brandId, datas) => {
  const query = getProductsQuery(brandId);
  const result = await executeQueryUtil(query);
  try {
    if (result) {
      await apolloClient.writeQuery({
        query: query,
        data: {
          getProductsByBrandId: [...result.data.getProductsByBrandId, ...datas]
        },
      });
    }
  }
  catch (err) {
    console.log(err)
  }
}

export const addDataToProductCacheSync = (brandId, datas) => {
  return new Promise(async (resolve, reject) => {
    const query = getProductsQuery(brandId);
    executeQueryUtilSync(query).then(async (result) => {
      try {
        await apolloClient.writeQuery({
          query: query,
          data: {
            getProductsByBrandId: [...result.data.getProductsByBrandId, ...datas]
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
