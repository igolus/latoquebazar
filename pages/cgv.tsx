import React from 'react'
import {GetStaticProps} from "next";
import useAuth from "@hook/useAuth";
import MdRender from "@component/MdRender";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {Head} from "next/document";

export interface ProductDetailsProps {
    contextData?: any
}
//const config = require('../../../src/conf/config.json');

const Cgv:React.FC<ProductDetailsProps> = ({contextData}) => {

    //const router = useRouter();

    let pageId = "10";
    const extraPage = (contextData?.extraPages || []).find(page => page.id === pageId);

    const {currentEstablishment, bookingSlotStartDate, getContextDataAuth} = useAuth();


    function getContextData() {
        if (getContextDataAuth() && (getContextDataAuth()?.extraPages || []).find(page => page.id === pageId)) {
            return getContextDataAuth()
        }
        return contextData;
    }

    return (
        <>
            {/*<Head>*/}
            {/*    <link rel="shortcut icon" id="favicon"*/}
            {/*          href={contextData?.brand?.iconUrl}/>*/}
            {/*</Head>*/}

            <div style={{margin:"25px"}}>
                {extraPage && extraPage.content &&
                <MdRender content = {extraPage.content}/>
                }
            </div>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default Cgv
