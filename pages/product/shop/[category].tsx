import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getProductsQueryNoApollo} from "../../../src/gqlNoApollo/productGqlNoApollo";
import {getCategoriesQueryNoApollo} from "../../../src/gqlNoApollo/categoriesGqlNoApollo";

export interface ProductsByCategoryProps {
    products?: any
    categories?: any
}

const ProductsByCategory:React.FC<ProductsByCategoryProps> = ({ products, categories}) => {
    const router = useRouter()
    const { category } = router.query
    //alert("products " + products)
    return (
        <div>
            {/*{JSON.stringify(categories)}*/}
            <ProductList category={category} products={products} categories={categories}/>
        </div>


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
export default ProductsByCategory
