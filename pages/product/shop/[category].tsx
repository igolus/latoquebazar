import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder"
import {getCategoriesQueryNoApollo} from "../../../src/gqlNoApollo/categoriesGqlNoApollo";

export interface ProductsByCategoryProps {
    contextData?: any
}

const ProductsByCategory:React.FC<ProductsByCategoryProps> = ({contextData}) => {
    const router = useRouter()
    const { category } = router.query
    //const { getContextData } = useAuth();

    function getContextData() {
        return contextData;
    }

    // useEffect(() => {
    //     setContextData(contextData);
    // }, [contextData])

    //alert("products " + products)
    return (
        <div>
            {/*{JSON.stringify(contextData)}*/}
            <ProductList category={category} contextData={getContextData()}/>
        </div>
    )
}

function convertCatName(category) {
    return category.replace(/\s+/g, '-')
}

export const getStaticPaths: GetStaticPaths<{ category: string }> = async () => {
    const config = require("../../../src/conf/config.json")
    const resCats = await getCategoriesQueryNoApollo(config.brandId);
    let cats = [];

    if (resCats && resCats.getProductCategoriesByBrandId) {
        cats = resCats.getProductCategoriesByBrandId;
    }

    let paths = []
    cats.forEach(cat => {
        paths.push({ params: { category: convertCatName(cat.category) } })
    })
    paths.push({ params: { category: "all"} })

    return {
        paths: paths, //indicates that no page needs be created at build time
        fallback: false //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


export default ProductsByCategory
