import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
        id
        error
`
export const addErrorMutation = (brandId, error) => {
  var debug = `
    mutation {
      addError(brandId : "${brandId}", error: "${error}") {
        ${common}
      }  
    }
  `
  console.log(debug);

  return gql`
    mutation {
      addError(brandId : "${brandId}", error: "${error}") {
        ${common}
      }  
    }
  `;
}