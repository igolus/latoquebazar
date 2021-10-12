import {getProductsQueryNoApollo} from "./gqlNoApollo/productGqlNoApollo";
import {getCategoriesQueryNoApollo} from "./gqlNoApollo/categoriesGqlNoApollo";

export async function loadProps() {
    const config = require("../../../src/existingconfs/config.json")
    const resProducts = await getProductsQueryNoApollo(config.brandId);
    let products = [];

    if (resProducts && resProducts.getProductsByBrandId) {
        products = resProducts.getProductsByBrandId;
    }

    let categories = [];
    const resCats = await getCategoriesQueryNoApollo(config.brandId)
    if (resCats && resCats.getProductCategoriesByBrandId) {
        categories = resCats.getProductCategoriesByBrandId;
    }

    return {
        props: {
            products,
            categories,
        },
    }
}