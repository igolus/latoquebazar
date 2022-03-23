import {gql, request} from 'graphql-request'

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
    useCustomHomePage
    customHomePageSource
    customHomePageSourceVariables
    currency
    siteUrl
    googleKey
    starWebProducts
    signagePage
    loginImg
    proposeDeal
    carouselAsList
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
      googleMBUrl
      googleMBCommentUrl
      twitterUrl
      instagramUrl
      enableShareOnFacebookButton
    }
    loyaltyConfig {
      useLoyalty
      loyaltyConversionEarn
      loyaltyConversionSpend
      minPointSpend
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
      customContent
      useCustomContent
      title
      subTitle
      action
      actionText
      actionSecond
      actionTextSecond
      openInNewTab
      openInNewTabSecond
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

