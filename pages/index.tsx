import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import Head from 'next/head';
import Section2 from "@component/home-1/Section2";

import {Typography} from "@material-ui/core";
import {isMobile} from "react-device-detect";
import Card1 from "@component/Card1";
import localStrings from "../src/localStrings";
import OpeningHours from "@component/OpeningHours";
import ClosingDays from "@component/ClosingDays";
import useAuth from "@hook/useAuth";
import MyMap from "@component/GoogleMap";



export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {

    const {currentEstablishment} = useAuth();
    const config = require("../src/conf/config.json")

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
                <SectionCategories categories={contextData.categories} products={contextData.products}/>


                {isMobile &&
                <div>
                    <Card1 sx={{mb: '2rem', mt:'2rem' }}>
                        <Typography  variant="h6" fontWeight="600" mb={4}>
                            {localStrings.place}
                        </Typography>
                        <MyMap
                            lat={currentEstablishment() ? currentEstablishment().lat : null}
                            lng={currentEstablishment() ? currentEstablishment().lng : null}
                            name={currentEstablishment() ? currentEstablishment().establishmentName : null}
                            googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + config.googleKey + "&libraries=geometry,drawing,places"}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                        />

                    </Card1>

                    <Card1 sx={{mb: '2rem'}}>
                        <Typography variant="h6" fontWeight="600" mb={4}>
                            {localStrings.openingHours}
                        </Typography>
                        <OpeningHours/>
                    </Card1>

                    <Card1 sx={{mb: '2rem'}}>
                        <ClosingDays/>
                    </Card1>
                </div>
                }
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
