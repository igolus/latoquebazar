import Footer from '@component/footer/Footer'
import Header from '@component/header/Header'
import MobileNavigationBar from '@component/mobile-navigation/MobileNavigationBar'
import Sticky from '@component/sticky/Sticky'
import Head from 'next/head'
import React, {Fragment, useCallback, useState} from 'react'
import TopbarForTest from "@component/topbar/TopbarForTest";
import {isMobile} from "react-device-detect";
import {Box, Container} from "@material-ui/core";
import Image from "@component/BazarImage";
import {isBrandInBadStripStatus} from "../../util/displayUtil";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import localStrings from "../../localStrings";

type AppLayoutProps = {
    title?: string
    description?: string
    ogImage?: string
    noIndex?: boolean
    navbar?: React.ReactChild
    contextData: any
}

const config = require('../../conf/config.json')

const AppLayout: React.FC<AppLayoutProps> = ({
                                                 children,
                                                 navbar,
                                                 title ,
                                                 description,
                                                 ogImage,
                                                 noIndex,
                                                 contextData
                                             }) => {
    const [isFixed, setIsFixed] = useState(false)

    const toggleIsFixed = useCallback((fixed) => {
        setIsFixed(fixed)
    }, [])

    const siteDesc = contextData?.brand?.config?.metaWebConfig?.description;
    const siteOgImage = contextData?.brand?.config?.metaWebConfig?.ogImage;
    const siteTitle = contextData?.brand?.config?.metaWebConfig?.title || config.appName;

    function getChildrenOrUnavailable(children) {
        //TODO ADD BACK RESTRICTION
        // if (isBrandInBadStripStatus(contextData?.brand)) {
        //     return (
        //         <Container sx={{ my: '2rem' }}>
        //             <AlertHtmlLocal title={localStrings.siteUnavailable}
        //                             content={localStrings.siteUnavailableDetail}>
        //             </AlertHtmlLocal>
        //         </Container>
        //     )
        // }
        return children;
    }

    return (
        <div style={{zIndex:999}}>
            <Head>
                <title>{title || siteTitle}</title>
                {noIndex &&
                    <meta name="robots" content="noindex"/>
                }

                <meta
                    property="og:title"
                    content={title || siteTitle}
                />
                <meta
                    name="description"
                    content={description || siteDesc}
                />
                <meta
                    property="og:description"
                    content={description || siteDesc}
                />
                {(ogImage || siteOgImage) &&
                <meta
                    property="og:image"
                    content={ogImage || siteOgImage}
                />
                }

                {/*<meta*/}
                {/*    property="og:title"*/}
                {/*    content={contextData.brand?.config?.metaWebConfig?.title}*/}
                {/*/>*/}
                }
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                {contextData?.brand.iconUrl &&
                <link rel="shortcut icon" id="favicon"
                      href={contextData.brand.iconUrl}/>
                }

            </Head>

            {/*{contextData && contextData.brand?.demoSite &&*/}
            {/*    <TopbarForTest/>*/}
            {/*}*/}
    


            <Sticky fixedOn={0} onSticky={toggleIsFixed}>
                <Header isFixed={isFixed} contextData={contextData}/>
            </Sticky>

            {navbar && <div className="section-after-sticky">{navbar}</div>}
            {!navbar ? <div className="section-after-sticky">{getChildrenOrUnavailable(children)}</div> : getChildrenOrUnavailable(children)}

            <MobileNavigationBar />
            <Footer contextData={contextData}/>
        </div>
    )
}

export default AppLayout
