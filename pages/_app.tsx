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

export const cache = createCache({ key: 'css', prepend: true })

//Binding events.
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

nProgress.configure({ showSpinner: false })

const App = ({ Component, pageProps}: any) => {





    const Layout = Component.layout || Fragment

    const router = useRouter()

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
            //alert("useEffect App")
            const handleRouteChange = (url: string) => {
                //alert("handleRouteChange")
                ga.pageview(url)
            }
            //When the component is mounted, subscribe to router changes
            //and log those page views
            router.events.on('routeChangeComplete', handleRouteChange)

            // If the component is unmounted, unsubscribe
            // from the event with the `off` method
            return () => {
                router.events.off('routeChangeComplete', handleRouteChange)
            }
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
                <Head>
                    {/*{contextData?.brand.iconUrl &&*/}
                    {/*<link rel="shortcut icon" id="favicon"*/}
                    {/*      href={contextData.brand.iconUrl || "/favicon"}/>*/}
                    {/*}*/}
                    {/*<script*/}
                    {/*    type="text/javascript"*/}
                    {/*    src={"https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=places"}*/}
                    {/*/>*/}

                    {/*</script>*/}

                    {/*<script  type="text/javascript"*/}

                    {/*         src={"https://maps.googleapis.com/maps/api/js?libraries=places&key=" + key} ></script>*/}
                </Head>

                <link rel="manifest" href="/manifest.json" />
                <link rel="stylesheet" href="https://use.typekit.net/bcq8tyr.css" />
                <link href="https://fonts.googleapis.com/css2?family=Comforter" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Courgette" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Bangers" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Lato" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Charm" rel="stylesheet" />
                Birthstone Bounce
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                      integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                      crossOrigin=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            </Head>
            {/*<AppProvider>*/}


                <ToastProvider placement="bottom-left">
                    <AuthProvider>
                        <MuiTheme>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </MuiTheme>
                    </AuthProvider>
                </ToastProvider>
            {/*</AppProvider>*/}

        </CacheProvider>
        // </div>
    )

}

// export const getStaticProps: GetStaticProps = async (context) => {
//     return await getStaticPropsUtil();
// }

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default App
