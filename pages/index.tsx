import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import Head from 'next/head';

//const config = require("../src/conf/config.json")
export interface IndexPageProps {
    contextData?: any
}



const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
    const key = "AIzaSyDc9rHf2zgpYqgkKgXGX4BNUOdcZbCrwEQ";
    return (

        <div>
            <Head>

                {/*<script*/}
                {/*    type="text/javascript"*/}
                {/*    src={"https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=places"}*/}
                {/*/>*/}

                {/*</script>*/}

                {/*<script  type="text/javascript"*/}

                {/*         src={"https://maps.googleapis.com/maps/api/js?libraries=places&key=" + key} ></script>*/}
            </Head>

            <AppLayout contextData={contextData}>
                {/*<h1>TOTO IndexPage</h1>*/}
                <CarouselCompo contextData={contextData}/>


                {/*<GrocerySection1/>*/}
                {/*<Section2 />*/}
                {/*<Section3 />*/}
                {/*<Section4 />*/}
                {/*<Section5 />*/}
                {/*<Section13 />*/}
                {/*<Section6 />*/}
                {/*<Section7 />*/}
                {/*<Section8 />*/}
                {/*<Section9 />*/}
                <SectionCategories categories={contextData.categories}/>
                {/*<Section11 />*/}
                {/*<Section12 />*/}
            </AppLayout>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default IndexPage
