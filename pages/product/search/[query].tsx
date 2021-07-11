import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getProductsQueryNoApollo} from "../../../src/gqlNoApollo/productGqlNoApollo";
import {getCategoriesQueryNoApollo} from "../../../src/gqlNoApollo/categoriesGqlNoApollo";

const ProductsSearchResult = ({ products, categories}) => {
    const router = useRouter()
    const { query } = router.query

    return (
        <ProductList query={query} products={products} categories={categories}/>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}
export const getStaticProps: GetStaticProps = async (context) => {
    const config = require("../../../src/conf/config.json")
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

const sortOptions = [
    { label: 'Relevance', value: 'Relevance' },
    { label: 'Date', value: 'Date' },
    { label: 'Price Low to High', value: 'Price Low to High' },
    { label: 'Price High to Low', value: 'Price High to Low' },
]

export default ProductsSearchResult
