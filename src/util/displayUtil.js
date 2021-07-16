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