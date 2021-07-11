import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
    id
    defaultEstablishmentId
    establishmentIds
    brandId
    userProfileInfo {
        createdAt
        email
        firstName
        lastLoginAt
        lastName
        phoneNumber
        photoURL
        city
    }
    
`

export const getAllSiteUsersQuery = () => {
    var debug = `
    query {
      getSiteUsers {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    query {
      getSiteUsers {
        ${common}
      }
    }
  `;
}

export const getSiteUserByIdQuery = (brandId, siteUserId) => {
    var debug = `
    query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    query {
      getSiteUser(brandId: "${brandId}", siteUserId: "${siteUserId}") {
        ${common}
      }
    }
  `;
}

export const createSiteUserMutation = (siteUserId, data) => {
    var dataString = filterDataGql(data);

    var debug = `
    mutation {
      addSiteUser(siteUserId: "${siteUserId}", data: ${dataString}) {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      addSiteUser(siteUserId: "${siteUserId}", data: ${dataString}) {
        ${common}
      }
    }
  `;
}


export const updateSiteUserQuery = (data) => {
    var dataString = filterDataGql(data);

    var debug = `
    mutation {
      updateSiteUser(data: ${dataString}) {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      updateSiteUser(data: ${dataString}) {
        ${common}
      }
    }
  `;
}

export const deleteSiteUserQuery = (data) => {
    var dataString = filterDataGql(data);

    var debug = `
    mutation {
      deleteSiteUser(data: ${dataString}) {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      deleteSiteUser(data: ${dataString}) {
        ${common}
      }
    }
  `;
}

