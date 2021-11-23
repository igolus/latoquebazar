import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";


const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  external
  category
  creationDate
  brandId
  extId
  extRef
  description
  files {
    creationDate
    name
    url
    path
    size
  }
`

export const getCategoriesQuery = (brandId) => {
  var debug = `
    query {
      getProductCategoriesByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    query {
      getProductCategoriesByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `;
}

export const getCategoriesByIdQuery = (brandId, categoryId) => {
  var debug = `
    query {
      getProductCategoryByCategoryId(brandId : "${brandId}", categoryId : "${categoryId}") {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    query {
      getProductCategoryByCategoryId(brandId : "${brandId}", categoryId : "${categoryId}") {
        ${common}
      }
    }
  `;
}

export const updateCategoriesMutation = (brandId, data, merge) => {
  var dataString = filterDataGql(data);
  var mergeValue = merge || false;
  var debug = `
    mutation {
      updateProductCategory(brandId: "${brandId}", data: ${dataString}, merge: ${mergeValue} ) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      updateProductCategory(brandId: "${brandId}", data: ${dataString}, merge: ${mergeValue} ) {
        ${common}
      }
    }
  `;
}

export const createCategoriesMutation = (brandId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addProductCategory(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
   mutation {
      addProductCategory(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

export const bulkDeleteProductCategoryMutation = (brandId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteProductCategory(brandId: "${brandId}", productCategoryIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteProductCategory(brandId: "${brandId}", productCategoryIds: ${idsString}) {
        ids
      }
    }
  `;
}

export const deletedDataToProductCategoriesCache = async (brandId, ids) => {
  const query = getCategoriesQuery(brandId);
  const result = await executeQueryUtil(query);

  const newData = result.data.getProductCategoriesByBrandId.filter(item =>
    !ids.includes(item.id)
  )

  if (newData) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductCategoriesByBrandId: [...newData]
      },
    });
  }
}


export const addDataToProductCategoryCache = async (brandId, datas) => {
  const query = getCategoriesQuery(brandId);
  const result = await executeQueryUtil(query);

  if (result) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductCategoriesByBrandId: [...result.data?.getProductCategoriesByBrandId || [], ...datas]
      },
    });
  }
}

