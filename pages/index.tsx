import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useState} from "react";
import Head from 'next/head';
import Section2 from "@component/home-1/Section2";

import {Box} from "@material-ui/core";
import LogoSection from "@component/home-1/LogoSection";
import {isMobile} from "react-device-detect";
import Image from "@component/BazarImage";

//const config = require("../src/conf/config.json")
export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
    // const [width, setWidth] = useState<number>(window.innerWidth);
    // let isMobile: boolean = (width <= 768);
    return (

        <div>

            <Head>
                {/*{contextData.brand.iconUrl &&*/}
                {/*<link rel="shortcut icon" id="favicon"*/}
                {/*      href={contextData.brand.iconUrl}/>*/}
                {/*}*/}
                {/*<script*/}
                {/*    type="text/javascript"*/}
                {/*    src={"https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=places"}*/}
                {/*/>*/}

                {/*</script>*/}

                {/*<script  type="text/javascript"*/}

                {/*         src={"https://maps.googleapis.com/maps/api/js?libraries=places&key=" + key} ></script>*/}
            </Head>

            {/*{isMobile &&*/}
            {/*<Box justifyContent="center" mb={1} mt={1}>*/}
            {/*    <Image mb={2.5} src={contextData?.brand?.logoUrl} alt="logo" />*/}
            {/*</Box>*/}
            {/*}*/}

            <AppLayout contextData={contextData}>


                {/*<h1>TOTO IndexPage</h1>*/}
                {/*<LogoSection/>*/}

                {/*<Box mt={-0.5} mb={-0.5} display="flex" justifyContent="center">*/}
                {/*    <Box p={1}>*/}
                {/*        <Image mt={1} src={contextData?.brand?.logoUrl} alt="logo"/>*/}
                {/*    </Box>*/}

                {/*    /!*<Box p={1}>*!/*/}
                {/*    /!*  <Typography variant="h3" fontWeight="600" mb={2} mt={2}>*!/*/}
                {/*    /!*    {contextData?.brand?.brandName}*!/*/}
                {/*    /!*  </Typography>*!/*/}
                {/*    /!*</Box>*!/*/}
                {/*</Box>*/}
                {/*}*/}

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
