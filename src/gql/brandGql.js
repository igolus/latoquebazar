import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";

const common = `
  id
  brandName
  brandSiteName
  creationDate
  publicUrls
  logoPath
  logoUrl
  iconPath
  iconUrl
  config {
    smsNotif
    currency
    googleKey
    notifEmailConfig {
      contentOne
      footer
      contentTwo
      fromEmail
      subject
      title
      sendMailOfflineOrdering
      sendMailOnlineOrdering
    }
  }
`


export const getAllBrandsQuery = () => {

  var debug = `
    query {
      getBrands {
        ${common}
    }
  `
  console.log(debug);

  return gql`
    query {
      getBrands {
        ${common}
      }
    }
  `;
}

export const getBrandByIdQuery = (brandId) => {
  var debug = `
    query {
      getBrand(brandId: "${brandId}") {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    query {
      getBrand(brandId: "${brandId}") {
        ${common}
      }
    }
  `;
}

export const updateBrandQuery = (data, merge) => {
  delete data['creationDate'];
  delete data['updateDate'];
  var dataString = filterDataGql(data);
  var mergeValue = merge || false;

  var debug = `
    mutation {
      updateBrand(data: ${dataString}, merge: ${mergeValue}) {
        ${common}
      }
    }
  `
  console.log(debug);

  return gql`
    mutation {
      updateBrand(data: ${dataString}, merge: ${mergeValue}) {
        ${common}
      }
    }
  `;
}

