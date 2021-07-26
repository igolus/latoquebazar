import {getProductsQueryNoApollo} from "../gqlNoApollo/productGqlNoApollo";
import {getCategoriesQueryNoApollo} from "../gqlNoApollo/categoriesGqlNoApollo";
import {getOptionsListQueryNoApollo} from "../gqlNoApollo/productOptionListGqlNoApollo";
import {getBrandByIdQueryNoApollo} from "../gqlNoApollo/brandGqlNoApollo";
import {getDealsQueryNoApollo} from "../gqlNoApollo/dealGqlNoApollo";
import {GetStaticPaths} from "next";
import {getTagsQueryNoApollo} from "../gqlNoApollo/tagsGqlNoApollo";


export async function getStaticPathsUtil() {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export async function getStaticPropsUtil() {
    const config = require("../conf/config.json")
    const resProducts = await getProductsQueryNoApollo(config.brandId);
    let products = [];

    if (resProducts && resProducts.getProductsByBrandId) {
        products = resProducts.getProductsByBrandId;
    }


    const resDeals = await getDealsQueryNoApollo(config.brandId);
    let deals = [];

    if (resDeals && resDeals.getDealsByBrandId) {
        deals = resDeals.getDealsByBrandId;
    }

    let categories = [];
    const resCats = await getCategoriesQueryNoApollo(config.brandId)
    if (resCats && resCats.getProductCategoriesByBrandId) {
        categories = resCats.getProductCategoriesByBrandId;
    }

    let tags = [];
    const resTags = await getTagsQueryNoApollo(config.brandId)
    if (resTags && resTags.getProductTagsByBrandId) {
        tags = resTags.getProductTagsByBrandId;
    }


    let options = [];
    const resOptions = await getOptionsListQueryNoApollo(config.brandId);
    if (resOptions.getProductOptionListsByBrandId) {
        options = resOptions.getProductOptionListsByBrandId;
    }

    let brand = {};
    const resBrand = await getBrandByIdQueryNoApollo(config.brandId);
    if (resBrand.getBrand) {
        brand = resBrand.getBrand;
    }

    return {
        props: {
            contextData: {
                products: products,
                deals: deals,
                categories: categories,
                brand: brand,
                options: options,
                tags: tags
            }
        },
    }

}