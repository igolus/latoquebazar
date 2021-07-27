import {executeQueryUtil} from "../apolloClient/gqlUtil";
import {getProductsQuery} from "../gql/productGql";

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
        return productName;
    }
    return (sku.productName + " " + sku.name).trim()

}
