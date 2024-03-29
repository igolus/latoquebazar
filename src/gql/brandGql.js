import {gql} from "@apollo/client";
import filterDataGql from "../apolloClient/gqlUtil";

const common = `
  id
  stripeStatus
  brandName
  country
  brandSiteName
  creationDate
  publicUrls
  logoPath
  logoUrl
  iconPath
  iconUrl
  config {
    useCustomHomePage
    customHomePageSource
    customHomePageSourceVariables
    smsNotif
    currency
    siteUrl
    language
    googleKey
    facebookPixelId
    analyticsGoogleId
    starWebProducts
    proposeDeal
    loginImg
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
    notifPushConfig {
      sendPushNotification
      pushNotificationImgUrl
    }
    paymentWebConfig {
      paymentType
      activateOnlinePayment
      forceOnlinePaymentDelivery
      stripePublicKey
      systemPayPublicKey
      systemPayEndPoint
      merchantID,
      merchantSecret,
      countryCode,
      currencyCode,
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

export const getBrandStripPrivateKey = (brandId) => {
    var debug = `
    query {
      getBrandStripPrivateKey(brandId: "${brandId}") {
        stripePrivateKey
      }
    }
  `
    console.log(debug);

    return gql`
    query {
      getBrandStripPrivateKey(brandId: "${brandId}") {
        stripePrivateKey
      }
    }
  `;
}

export const updateGetBrandStripPrivateKeyCache = async (brandId, privateKey) => {
    const query = getBrandStripPrivateKey(brandId);
    //const result = await executeQueryUtil(query);
    //alert("update cache " + privateKey);
    //if (result) {
    await apolloClient.writeQuery({
        query: query,
        data: {
            getBrandStripPrivateKey: {stripePrivateKey: privateKey}
            //__typename: 'StripPrivateKey',

        },
    });
    //}
}

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

