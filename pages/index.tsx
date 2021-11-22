import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import Head from 'next/head';
import Section2 from "@component/home-1/Section2";

import {Typography} from "@material-ui/core";
import Card1 from "@component/Card1";
import localStrings from "../src/localStrings";
import OpeningHours from "@component/OpeningHours";
import ClosingDays from "@component/ClosingDays";
import useAuth from "@hook/useAuth";
import MyMap from "@component/GoogleMap";
import useWindowSize from "@hook/useWindowSize";


export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {

    const {currentEstablishment, getContextDataAuth} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().brand) {
            return getContextDataAuth()
        }
        return contextData;
    }

    function firstOrCurrentEstablishment() {
        if (currentEstablishment()) {
            return currentEstablishment();
        }
        return getContextData().establishments[0];
    }
    // useEffect(() => {
    //     setContextData(contextData);
    // }, [])

    const width = useWindowSize()

    const config = require("../src/conf/config.json")

    // function getContextDataOrInjected() {
    //     return getContextData() || contextData;
    // }

    return (
        <div>
            <Head>
            </Head>

            <AppLayout contextData={getContextData()}>
                {getContextData()?.brand?.config?.carouselWebConfig &&
                <CarouselCompo contextData={getContextData()}/>
                }
                {getContextData()?.brand?.config?.starWebProducts &&
                <Section2 contextData={getContextData()}/>
                }

                <SectionCategories categories={getContextData()?.categories}
                                   contextData={getContextData()}
                                   deals={getContextData()?.deals}
                                   products={getContextData()?.products}/>


                {width <= 900 &&
                <div>
                    <Card1 sx={{mb: '2rem', mt:'2rem' }}>
                        <Typography  variant="h6" fontWeight="600" mb={4}>
                            {localStrings.place}
                        </Typography>
                        <MyMap
                            lat={firstOrCurrentEstablishment() ? firstOrCurrentEstablishment().lat : null}
                            lng={firstOrCurrentEstablishment() ? firstOrCurrentEstablishment().lng : null}
                            name={firstOrCurrentEstablishment() ? firstOrCurrentEstablishment().establishmentName : null}
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
                        <OpeningHours firstEsta={getContextData().establishments[0]}/>
                    </Card1>

                    <Card1 sx={{mb: '2rem'}}>
                        <ClosingDays firstEsta={getContextData().establishments[0]}/>
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
