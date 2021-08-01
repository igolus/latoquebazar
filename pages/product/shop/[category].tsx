import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder"

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
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}
export default ProductsByCategory
