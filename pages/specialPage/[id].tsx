import NavbarLayout from '@component/layout/NavbarLayout'
import {Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import React from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import useAuth from "@hook/useAuth";
import {useRouter} from "next/router";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";

export interface ProductDetailsProps {
    contextData?: any
}

export function renderMd(contentMd) {

    var md = require('markdown-it')({
        html: true,
        linkify: true,
        typographer: true
    });

    return md.render(contentMd);
    //
    // var markdown = ReactMarkdown.parse(this.props.markdown);
    // return <div dangerouslySetInnerHTML={{__html:markdown}} />;
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
            {extraPage && extraPage.content &&
            <div
                dangerouslySetInnerHTML={{__html: renderMd(extraPage.content)}}
            />
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
