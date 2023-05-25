import {AuthProvider} from 'contexts/FirebaseAuthContext';
import createCache from '@emotion/cache'
import {CacheProvider} from '@emotion/react'
import MuiTheme from '@theme/MuiTheme'
import Head from 'next/head'
import Router, {useRouter} from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React, {Fragment, useEffect} from 'react'
import {ToastProvider} from "react-toast-notifications";
import * as ga from '../lib/ga'
import "../global.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {Dialog, DialogContent} from "@material-ui/core";
import SelectEsta from "@component/SelectEsta";

export const cache = createCache({ key: 'css', prepend: true })

//Binding events.
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

nProgress.configure({ showSpinner: false })

const App = ({ Component, pageProps, contextData}: any) => {
    const Layout = Component.layout || Fragment
    //const [brandConfig, setBrandConfig] = useState(null);
    // const [analyticsGoogleId, setAnalyticsGoogleId] = useState(null);
    // const [facebookPixelId, setFacebookPixelId] = useState(null);

    const router = useRouter()

    useEffect(() => {
        const analyticsGoogleId = pageProps?.contextData?.brand?.config?.analyticsGoogleId
        if (analyticsGoogleId && process.env.NODE_ENV === 'production') {
            const handleRouteChange = (url: string) => {
                //alert("handleRouteChange")
                ga.pageview(url, analyticsGoogleId)
            }
            router.events.on('routeChangeComplete', handleRouteChange)

            // If the component is unmounted, unsubscribe
            // from the event with the `off` method
            return () => {
                router.events.off('routeChangeComplete', handleRouteChange)
            }
        }
    })

    useEffect(() => {
        if (pageProps?.contextData?.brand?.config?.facebookPixelId) {
            const facebookPixelId = pageProps?.contextData?.brand?.config?.facebookPixelId;
            console.log("facebookPixelId " + facebookPixelId)
            import('react-facebook-pixel')
                .then((x) => x.default)
                .then((ReactPixel) => {
                    ReactPixel.init(facebookPixelId) // facebookPixelId
                    ReactPixel.pageView()
                    router.events.on('routeChangeComplete', () => {
                        ReactPixel.pageView()
                    })
                })
            return null;
        }

    }, [router.events])

    useEffect(async () => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }
    }, [])

    return (
        // <div>
        <CacheProvider value={cache}>
            <Head>
                {pageProps?.contextData?.brand?.config?.analyticsGoogleId &&
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${pageProps?.contextData?.brand?.config?.analyticsGoogleId}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${pageProps?.contextData?.brand?.config?.analyticsGoogleId}', {
                                      page_path: window.location.pathname,
                                    });
                                  `,
                            }}
                        />
                    </>
                }

                <link rel="manifest" href="/manifest.json" />
                <link rel="stylesheet" href="https://use.typekit.net/bcq8tyr.css" />
                <link href="https://fonts.googleapis.com/css2?family=Comforter" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Courgette" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Bangers" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Lato" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Charm" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            </Head>

            <ToastProvider placement="bottom-left">
                <MuiTheme>
                    <AuthProvider contextData={contextData}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </AuthProvider>
                </MuiTheme>
            </ToastProvider>

        </CacheProvider>
    )

}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


export default App
