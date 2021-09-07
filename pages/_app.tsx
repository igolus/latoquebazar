import { AppProvider } from '@context/app/AppContext'
import { AuthProvider } from 'contexts/FirebaseAuthContext';
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import MuiTheme from '@theme/MuiTheme'
import Head from 'next/head'
import Router from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React, { Fragment, useEffect } from 'react'
import {ToastProvider} from "react-toast-notifications";
import firebase from "../src/lib/firebase";
export const cache = createCache({ key: 'css', prepend: true })

//Binding events.
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

nProgress.configure({ showSpinner: false })

const App = ({ Component, pageProps }: any) => {

    const Layout = Component.layout || Fragment

    useEffect(async () => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }

    //     if("serviceWorker" in navigator) {
    //         //register(window);
    //         window.addEventListener("load", function () {
    //             // navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
    //             //     function (registration) {
    //             //         console.log("Service Worker registration successful with scope: ", registration.scope);
    //             //     },
    //             //     function (err) {
    //             //         console.log("Service Worker registration failed: ", err);
    //             //     }
    //             // );
    //
    //             // navigator.serviceWorker.register("/registerServiceWorker.js").then(
    //             //     function (registration) {
    //             //         console.log("Service Worker registration successful with scope: ", registration.scope);
    //             //     },
    //             //     function (err) {
    //             //         console.log("Service Worker registration failed: ", err);
    //             //     }
    //             // );
    //         });
    //
    //         // useEffect(async () => {
    //              try {
    //                 const messaging = firebase.messaging();
    //                 await messaging.requestPermission();
    //                 const token = await messaging.getToken();
    //                 console.log("token ", token);
    //                 alert("token " + token);
    //
    //                 // messaging.onBackgroundMessage((payload) => {
    //                 //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
    //                 //   // Customize notification here
    //                 //   const notificationTitle = 'Background Message Title';
    //                 //   const notificationOptions = {
    //                 //     body: 'Background Message body.',
    //                 //     //icon: '/firebase-logo.png'
    //                 //   };
    //                 //
    //                 //   // self.registration.showNotification(notificationTitle,
    //                 //   //     notificationOptions);
    //                 // });
    //
    //
    //                 //navigator.serviceWorker.addEventListener("message", (message) => console.log("----- MESSAGE " + message));
    //
    //             }
    //             catch (err) {
    //                 console.log(err);
    //             }
    //
    //         //}, []);
    //     }
    //
    }, [])

    return (
        // <div>
            <CacheProvider value={cache}>
            <Head>
                <link rel="manifest" href="/manifest.json" />
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
