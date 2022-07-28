import {getProductsQueryNoApollo} from "../gqlNoApollo/productGqlNoApollo";
import {getCategoriesQueryNoApollo} from "../gqlNoApollo/categoriesGqlNoApollo";
import {getOptionsListQueryNoApollo} from "../gqlNoApollo/productOptionListGqlNoApollo";
import {getBrandByIdQueryNoApollo} from "../gqlNoApollo/brandGqlNoApollo";
import {getDealsQueryNoApollo} from "../gqlNoApollo/dealGqlNoApollo";
import {getTagsQueryNoApollo} from "../gqlNoApollo/tagsGqlNoApollo";
import {getEstablishmentsQueryNoApollo} from "../gqlNoApollo/establishmentGqlNoApollo";
import {getExtraPagesQueryNoApollo} from "../gqlNoApollo/extraPagesGqlNoApollo";
import {Base64} from 'js-base64';
import {getZoneMapListQueryNoApollo} from "../gqlNoApollo/zoneMapGqlNoApollo";
import config from "../conf/config.json";

const Mustache = require("mustache");

export async function getStaticPathsUtil() {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export async function getContextDataApollo() {
    const config = require("../conf/config.json")
    const resProducts = await getProductsQueryNoApollo(config.brandId);
    let products = [];

    if (resProducts && resProducts.getProductsByBrandId) {
        products = sortChainList(resProducts.getProductsByBrandId);
    }

    const resDeals = await getDealsQueryNoApollo(config.brandId);
    let deals = [];

    if (resDeals && resDeals.getDealsByBrandId) {
        deals = sortChainList(resDeals.getDealsByBrandId);
    }

    let categories = [];
    const resCats = await getCategoriesQueryNoApollo(config.brandId)
    if (resCats && resCats.getProductCategoriesByBrandId) {
        categories = sortChainList(resCats.getProductCategoriesByBrandId);
    }

    let tags = [];
    const resTags = await getTagsQueryNoApollo(config.brandId)
    if (resTags && resTags.getProductTagsByBrandId) {
        tags = resTags.getProductTagsByBrandId;
    }


    let options = [];
    const resOptions = await getOptionsListQueryNoApollo(config.brandId);
    if (resOptions.getProductOptionListsByBrandId) {
        options = sortChainList(resOptions.getProductOptionListsByBrandId);
    }

    let brand = {};
    const resBrand = await getBrandByIdQueryNoApollo(config.brandId);
    if (resBrand.getBrand) {
        brand = resBrand.getBrand;
        updateBrandBase64HomPage(brand);
    }

    let establishments = [];
    const resEstas = await getEstablishmentsQueryNoApollo(config.brandId);
    if (resEstas.getEstablishmentByBrandId) {
        establishments = resEstas.getEstablishmentByBrandId;
    }



    let extraPages = [];
    const resExtraPages = await getExtraPagesQueryNoApollo(config.brandId);
    if (resExtraPages.getExtraPages) {
        extraPages = resExtraPages.getExtraPages || [];
    }

    let zoneMap = [];
    for (let i = 0; i < establishments.length; i++) {
        const establishment = establishments[i];
        const resZoneMap = await getZoneMapListQueryNoApollo(config.brandId, establishment.id);
        if (resZoneMap.getZones) {
            zoneMap = zoneMap.concat(resZoneMap.getZones.map(z => {
                return {...z, establishmentId: establishment.id}
            }))
        }
    }

    return {
        products: products,
        deals: deals,
        categories: categories,
        brand: brand,
        options: options,
        tags: tags,
        establishments: establishments,
        extraPages: extraPages,
        zoneMap: zoneMap
    }
}

export function sortChainList(itemSource) {
    if (!itemSource || itemSource.length === 0) {
        return [];
    }
    let sorted = [];
    let firstItem = itemSource.find(item => item.chainedListItem &&
        (!item.chainedListItem.previousId || item.chainedListItem.previousId=="") && item.chainedListItem.nextId);
    if (!firstItem) {
        return itemSource;
    }
    sorted.push(firstItem);


    var current = firstItem;
    let counter = 0;
    while ((current?.chainedListItem?.nextId || (current?.chainedListItem?.nextId && current?.chainedListItem?.nextId != "")) && counter <= itemSource.length) {
        const nextId = current.chainedListItem?.nextId;
        current = itemSource.find(item => item.id === nextId);
        if (current) {
            sorted.push(current);
        }
        counter++
    }
    if (counter > itemSource.length) {
        return itemSource;
    }

    return sorted;
}


export function updateBrandBase64HomPage(brand) {
    if (brand.config && brand.config.useCustomHomePage && brand.config.customHomePageSource) {
        brand.config.customHomePageSource = Base64.decode(brand.config.customHomePageSource);
        if (brand.config.customHomePageSourceVariables &&
            brand.config.customHomePageSourceVariables.customHomePageSourceVariables != "") {
            let variablesValuesObj = JSON.parse(Base64.decode(brand.config.customHomePageSourceVariables));
            if (Object.keys(variablesValuesObj).length > 0) {
                brand.config.customHomePageSource = Mustache.render(brand.config.customHomePageSource, variablesValuesObj);
            }
        }
    }
}

export function updateExtraPageBase64(extraPage) {
    if (!extraPage || !extraPage.content) {
        return;
    }
    extraPage.content = Base64.decode(extraPage.content);
    if (extraPage.variablesValues) {
        let variablesValuesObj = JSON.parse(Base64.decode(extraPage.variablesValues));
        if (Object.keys(variablesValuesObj).length > 0) {
            extraPage.content = Mustache.render( extraPage.content, variablesValuesObj);
        }
    }
}


export async function getStaticPropsUtil() {
    const config = require("../conf/config.json")
    const resProducts = await getProductsQueryNoApollo(config.brandId);
    let products = [];

    if (resProducts && resProducts.getProductsByBrandId) {
        products = sortChainList(resProducts.getProductsByBrandId);
    }

    const resDeals = await getDealsQueryNoApollo(config.brandId);
    let deals = [];

    if (resDeals && resDeals.getDealsByBrandId) {
        deals = sortChainList(resDeals.getDealsByBrandId);
    }

    let categories = [];
    const resCats = await getCategoriesQueryNoApollo(config.brandId)
    if (resCats && resCats.getProductCategoriesByBrandId) {
        categories = sortChainList(resCats.getProductCategoriesByBrandId);
    }

    let tags = [];
    const resTags = await getTagsQueryNoApollo(config.brandId)
    if (resTags && resTags.getProductTagsByBrandId) {
        tags = resTags.getProductTagsByBrandId;
    }


    let options = [];
    const resOptions = await getOptionsListQueryNoApollo(config.brandId);
    if (resOptions.getProductOptionListsByBrandId) {
        options = sortChainList(resOptions.getProductOptionListsByBrandId);
    }

    let brand = {};
    const resBrand = await getBrandByIdQueryNoApollo(config.brandId);
    if (resBrand.getBrand) {
        brand = resBrand.getBrand;
        updateBrandBase64HomPage(brand);
    }

    let establishments = [];
    const resEstas = await getEstablishmentsQueryNoApollo(config.brandId);
    if (resEstas.getEstablishmentByBrandId) {
        establishments = resEstas.getEstablishmentByBrandId;
    }

    let extraPages = [];
    const resExtraPages = await getExtraPagesQueryNoApollo(config.brandId);
    if (resExtraPages.getExtraPages) {
        extraPages = resExtraPages.getExtraPages || [];
    }

    extraPages.forEach(extraPage => {
        extraPage.content = Base64.decode(extraPage.content);
        if (extraPage.variablesValues) {
            let variablesValuesObj = JSON.parse(Base64.decode(extraPage.variablesValues));
            if (Object.keys(variablesValuesObj).length > 0) {
                extraPage.content = Mustache.render( extraPage.content, variablesValuesObj);
            }
        }
    })

    // let zoneMap = [];
    // for (let i = 0; i < establishments.length; i++) {
    //     const establishment = establishments[i];
    //     const resZoneMap = await getZoneMapListQueryNoApollo(config.brandId, establishment.id);
    //     if (resZoneMap.getZones) {
    //         zoneMap = zoneMap.concat(resZoneMap.getZones.map(z => {
    //             return {...z, establishmentId: establishment.id}
    //         }))
    //     }
    // }

    return {
        props: {
            contextData: {
                products: products,
                deals: deals,
                categories: categories,
                brand: brand,
                options: options,
                tags: tags,
                establishments: establishments,
                extraPages: extraPages,
                //zoneMap: zoneMap
            },
        },
         //revalidate: parseInt(process.env.REVALIDATE_DATA_TIME) || 60,
    }

}