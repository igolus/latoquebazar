import {executeQueryUtil} from "../apolloClient/gqlUtil";
import {getProductsQuery} from "../gql/productGql";
import {getOrderDeliveryMode, orderDeliveryMode, TYPE_DEAL, TYPE_PRODUCT} from "./constants";
import moment from "moment";
import localStrings from "../localStrings";

export const getSkusLists = async (brandId) => {
    let res = await executeQueryUtil(getProductsQuery(brandId));
    let allSkus = [];
    res.data.getProductsByBrandId.forEach(product => {
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
    return deal.lines.map(line => parseFloat(line.pricingValue)).reduce((a, v) => a+v);
}

export const computePriceDetail = (orderInCreation) => {
    let totalNoTax = 0;
    let total = 0;
    let totalPreparationTime= 0;
    let taxDetail = {};
    orderInCreation.order.items.forEach(item => {
        let price = computeTotalPriceValue(item)
        total += price;
        let priceNoTax = 0;
        let taxPrice = 0;
        if (item.preparationTime) {
            totalPreparationTime += item.preparationTime * item.quantity;
        }

        if (item.vat) {
            priceNoTax = price / (1 + (item.vat / 100));
            totalNoTax += priceNoTax;
            taxPrice = price - priceNoTax;
            if (taxDetail[item.vat.toString()]) {
                taxDetail[item.vat.toString()] = taxDetail[item.vat.toString()] + taxPrice;
            }
            else {
                taxDetail[item.vat.toString()] = taxPrice;
            }
        }
        else {
            totalNoTax += price
        }
    })

    orderInCreation.order.deals.forEach(deal => {
        deal.productAndSkusLines.forEach(line => {
            let price = computeTotalPriceValue(line, deal.quantity);
            total += price;
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
                }
                else {
                    taxDetail[line.vat.toString()] = taxPrice;
                }
            }
            else {
                totalNoTax += price;
            }
        })
    })

    Object.keys(taxDetail).forEach(key => {
        taxDetail[key] = Math.round(taxDetail[key] * 100) / 100;
    })


    return {
        totalNoTax: Math.round(totalNoTax * 100) / 100,
        total: Math.round(total * 100) / 100,
        totalPreparationTime: totalPreparationTime,
        taxDetail: taxDetail,
    };
}

export function formatOrderConsumingMode(item, localStrings) {
    if (item.deliveryMode) {
        let localValue = getOrderDeliveryMode(localStrings).find(source => source.value === item.deliveryMode);
        if (localValue) {
            return localValue.name;
        }
        return "";
    }
    return ""
}

export const getDeliveryDistance = async (establishment, lat, lng) => {
    let distanceService = new window.google.maps.DistanceMatrixService()
    //google.maps.DistanceMatrixService
    if (!establishment.lat || !establishment.lat) {
        return true;
    }
    let placeEstablishment = new window.google.maps.LatLng(establishment.lat ,  establishment.lng);
    let place = new window.google.maps.LatLng(lat ,lng);
    //

    return new Promise((resolve, reject) => {
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
    if (establishment.serviceSetting) {
        return establishment.serviceSetting.enableDelivery;
    }
    return [];
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
