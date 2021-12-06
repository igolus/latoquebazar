import {executeQueryUtil} from "../apolloClient/gqlUtil";
import {getProductsQuery} from "../gql/productGql";
import {
    getOrderDeliveryMode,
    getOrderStatus, getPaymentMethods,
    ORDER_DELIVERY_MODE_DELIVERY,
    orderDeliveryMode, STRIPE_SUB_STATUS_ACTIVE, STRIPE_SUB_STATUS_TRIALING,
    TYPE_DEAL,
    TYPE_PRODUCT
} from "./constants";
import moment from "moment";
import localStrings from "../localStrings";
import axios from "axios";
import {DINNER_PERIOD, LUNCH_PERIOD} from "@component/form/BookingSlots";
import {itemHaveRestriction, itemRestrictionMax} from "@component/mini-cart/MiniCart";
const config = require('../conf/config.json')

export const getSkusLists = async (brandId) => {
    //const google = window.google;

    const google = window.google = window.google ? window.google : {}
    let res = await executeQueryUtil(getProductsQuery(brandId));
    //return [];
    let allSkus = [];
    console.log("res ->" + JSON.stringify(res))

    res.data.getProductsByBrandId.forEach(product => {
        if (product.skus) {
            product.skus.forEach(sku => {
                allSkus.push({ ...sku, productName: product.name, productId: product.id, id: sku.extRef })
            })
        }
    })
    return {data: allSkus};
}

export const getSkusListsFromProducts = (products) => {
    //let res = await executeQueryUtil(getProductsQuery(brandId));
    //return [];
    let allSkus = [];
    console.log("products " + JSON.stringify(products))
    products.forEach(product => {
        if (product.skus) {
            product.skus.forEach(sku => {
                allSkus.push({ ...sku, productName: product.name, productId: product.id, id: sku.extRef })
            })
        }
    })
    return {data: allSkus};
}

export const getCroppedProfileName = (user) => {
    let profileName = getProfileName(user);
    if (profileName.length > 25) {
        return  profileName.substring(0, 22) + "...";
    }
    return profileName;
}


export const getProfileName = (user) => {
    if (!user) {
        return "";
    }
    let firstName = user.userProfileInfo ? (user.userProfileInfo.firstName || '') : '';
    let lastName = user.userProfileInfo ? (user.userProfileInfo.lastName || '') : '';
    return (firstName + " " + lastName).trim();
}

export const getBrandCurrency = (brand) => {
    let currency = "€"
    if (!brand || !brand.config || !brand.config.currency) {
        return currency;
    }
    //alert(brand.config.currency)
    switch (brand.config.currency) {
        case 'EUR':
            return "€"
        case 'USD':
            return "$"
        case 'GBP':
            return "£"
    }
}

export function getProductFirstImgUrl(product) {
    if (product && product.files && product.files.length > 0) {
        return  product.files[0].url;
    }
    return null
}


export const getTotalPriceOrderInCreation = (orderInCreation) => {
    if (!orderInCreation || !orderInCreation() || !orderInCreation().order || !orderInCreation().order.items) {
        return "";
    }
    let totalPrice = 0;
    orderInCreation().order.items.forEach(item => {
        totalPrice += computeTotalPriceValue(item)
    })
    // (orderInCreation().order.deals || []).forEach(deal => {
    //     deal.productAndSkusLines.forEach(line => {
    //         totalPrice += computeTotalPriceValue(line, deal.quantity);
    //     })
    //
    // })
    return totalPrice.toFixed(2);
}

export const computeTotalPriceValue = (itemSkuBooking, mul = 1) => {
    if (itemHaveRestriction(itemSkuBooking)) {
        return 0;
    }
    let sum = parseFloat(itemSkuBooking.price);
    if (itemSkuBooking.options) {
        itemSkuBooking.options.forEach(option => sum+= parseFloat(option.price))
    }
    return (sum  * itemSkuBooking.quantity * mul);
}

export const formatProductAndSkuName = (sku) => {

    if (sku.productName === sku.name) {
        return sku.productName;
    }
    return (sku.productName + " " + sku.name).trim()

}

export const getMininimalSkuPrice = (item) => {
    //console.log("formatMininimalSkuPrice " + JSON.stringify(item))
    if (item.type === TYPE_PRODUCT) {
        return item.skus.map(sku => parseFloat(sku.price)).sort((p1, p2) => p2-p1)[0];
    }
    if (item.type === TYPE_DEAL) {
        return getPriceDeal(item);
    }
    return 0;

}

export const getPriceDeal = (deal) => {
    if (!deal || !deal.lines) {
        return 0;
    }
    return deal.lines.map(line => parseFloat(line.pricingValue)).reduce((a, v) => a+v);
}

export const computePriceDetail = (orderInCreation) => {

    if (!orderInCreation) {
        return {
            totalNoTax: 0,
            total: 0,
            totalNoCharge: 0,
            totalPreparationTime: 0,
            taxDetail: 0,
            totalCharge: 0
        };
    }

    let totalNoTax = 0;
    let totalNoCharge = 0;
    let totalCharge = 0;
    let total = 0;
    let totalPreparationTime= 0;
    let taxDetail = {};
    (orderInCreation?.charges || []).forEach(charge => {
        totalCharge += charge.price;
    });

    orderInCreation?.order?.items.forEach(item => {
        let price = computeTotalPriceValue(item)
        totalNoCharge += price;
        let priceNoTax = 0;
        let taxPrice = 0;

        //alert("itemHaveRestriction(item) " + itemHaveRestriction(item))
        if (!itemHaveRestriction(item)) {
            if (item.preparationTime) {
                totalPreparationTime += item.preparationTime * item.quantity;
            }

            if (item.vat) {
                priceNoTax = price / (1 + (item.vat / 100));
                totalNoTax += priceNoTax;
                taxPrice = price - priceNoTax;
                if (taxDetail[item.vat.toString()]) {
                    taxDetail[item.vat.toString()] = taxDetail[item.vat.toString()] + taxPrice;
                } else {
                    taxDetail[item.vat.toString()] = taxPrice;
                }
            } else {
                totalNoTax += price
            }
        }
    })

    orderInCreation?.order?.deals.forEach(deal => {
        if (!itemHaveRestriction(deal.deal)) {
            deal.productAndSkusLines.forEach(line => {

                let price = computeTotalPriceValue(line, deal.quantity);
                totalNoCharge += price;
                let priceNoTax = 0;
                let taxPrice = 0;
                if (line.vat) {
                    if (line.preparationTime) {
                        totalPreparationTime += line.preparationTime * deal.quantity;
                    }

                    priceNoTax = price / (1 + (line.vat / 100));
                    totalNoTax += priceNoTax;
                    taxPrice = price - priceNoTax;
                    if (taxDetail[line.vat.toString()]) {
                        taxDetail[line.vat.toString()] = taxDetail[line.vat.toString()] + taxPrice;
                    } else {
                        taxDetail[line.vat.toString()] = taxPrice;
                    }
                } else {
                    totalNoTax += price;
                }
            })
        }
    })

    Object.keys(taxDetail).forEach(key => {
        taxDetail[key] = Math.round(taxDetail[key] * 100) / 100;
    })


    return {
        totalNoTax: Math.round(totalNoTax * 100) / 100,
        total: Math.round((totalNoCharge + totalCharge) * 100) / 100,
        totalNoCharge: Math.round(totalNoCharge * 100) / 100,
        totalPreparationTime: totalPreparationTime,
        taxDetail: taxDetail,
        totalCharge: totalCharge
    };
}

export function formatOrderConsumingMode(item, localStrings) {
    if (item && item.deliveryMode) {
        let localValue = getOrderDeliveryMode(localStrings).find(source => source.value === item.deliveryMode);
        if (localValue) {
            return localValue.name;
        }
        return "";
    }
    return ""
}

export function formatOrderConsumingModeGrid(item, localStrings) {
    if (item && item.deliveryMode) {
        let localValue = getOrderDeliveryMode(localStrings).find(source => source.value === item.deliveryMode);
        if (item.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY) {
            return localValue.name+ "                                                 ";
        }
        if (localValue) {
            return localValue.name;
        }
        return "";
    }
    return ""
}


export function formatOrderStatus(status, localStrings) {
    if (status) {
        let data = getOrderStatus(localStrings).find(item => item.value === status);
        if (data) {
            return data.name;
        }
    }
    return '';
}

export function formatPaymentMethod(methodKey, localStrings) {
    if (methodKey) {
        let data = getPaymentMethods(localStrings).find(item => item.valuePayment === methodKey);
        if (data) {
            return data.name;
        }
    }
    return methodKey;
}


export const getDeliveryDistanceWithFetch = async (establishment, lat, lng, address) => {
    let origins =  establishment.lat + "," + establishment.lng;
    let destinations =  lat + "," + lng;

    let res = await axios.get(config.distanceUrl + '?origins='+
        origins + '&destinations=' + destinations + '&key=' + config.googleKey);

    if (res && res.data && res.data.rows && res.data.rows.length > 0) {
        //alert(JSON.stringify(res.data.rows[0].elements[0].distance.value))
        let distanceInfo =
            {
                distance: res.data.rows[0].elements[0].distance.value,
                duration: res.data.rows[0].elements[0].duration.value,
            }
        return distanceInfo;
    }
    return null;
}

export const getDeliveryDistance = async (establishment, lat, lng) => {
    // if (!window.google) {
    //     return null
    // }

    let distanceService = new google.maps.DistanceMatrixService()
    //google.maps.DistanceMatrixService
    if (!establishment.lat || !establishment.lat) {
        return true;
    }
    let placeEstablishment = new google.maps.LatLng(establishment.lat ,  establishment.lng);
    let place = new window.google.maps.LatLng(lat ,lng);
    //

    new Promise((resolve, reject) => {
        distanceService.getDistanceMatrix(
            {
                origins: [placeEstablishment],
                destinations: [place],
                travelMode: 'DRIVING'
            }, (response, status) => {

                if (response.rows) {
                    let row = response.rows[0];
                    if (row.elements) {
                        let element = row.elements[0]
                        resolve (
                            {
                                distance: element.distance.value,
                                duration: element.duration.value,
                            }
                        )
                    }
                }
                else {
                    new reject(Error("No data"))
                }
            });
    });
}

export const getMaxDistanceDelivery = (establishment) => {
    if (establishment.serviceSetting && establishment.serviceSetting.enableDelivery) {
        return establishment.serviceSetting.maxDistanceDelivery;
    }
    return 0;
}

export const isDeliveryActive = (establishment) => {
    return establishment?.serviceSetting?.enableDelivery;
}

export const formatDuration = (distanceInfo, localStrings) => {
    if (!distanceInfo.duration) {
        return "";
    }
    if (distanceInfo.duration < 3600) {
        return moment("2015-01-01").startOf('day')
            //.format()
            .seconds(distanceInfo.duration)
            .format(localStrings.formatDurationNoHour);
        //.format();
    }
    else {
        return moment("2015-01-01").startOf('day')
            .seconds(distanceInfo.duration)
            .format(localStrings.formatDuration);
        //.format();
    }
}

// export const getSkusLists = async (currentBrand) => {
//     let res = await executeQueryUtil(getProductsQuery(currentBrand.id));
//     let allSkus = [];
//     res.data.getProductsByBrandId.forEach(product => {
//         if (product.skus) {
//             product.skus.forEach(sku => {
//
//                 let categoryProduct = "";
//                 if (product.category && product.category.category) {
//                     categoryProduct = product.category.category;
//                 }
//                 allSkus.push({ ...sku, productName: product.name, productId: product.id, id: sku.extRef, category: categoryProduct })
//             })
//         }
//     })
//     return {data: allSkus};
// }

export function getEstablishmentSettings(establishment, key) {
    if (!establishment || !establishment.config || !establishment.config.some(item => item.key == key)) {
        return null
    }
    let value = establishment.config.find(item => item.key == key).value;
    if (value === "true")
    {
        return true;
    }
    if (value === "false") {
        return false;
    }
    return value;
}

export const getCroppedString = (value) => {
    return value.substring(0, 22) + "...";
}

export const getCroppedStringSize = (value, size) => {
    return value.substring(0, size + "...");
}

export function getImgUrlFromProducts(item, products) {

    if (!products) {
        return null;
    }
    let defaultUrl = "/assets/images/Icon_Sandwich.png";
    if (item.type === TYPE_DEAL) {
        return getProductFirstImgUrl(item.deal) || defaultUrl;
    }

    let product = products.find(p=>p.id === item.productId);
    //if (product && product.files && product.files.leng)
    if (product) {
        return getProductFirstImgUrl(product) || defaultUrl;
    }


}

export function getImgUrlFromProductsWithExtRef(item, products) {
    if (!products) {
        //alert("NO PRODUCT")
        return null;
    }
    if (item.type === TYPE_DEAL) {
        return getProductFirstImgUrl(item.deal);
    }

    let product = products.find(p=>p.skus.some(sku => sku.extRef === item.extRef));
    //if (product && product.files && product.files.leng)
    if (product) {
        return getProductFirstImgUrl(product);
    }
    return null;
}

export const getOrderBookingSlotStartDate = (order) => {
    if (!order.bookingSlot) {
        return moment();
    }
    return moment.unix(order.bookingSlot.startDate);
}

export const getOrderBookingSlotEndDate = (order) => {
    if (!order.bookingSlot) {
        return moment();
    }
    return moment.unix(order.bookingSlot.endDate);
}

export const formatOrderDeliveryDateSlot = (order) => {
    if (!order) {
        return "";
    }
    return getOrderBookingSlotStartDate(order)
            .locale("fr")
            .calendar() + " - " +
        getOrderBookingSlotEndDate(order)
            .format("HH:mm");
}

export function getRemainingToPay(order) {
    if (!order) {
        return 0;
    }
    let totalRemaining = parseFloat(order.totalPrice);

    if (order.payments) {
        order.payments.forEach(payment => {
            totalRemaining -= parseFloat(payment.amount);
        });
    }
    return totalRemaining;
}


export function filterCat(categories, products, deals) {
    const allCatProductIds = [];

    products?.forEach(p => {
        let visible = (p.skus || []).some(sku => sku.visible)
        let catId = p.category?.id
        if (visible && catId) {
            if (!allCatProductIds.includes(catId)) {
                allCatProductIds.push(catId)
            }
        }
    })

    //alert(JSON.stringify(deals))
    deals?.forEach(deal => {
        //if () {
            let catId = deal.category?.id
            if (deal.visible && catId) {
                if (!allCatProductIds.includes(catId)) {
                    allCatProductIds.push(catId)
                }
            }

    })


    return (categories || []).filter(cat => allCatProductIds.includes(cat.id));
    //return categories;
}


export function getTextStatus(order, localStrings) {
    return formatOrderStatus(order?.status, localStrings)
}

export function getFirstRestrictionItem(item) {
    if (!item) {
        return null;
    }
    if (itemRestrictionMax(item)) {
        return null;
    }
    if (item.restrictionsList && item.restrictionsApplied?.length > 0) {
        return item.restrictionsApplied[0].local || item.restrictionsApplied[0].type;
    }
    return null;
}

export function getFirstRestrictionDescription(item) {
    if (!item) {
        return null;
    }
    if (item.restrictionsList && item.restrictionsApplied?.length > 0) {
        return item.restrictionsApplied[0].description;
    }
    return null;
}

export const displayDow = (itemDow) => {
    return localStrings["day_" + itemDow.day] + " " + localStrings[itemDow.service];
}

export const displayService = (itemDow) => {
    if (itemDow.service === DINNER_PERIOD) {
        return localStrings.dinner;
    }
    if (itemDow.service === LUNCH_PERIOD) {
        return localStrings.lunch;
    }
}

export const getMinutesFromHour = (hourString) => {
    let split = hourString.split(':');
    if (split.length === 2) {
        let durationMinutes = parseInt(split[0]) * 60 + parseInt(split[1]);
        return  durationMinutes;
    }
    return 0;
}

export function isBrandInBadStripStatus(brand) {
    if (!brand) {
        return true;
    }
    //console.log("brand.stripeStatus " + brand?.stripeStatus)
    return brand.stripeStatus !== STRIPE_SUB_STATUS_ACTIVE && brand.stripeStatus !== STRIPE_SUB_STATUS_TRIALING;
    //return brand.stripeStatus !== STRIPE_SUB_STATUS_ACTIVE;
}


export const getMinutesFromDate = (dateTimeString) => {
    let dateTimeMoment = moment(dateTimeString).locale('fr');
    return dateTimeMoment.hour() * 60 + dateTimeMoment.minute();
}

export const convertCatName = (productName) => {
    return productName.replace(/\s+/g, '-')
}

export const firstOrCurrentEstablishment = (currentEstablishment, contextData) => {
    if (currentEstablishment()) {
        return currentEstablishment();
    }
    return contextData.establishments[0];
}

