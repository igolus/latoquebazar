import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";


const common = `
  id
  chainedListItem {
    previousId
    nextId
  }
  external
  extRef
  creationDate
  updateDate
  extId
  type
  extName
  name
  tags
  minValue
  maxValue
  mandatory
  options {
    extId
    extRef
    extName
    defaultSelected
    noSelectOption
    unavailableInEstablishmentIds
    name
    price
  }
`

export const getOptionsListQuery = (brandId) => {
  var debug = `
    query {
      getProductOptionListsByBrandId(brandId : "${brandId}") {
           ${common}
        }
      }
  `
  console.log(debug);

  return gql`
    query {
      getProductOptionListsByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `;
}


export const getOptionListByOptionListIdQuery = (brandId, optionListId) => {
  var debug = `
    query {
      getOptionListByOptionListIdQuery(brandId : "${brandId}", productOptionListId: "${optionListId}") {
          ${common}
        }
      }
  `
  console.log(debug);

  return gql`
    query {
      getOptionListByOptionListIdQuery(brandId : "${brandId}", productOptionListId: "${optionListId}") {
          ${common}
        }
      }
  `;
}

export const updateOptionsListMutation = (brandId, data, merge) => {
  var dataString = filterDataGql(data);
  var mergeValue = merge || false;
  var debug = `
    mutation {
      updateProductOptionList(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
          ${common}
        }
      }
  `
  console.log(debug);

  return gql`
     mutation {
      updateProductOptionList(brandId: "${brandId}", data: ${dataString} , merge: ${mergeValue} ) {
          ${common}
        }
      }
  `;
}

export const createOptionsListMutation = (brandId, data) => {
  var dataString = filterDataGql(data);

  var debug = `
    mutation {
      addProductOptionList(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
    }
  `
  console.log(debug);


  return gql`
   mutation {
      addProductOptionList(brandId: "${brandId}", data: ${dataString} ) {
        ${common}
      }
    }
  `;
}

// bulkDeleteProductOptionList(brandId: ID!, productOptionListIds: [String]): IdsSingle

export const bulkDeleteProductOptionsListMutation = (brandId, ids) => {
  var idsString =  JSON.stringify(ids);

  var debug = `
    mutation {
      bulkDeleteProductOptionList(brandId: "${brandId}", productOptionListIds: ${idsString}) {
        ids
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      bulkDeleteProductOptionList(brandId: "${brandId}", productOptionListIds: ${idsString}) {
        ids
      }
    }
  `;
}

export const deletedDataToProductOptionsListCache = async (brandId, ids) => {
  const query = getOptionsListQuery(brandId);
  const result = await executeQueryUtil(query);

  const newData = result.data.getProductOptionListsByBrandId.filter(item =>
    !ids.includes(item.id)
  )

  if (newData) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductOptionListsByBrandId: [...newData]
      },
    });
  }
}

export const addDataToProductOptionsListCache = async (brandId, datas) => {
  const query = getOptionsListQuery(brandId);
  const result = await executeQueryUtil(query);

  if (result) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductOptionListsByBrandId: [...result.data?.getProductOptionListsByBrandId || [], ...datas]
      },
    });
  }
}

export const updateDataToProductOptionsListCache = async (brandId, data) => {
  const query = getOptionsListQuery(brandId);
  const result = await executeQueryUtil(query);

  const exceptList = [...result.data.getProductOptionListsByBrandId].filter(optionListItem =>
    optionListItem.id != data.id);
  if (result) {
    await apolloClient.writeQuery({
      query: query,
      data: {
        getProductOptionListsByBrandId: [...exceptList, {...data}]
      },
    });
  }
}

