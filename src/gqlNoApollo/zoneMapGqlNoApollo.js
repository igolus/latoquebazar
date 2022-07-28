import {gql, request} from 'graphql-request'

const config = require('../conf/config.json')

const common = `
  id
  name
  points {
    lng
    lat
  }
`

export const getZoneMapListQueryNoApollo = async (brandId, establishmentId) => {
  var debug = `
    query {
      getZones(brandId : "${brandId}", establishmentId: "${establishmentId}") {
          ${common}
      }
    }
  `
  console.log(debug);

  const query = gql`
    query {
      getZones(brandId : "${brandId}", establishmentId: "${establishmentId}") {
          ${common}
      }
    }
  `;

  let data = await request(config.graphQlUrl, query);
  return data;
}