import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder"

export interface ProductsByCategoryProps {
    contextData?: any
}

const ProductsByCategory:React.FC<ProductsByCategoryProps> = ({ contextData }) => {
    const router = useRouter()
    const { category } = router.query
    //alert("products " + products)
    return (
        <div>
            {/*{JSON.stringify(contextData)}*/}
            <ProductList category={category} contextData={contextData}/>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return getStaticPathsUtil()
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}
export default ProductsByCategory
