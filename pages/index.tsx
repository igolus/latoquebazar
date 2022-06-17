import CarouselCompo from '@component/home-1/CarouselCompo'
import SectionCategories from '@component/home-1/SectionCategories'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useEffect} from "react";
import Section2 from "@component/home-1/Section2";

import {Box} from "@material-ui/core";
import useAuth from "@hook/useAuth";
import useWindowSize from "@hook/useWindowSize";
import {CUSTOM_HTML_HOME_COMPONENT, CUSTOM_HTML_SOURCE, WIDTH_DISPLAY_MOBILE} from "../src/util/constants";
import {mobileBox} from "@component/header/Header";
import Navbar from "@component/navbar/Navbar";
import {useRouter} from "next/router";
import CustomMain from "@component/CustomMain";

export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
    const router = useRouter();

    const {currentEstablishment, getContextDataAuth, contextDataState} = useAuth();

    function getContextData() {
        if (contextDataState && contextDataState.brand) {
            return getContextDataAuth()
        }
        return contextData;
    }

    function click(inLink) {
        if (inLink) {
            router.push(inLink)
        }
    }

    useEffect(() => {
        for (let i = 0; i < 10; i++) {
            let linkButt = document.getElementById("butlink_" + i);
            if (linkButt) {
                const inLink = linkButt.getAttribute("inLink");
                linkButt.onclick = () => click(inLink);
            }
        }
    }, [getContextDataAuth()])

    const width = useWindowSize()

    function getMainContent() {
        if (getContextData()?.brand?.config?.useCustomHomePage === CUSTOM_HTML_SOURCE) {
            return (
                <div>
                    <Navbar contextData={getContextData()}/>
                    <div className="text-container" dangerouslySetInnerHTML={{ __html: getContextData()?.brand?.config.customHomePageSource }} />
                </div>)
        }
        if (getContextData()?.brand?.config?.useCustomHomePage === CUSTOM_HTML_HOME_COMPONENT) {
            return (
                <div>
                    <Navbar contextData={getContextData()}/>
                    <CustomMain/>
                </div>)
        }
        return (
            <CarouselCompo contextData={getContextData()}/>
        )
    }

    return (
        <div>


            <AppLayout contextData={getContextData()}>
                {getMainContent()}
                {/*{getContextData()?.brand?.config?.useCustomHomePage && getContextData()?.brand?.config.customHomePageSource ?*/}
                {/*    <div>*/}
                {/*        <Navbar contextData={getContextData()}/>*/}
                {/*        <div className="text-container" dangerouslySetInnerHTML={{ __html: getContextData()?.brand?.config.customHomePageSource }} />*/}
                {/*    </div>*/}
                {/*    :*/}
                {/*    <>*/}
                {/*        {getContextData()?.brand?.config?.carouselWebConfig &&*/}
                {/*            <CarouselCompo contextData={getContextData()}/>*/}
                {/*        }*/}
                {/*    </>*/}
                {/*}*/}

                {getContextData()?.brand?.config?.starWebProducts &&
                    <Section2 contextData={getContextData()}/>
                }

                <SectionCategories categories={getContextData()?.categories}
                                   contextData={getContextData()}
                                   deals={getContextData()?.deals}
                                   products={getContextData()?.products}/>


                {width <= WIDTH_DISPLAY_MOBILE &&
                    <div>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                p: 0,
                                m: 0,
                            }}
                        >
                            {mobileBox(currentEstablishment() && currentEstablishment().phoneNumber ?
                                currentEstablishment() : contextData?.establishments[0])}
                        </Box>

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
