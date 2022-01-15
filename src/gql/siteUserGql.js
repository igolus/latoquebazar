import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
    id
    hubriseId
    defaultEstablishmentId
    establishmentIds
    brandId
    messagingTokens
    userProfileInfo {
        createdAt
        address
        email
        firstName
        lastLoginAt
        lastName
        phoneNumber
        photoURL
        city
        placeId
        additionalInformation
        lng
        lat
        otherAddresses {
          id
          name  
          address
          city
          postcode
          citycode
          searchAddress   
          additionalInformation
          placeId
          lat
          lng
        }
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

export const createSiteUserMutation = (brandId, data) => {
    var dataString = filterDataGql(data);

    var debug = `
    mutation {
      addSiteUser(brandId: "${brandId}", data: ${dataString}) {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      addSiteUser(brandId: "${brandId}", data: ${dataString}) {
        ${common}
      }
    }
  `;
}


export const updateSiteUserQuery = (brandId, data) => {
    var dataString = filterDataGql(data);

    var debug = `
    mutation {
      updateSiteUser(brandId: "${brandId}", data: ${dataString}) {
        ${common}
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      updateSiteUser(brandId: "${brandId}", data: ${dataString}) {
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

export const addSiteUserMessagingToken = (brandId, siteUserId, token) => {
    //var dataString = filterDataGql(data);

    var debug = `
    mutation {
      addSiteUserMessagingToken(brandId: "${brandId}", siteUserId: "${siteUserId}", token: "${token}") {
        id
      }
    }
  `
    console.log(debug);

    return gql`
    mutation {
      addSiteUserMessagingToken(brandId: "${brandId}", siteUserId: "${siteUserId}", token: "${token}") {
        id
      }
    }
  `;
}

