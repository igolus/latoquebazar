import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import Head from 'next/head';
import Section6 from "@component/home-1/Section6";
import Section7 from "@component/home-1/Section7";
import Section8 from "@component/home-1/Section8";
import Section5 from "@component/home-1/Section5";
import Section2 from "@component/home-1/Section2";
import Section3 from "@component/home-1/Section3";
import Section4 from "@component/home-1/Section4";
import Section9 from "@component/home-1/Section9";
import Section11 from "@component/home-1/Section11";
import Section12 from "@component/home-1/Section12";
import Section1 from "@component/landing/Section1";

//const config = require("../src/conf/config.json")
export interface IndexPageProps {
    contextData?: any
}



const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
    return (

        <div>
            <Head>
                {contextData.brand.iconUrl &&
                <link rel="shortcut icon" id="favicon"
                      href={contextData.brand.iconUrl}/>
                }
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
                {contextData?.brand?.config?.starWebProducts &&
                    <Section2 contextData={contextData}/>
                }
                {/*<GrocerySection1/>*/}
                {/*<Section2 />*/}
                {/*<Section3 />*/}
                {/*<Section4 />*/}
                {/*<Section5 />*/}
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
