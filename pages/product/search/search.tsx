import React from 'react'
import {useRouter} from "next/router";
import ProductList from "@component/products/ProductList";
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder"
import useAuth from "@hook/useAuth";

export interface ProductsSearchResultProps {
    contextData?: any
}

const ProductsSearchResult:React.FC<ProductsSearchResultProps> = ({contextData}) => {
    const router = useRouter();
    //const { getContextData } = useAuth();
    //const { query } = router.query

    return (
        <ProductList contextData={contextData}/>
    )
}

// export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
//     return getStaticPathsUtil()
// }

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

// const sortOptions = [
//     { label: 'Relevance', value: 'Relevance' },
//     { label: 'Date', value: 'Date' },
//     { label: 'Price Low to High', value: 'Price Low to High' },
//     { label: 'Price High to Low', value: 'Price High to Low' },
// ]

export default ProductsSearchResult
