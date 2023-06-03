const config = require('./config.json')
export function distanceApiUrl() {
    return config.baseServiceUrl + 'distanceApi'
}
export function sendEmailUrl() {
    return config.baseServiceUrl + 'sendMail'
}
export function getResetAccountLinkUrl() {
    return config.baseServiceUrl + 'getPasswordLink'
}
export function getActivationEmailLinkUrl() {
    return config.baseServiceUrl + 'activateMailLink'
}
export function paymentUrl() {
    return config.baseServiceUrl + 'charge'
}
export function systemPayTokenUrl() {
    return config.baseServiceUrl + 'servicepayment/systemPayToken'
}
export function systemPayValidatePaymentUrl() {
    return config.baseServiceUrl + 'servicepayment/systemPayValidatePayment'
}
export function getMapByGeoPointUrl() {
    return config.baseServiceUrl + 'getMapByGeoPoint'
}
export function stuartApiUrl() {
    return config.baseServiceUrl + 'servicestuart'
}
export function takePaymentIframeUrl() {
    //return 'http://localhost:5001/latoqueprod/us-central1/servicepayment/takepayments'
    return config.baseServiceUrl + 'servicepayment/takepayments';
}
