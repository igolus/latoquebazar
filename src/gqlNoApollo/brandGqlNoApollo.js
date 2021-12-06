import { request, gql } from 'graphql-request'

const config = require('../conf/config.json')

const common = `
  id
  stripeStatus
  brandName
  brandSiteName
  creationDate
  publicUrls
  logoPath
  logoUrl
  iconPath
  iconUrl
  demoSite
  config {
    smsNotif
    currency
    siteUrl
    googleKey
    starWebProducts
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
      enableShareOnFacebookButton
    }
    metaWebConfig {
      title
      description
      ogImage
    }
    paymentWebConfig {
      paymentType
      activateOnlinePayment
      stripePublicKey
      systemPayPublicKey
      systemPayEndPoint
    }
    carouselWebConfig {
      id
      name
      imageUrl
      title
      subTitle
      action
      actionText
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

