import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import React from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import ConfirmedOrderComponent from "@component/orders/ConfirmedOrderComponent";

export interface ConfirmedProps {
    contextData?: any
}

const ConfirmedOrder:React.FC<ConfirmedProps> = ({contextData}) => {

    function getContextData() {
        return contextData;
    }

    return (
        <CheckoutNavLayout contextData={getContextData()} noIndex={true}>
            <ConfirmedOrderComponent contextData={getContextData()}/>
        </CheckoutNavLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ConfirmedOrder
