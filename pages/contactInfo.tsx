import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import Head from 'next/head';
import Navbar from "@component/navbar/Navbar";
import {Container} from "@material-ui/core";

//const config = require("../src/conf/config.json")
export interface IndexPageProps {
    contextData?: any
}

const ContactInfoPage:React.FC<IndexPageProps> = ({contextData}) => {
    return (
        <AppLayout navbar={<Navbar contextData={contextData}/>}>
            <h1>CONTACT INFO TODO</h1>
            <Container sx={{ mt: '2rem' }}>
                <div>About</div>
            </Container>
        </AppLayout>

    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ContactInfoPage
