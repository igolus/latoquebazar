import NavbarLayout from '@component/layout/NavbarLayout'
import {Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import React from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import useAuth from "@hook/useAuth";
import {useRouter} from "next/router";
import ReactMarkdown from "react-markdown";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
//const { markdownToTxt } = require('markdown-to-txt');

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginTop: 80,
    marginBottom: 24,
    minHeight: 0,
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
    '& .inner-tab': {
        fontWeight: 600,
        minHeight: 40,
        textTransform: 'capitalize',
    },
}))


export interface ProductDetailsProps {
    contextData?: any
}

//const config = require('../../../src/conf/config.json');

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData}) => {

    const router = useRouter();

    const { id } = router.query
    let pageId = id;
    const extraPage = contextData.extraPages.find(page => page.id === pageId);

    const {currentEstablishment, bookingSlotStartDate, getContextDataAuth} = useAuth();


    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().extraPages.find(page => page.id === pageId)) {
            return getContextDataAuth()
        }
        return contextData;
    }

    return (
        <NavbarLayout contextData={getContextData()}
        >
            {/*<p>{JSON.stringify(selectedProduct || {})}</p>*/}

            <p>
                {pageId}
            </p>
            {extraPage && extraPage.content &&
            <ReactMarkdown>{extraPage.content}</ReactMarkdown>
            }
        </NavbarLayout>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    // const config = require("../../../src/conf/config.json")
    // const resProducts = await getProductsQueryNoApollo(config.brandId);
    // let products = [];
    //
    // if (resProducts && resProducts.getProductsByBrandId) {
    //     products = resProducts.getProductsByBrandId;
    // }
    //
    // let paths = []
    // products.forEach(product => {
    //     if (product.skus && product.skus.length === 1) {
    //         paths.push({ params: { id: product.id } })
    //     }
    //     else if (product.skus && product.skus.length > 1) {
    //         for (let i = 0; i < product.skus.length; i++) {
    //             paths.push({ params: { id: product.id + "-" + i } })
    //         }
    //         //paths.push({ params: { id: product.id } })
    //     }
    // })

    return {
        paths: [
            { params: { id: "1" }},
            { params: { id: "2" }},
            { params: { id: "3" }},
        ], //indicates that no page needs be created at build time
        fallback: false //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {

    return await getStaticPropsUtil();
}

export default ProductDetails
