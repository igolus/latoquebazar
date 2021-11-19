import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useEffect} from "react";
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
import useWindowSize from "@hook/useWindowSize";
import {Box} from "@material-ui/system";
import Image from "@component/BazarImage";
import {cloneDeep} from "@apollo/client/utilities";



export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
    const {currentEstablishment, setContextData, getContextData} = useAuth();

    useEffect(() => {
        setContextData(contextData);
    }, [])

    const width = useWindowSize()

    const config = require("../src/conf/config.json")

    function getContextDataOrInjected() {
        return getContextData() || contextData;
    }

    return (
        <div>
            <Head>
            </Head>

            <AppLayout contextData={getContextDataOrInjected()}>
                {getContextDataOrInjected()?.brand?.config?.carouselWebConfig &&
                <CarouselCompo contextData={getContextDataOrInjected()}/>
                }
                {getContextDataOrInjected()?.brand?.config?.starWebProducts &&
                <Section2 contextData={getContextDataOrInjected()}/>
                }

                <SectionCategories categories={getContextDataOrInjected()?.categories}
                                   deals={getContextDataOrInjected()?.deals}
                                   products={getContextDataOrInjected()?.products}/>


                {width <= 900 &&
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
            </AppLayout>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default IndexPage
