import apolloClient from "../apolloClient/ApolloClient";
import localStrings from '../localStrings';

export const START_ID_NULL = "-1"
const isEqual = require('lodash.isequal');

const filterDataGql = (data, keyToFilters, enumKeys) => {
  //delete data['submit'];
  var dataCopy = {...data}
  delete dataCopy['submit'];
  var dataString = JSON.stringify(dataCopy);
  //console.log("dataString " + dataString);
  let filter = dataString
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/__typename:"([^"]+)",/g, '')
    .replace(/__typename:"([^"]+)"/g, '')

    // .replace(/,([^"]+):null,/g, ',')
    // .replace(/,([^"]+):null/g, ',')

    .replace(/"([^"]+)":null,/g, '')
    .replace(/"([^"]+)":null/g, '')

  if (keyToFilters) {
    keyToFilters.forEach(key => {
      var replace = key + ":\"([^\"]+)\"";
      var replace2 = key + ":\"([^\"]+)\",";
      var regexp = new RegExp(replace,"g");
      var regexp2 = new RegExp(replace2,"g");
      filter = filter
        .replace(regexp, '')
        .replace(regexp2, '')
    })
  }

  if (enumKeys) {
    enumKeys.forEach(key => {
      var regExp = key + ":\"([^\"]+)\"";
      var search = new RegExp(regExp, "g")
      var matches = filter.match(search);
      if (matches) {
        matches.forEach(match => {
          let enumCorrected = match.replace(/\"/g, "");
          let regEx = new RegExp(match, "g");
          filter = filter.replace(regEx, enumCorrected)
        })
      }
      //var regexp = new RegExp(replace,"g");

    })
  }

  return filter;
};

export const  removeJsonEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeJsonEmpty(v) : v])
  );
}


export const isSameProfile = (matchingCustomer, data, searchAddress) => {

  return (matchingCustomer.userProfileInfo &&
    matchingCustomer.userProfileInfo.firstName === data.userProfileInfo.firstName &&
    matchingCustomer.userProfileInfo.lastName === data.userProfileInfo.lastName &&
    matchingCustomer.userProfileInfo.additionalInformation === data.userProfileInfo.additionalInformation &&
    matchingCustomer.userProfileInfo.searchAddress === searchAddress &&
    isEqual(matchingCustomer.brandAndDefaultEstablishment, data.brandAndDefaultEstablishment)
  )
}

export const executeMutationUtil = async (query) => {
  var data = await apolloClient.mutate({
    mutation: query
  });
  return data;
}

export const executeMutationUtilSync = (query) => {
  return apolloClient.mutate({
    mutation: query
  });
}

export const executeQueryUtil = async (query) => {
  try {
    let result = await apolloClient.query({
      query: query
    });
    if (!result || !result.data) {
      throw new Error(localStrings.unableToFetchData)
    }
    return result;
  }
  catch (err) {
    console.log(err)
  }
}

export const executeQueryUtilSync = (query) => {
  return apolloClient.query({
    query: query
  });
}

export const checkForCache = async (query) => {

  let readQuery = await apolloClient.readQuery({
    query: query
  });
  //alert("incache " + readQuery);
  return readQuery;
}

export const deleteCache = async (query) => {
  let readQuery = await apolloClient.de({
    query: query
  });
  return readQuery;
}

export default filterDataGql;
