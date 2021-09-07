import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')

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
  starWebProducts
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
    socialWebConfig {
      facebookUrl
      twitterUrl
      instagramUrl
    }
    carouselWebConfig {
      id
      name
      imageUrl
      title
      subTitle
      action
      openInNewTab
    }
  }
`

export const getBrandByIdQueryNoApollo = async (brandId) => {
    var debug = `
    query {
      getBrand(brandId: "${brandId}") {
        ${common}
      }
    }
  `

    const query = gql`
    query {
      getBrand(brandId: "${brandId}") {
        ${common}
      }
    }
    `

    let data = await request(config.graphQlUrl, query);
    return data;
}

export const getBrandQueryNoApollo = async (brandId) => {
  var debug = `
     {
      getProductsByBrandId(brandId : "${brandId}") {
          ${common}
        }
      }
  `
  //console.log(debug);

  const query = gql`
    {
      getProductsByBrandId(brandId : "${brandId}") {
        ${common}
      }
    }
  `

  let data = await request(config.graphQlUrl, query);
  return data;
}

