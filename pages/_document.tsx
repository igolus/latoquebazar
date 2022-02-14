import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { ServerStyleSheets } from '@material-ui/styles'
import theme from '@theme/theme'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";

const getCache = () => {
    const cache = createCache({ key: 'css', prepend: true })
    cache.compat = true
    return cache
}

const conf=require('../src/conf/config.json')

export default class Bazar extends Document {
    render() {
        return (
            <Html lang="fr">
                <Head>
                    <link rel="manifest" href="/manifest.json" />

                    <script
                        src="/hotjar.js">
                    </script>
                    {/*<script*/}
                    {/*    src="https://api.systempay.fr/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"*/}
                    {/*    kr-public-key="73239078:testpublickey_Zr3fXIKKx0mLY9YNBQEan42ano2QsdrLuyb2W54QWmUJQ"*/}
                    {/*    >*/}
                    {/*</script>*/}

                    <link rel="stylesheet"
                          href="/css/classic-reset.css"/>
                    <script
                        src="https://api.systempay.fr/static/js/krypton-client/V4.0/ext/classic.js">
                    </script>

                    {/*<link href="/fonts/fonts.css" rel="stylesheet"/>*/}
                    <link rel="apple-touch-icon" href="/iconApp.png"></link>
                    <meta name="theme-color" content="#fff" />
                    {/* PWA primary color */}
                    <meta name="theme-color" content={theme.palette.primary.main} />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;900&display=swap"
                        rel="stylesheet"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    />

                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
                        }}
                    />
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
Bazar.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    const cache = getCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            // Take precedence over the CacheProvider in our custom _app.js
            enhanceComponent: (Component) => (props) =>
                (
                    <CacheProvider value={cache}>
                        <Component {...props} />
                    </CacheProvider>
                ),
        })

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement(),
            ...emotionStyleTags,
        ],
    }
}

