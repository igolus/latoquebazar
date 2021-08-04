import filterDataGql from "../apolloClient/gqlUtil";
import {gql} from "@apollo/client";

const common = `
    id
    creationDate
    updateDate
    type
    link
    establishmentId
    notReadListUser
    senderId
`

export const addNotification = (brandId, data) => {
  var dataString = filterDataGql(data);
  var debug = `
    mutation {
      addNotification(brandId: "${brandId}", data: ${dataString}) {
        ${common}
      }
    }
  `
  console.log(debug);


  return gql`
    mutation {
      addNotification(brandId: "${brandId}", data: ${dataString}) {
        ${common}
      }
    }
  `;
}
