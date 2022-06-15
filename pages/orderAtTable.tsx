import AppLayout from '@component/layout/AppLayout'
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useEffect, useState} from "react";
import Navbar from "@component/navbar/Navbar";
import useAuth from "@hook/useAuth";
import {GetStaticProps} from "next";
import localStrings from "../src/localStrings";
import OrderAtTableComponent from "@component/orderAtTable/OrderAtTableComponent";
import {useRouter} from "next/router";
import ClipLoaderComponent from "@component/ClipLoaderComponent";

export interface IndexPageProps {
    contextData?: any
}

const ContactInfoPage:React.FC<IndexPageProps> = ({contextData}) => {
    const {tableId, currentEstablishment} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (tableId && currentEstablishment()) {
            router.push("/")
        }
    }, [tableId, currentEstablishment()])
    return (
        <>
            <ClipLoaderComponent/>
            {/*<AppLayout contextData={contextData}*/}
            {/*           title={localStrings.deliveryHourAndPlaceDesc}*/}
            {/*           description={localStrings.deliveryHourAndPlaceDesc}*/}
            {/*           navbar={<Navbar contextData={contextData}/>}>*/}
            {/*    <OrderAtTableComponent contextData={contextData}/>*/}
            {/*</AppLayout>*/}
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ContactInfoPage
