if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,c,t)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const i={uri:location.origin+s.slice(1)};return Promise.all(c.map((s=>{switch(s){case"exports":return a;case"module":return i;default:return e(s)}}))).then((e=>{const s=t(...e);return a.default||(a.default=s),a}))})))}}define("./sw.js",["./workbox-ea903bce"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Breakfast%21.jpg",revision:"2d6036db03c4e599a1fb5d92812546ad"},{url:"/_next/static/R5tDOgavLlU38cPj_Y7Z8/_buildManifest.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/R5tDOgavLlU38cPj_Y7Z8/_ssgManifest.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/0e7757d607336647f51f4e893dec64af78fd6b50.e23c52dba2b290a70aa5.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/1120592da878a54c9be8cbc5506bfe65d3560364.e1764844604c747955db.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/1e3e36163bddca039dfe038d5defd0e133808975.6a07e5d734f3b6721064.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/1e70283f6c1254373a22a854bc996d0f4831fd99.ee46c6f62f6bc44c199c.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/2c1a76111ea1d0c0c8381f9d4bbbb6d24fa57595.d3033be67ad8f5eed9dc.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/33ab18e080762809039c2c84cc95f561264683e8.d2f24af107c5ed4b553e.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/36bcf0ca.c04de25a2cd0f2d0dd45.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/3b64bb5dc6ac8e5c02392ce592ca28e29b004a8b.44365a31ba50d01c2dc6.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/436fd1c268bc3e6556741abe5189ebdcbcf0a5c6.d0b0b95864b87ca82218.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/484bcb1e.8e6d046056d960022fc6.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/4ab89f49c88ce30f09dede007066a5e735d867d2.846595aa62a47735bbc2.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/4bbb29d3fb01b9bbafa70f4603eb3ef6c9dc658e.1c9c1871c4bcd3b1c1bd.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/4cb02d8177c2dd7fb731a0dbb7318a09e5711ba4.26b6e0aefc6b054ff455.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/52066749.fa645f6a64d2f9fc3efe.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/60f31d5b85ee79f3adce276212e7f3b946a06596.3d749522d176fd75907a.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/69e7bad5d13dd7c1b5fb69a2f7e44ad6e47b7526.d068cab5e39d6f6367ab.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/75fc9c18.851b46342beeff380cfd.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/839e067b5d1112ef475aecec22767b1af429d9ac.57af2f3dd9608e1350a6.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/9dde5a3349d7cf70bdd51fc5527377a11019821d.d8425f00b797f6687281.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/9fea85ddbef833df21a3e4fee65b701585851c72.d1c624e1cdf030b4d040.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/a9b8f5106be8f5308a2b28d0a6e2ebb3357530f1.db5571756326d25d2001.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/ad426b2082306664a70819466b04fc592f59f633.d0738a19cb5820c4b4a7.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/af8c2fcfa43371f1559eb2eb9c51fcc9c1015093.f7455dee08455e27b42e.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/c07007ff394d62269f766345c839f4dfcf706080.54fcd01575e6c6898a10.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/c29107288c8855d11e0204086886eaf637457d9c.55fb9250232e50218db8.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/cb1608f2.315913597f7143dbe006.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/cce5ef386af08dec9d5b14ff6f1462659a7ffe0e.7520c057a7cfb152b30c.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/df1771598c3c4c01e287ac2a2b551d1487a4340a.6779357bffa62c9e339e.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/f021e74725985009147f49ce8e2b75e0b8cfb612.c008fb349c0cce54a685.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/f669936cc4760a401cada91289849fb2c50fec29.b21c23dfa705149b3c70.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/f8977d8d3fef5e53b0559ac3547a525596e1b1ed.c169ba37a1c0f8cecb9d.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/fa9642afeea249b152ba283d5b23e4cb9d3b39e7.4333f5b05f7141045260.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/fc5c70ed053208c61b2a439a0a2cd97d05217934.b5167e10e3895565376c.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/framework.08c94135ed4101354e2a.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/main-945e6b703bbe18aac871.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/404-5a7c9624eff0438f7814.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/_app-9e13b75a56067e7d1754.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/_error-447e8137eafbdc7ce41d.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/address-74318510bfd9294fb556.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/address/adressDetail-596f4442f9d5e1a07444.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/cart-8a7279ac02923bbbff47.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/checkout-74a53b297e3274128bdc.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/checkout-alternative-a86fd327e043f85abf2a.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/confirmed/confirmedOrder-5d28e6c9000a70ff4102.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/contactInfo-c2d7c9c38850e7e7901e.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/index-9ddfd27b39af509a7c9b.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/landing-2685134dfcc62fd18618.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/login-7a4bd9efa723c3a59464.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/mobile-category-nav-e535cd25f84088e869da.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/orders-6ab091304f344263b0ee.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/orders/orderDetail-b756a6168df4583878f9.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/payment-bae00e84b7fd254b3404.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/payment-methods-3618919b8b71e71f38db.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/payment-methods/%5Bid%5D-eb9cceb551e31e0927fe.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/product/detail/%5Bid%5D-8c4b22ab794aca74747d.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/product/detailDeal/%5Bid%5D-2e074d9cf2fec6c598b7.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/product/search/search-ac79ed717053018624a2.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/product/shop/%5Bcategory%5D-680a5f9829003e5c6682.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/profile-28b1148ef35f63d7f994.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/profile/edit-879e2dd38014af1d7b41.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/sale-080c8e0fab4d8c2a603d.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/sale-page-1-5e31012989b925c016d2.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/sale-page-2-8211964a3a6d664ee3c8.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/sale-page-site-c03faa03f813a10aae67.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/shop/%5Bid%5D-2a39938aa2fb9cfbfba7.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/shops-616e66595a8db0124c42.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/signup-e4188cd40b84f35820d9.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/support-tickets-5777185a1a3e07060717.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/support-tickets/%5Bid%5D-e4aa43dab197780aec9d.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/account-settings-45d8cdf336b24e2fbe9b.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/add-product-c8f6bbb4708390ce0f09.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/dashboard-b722604b5eed1b6621cb.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/orders-22128d7b6e938c0dd422.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/orders/%5Bid%5D-29944a8e5ae90b933378.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/products-6aaf9beedb742dc29e78.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/pages/vendor/products/%5Bid%5D-0c1bc9ad84fba182bf0a.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/polyfills-ccfee3dc3e30b3845b22.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/chunks/webpack-50bee04d1dc61f8adf5b.js",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/css/1cbeb1f69f390a022515.css",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/_next/static/css/79bc13063343a274aa51.css",revision:"R5tDOgavLlU38cPj_Y7Z8"},{url:"/assets/images/Icon Color_13.png",revision:"062de0c5af388603917bff8012ac5ca3"},{url:"/assets/images/Icon_Sandwich.png",revision:"212878b841e45a78b2b1918663334e57"},{url:"/assets/images/Icon_Sandwich_old.png",revision:"879afef62e5b76043aa9a5915774c4c4"},{url:"/assets/images/IconsDelivery/Box_received.png",revision:"19ac2213267a08cbed25fc0fb9d1f781"},{url:"/assets/images/IconsDelivery/Delivery_by_scooter.png",revision:"3eb0537c987ea000c73c7d70c1a14a99"},{url:"/assets/images/IconsDelivery/Get_box.png",revision:"a11341785f7615fd920a385acebb8a22"},{url:"/assets/images/IconsDelivery/Save_box.png",revision:"aec1fc903a5944d3eb9680768a09e489"},{url:"/assets/images/IconsDelivery/Support_delivery.png",revision:"a2504a1af0d263b01162bb2a08c7f9fb"},{url:"/assets/images/White-Widow-Kush-Haze-Cbd-Blueten-Zuerich-Weed-Cannabis-Stongest-staerkste-Online-Best.jpg",revision:"b41e747ebbc18c3d7ee41b50211e5eb9"},{url:"/assets/images/heart-shape-sliced-pepperoni-pizza-on-white-backg.jpg",revision:"582d947031d2600b26096d8d9515975d"},{url:"/assets/images/icons/facebook-filled-white.svg",revision:"b47087f969c98b0ac8cf31484ec77b29"},{url:"/assets/images/icons/four-squares.png",revision:"751f0a11fcaa2374e65a61264f06191b"},{url:"/assets/images/icons/google-1.svg",revision:"2a3fe6aa49dbbbf604b16e2df36cccb4"},{url:"/assets/images/icons/icons8-four-squares-48.png",revision:"2f405cf0009c17e04e800c629e2a695a"},{url:"/assets/images/illustrations/1.svg",revision:"24d8e030d2fe11c7e269dc8a33bcac2f"},{url:"/assets/images/illustrations/2.svg",revision:"a8875fb834324bc651e24e63d61a7818"},{url:"/assets/images/illustrations/404.svg",revision:"af87c6bc6b0b56671463fbb81ed363ea"},{url:"/assets/images/illustrations/announcement.svg",revision:"fc20d133a0b15f513722faa2b3d2a2e5"},{url:"/assets/images/illustrations/baby.svg",revision:"528c6a2ffaa2e375baba70d5d06fc16d"},{url:"/assets/images/illustrations/business_deal.svg",revision:"0a6326db5146ecc315f01dbeeed8daa8"},{url:"/assets/images/illustrations/designer.svg",revision:"2ea3b5f8b7e340cdd381e3d3451da2cf"},{url:"/assets/images/illustrations/dreamer.svg",revision:"1427b7a9a61a041e3b5ba6ff0ad042f6"},{url:"/assets/images/illustrations/lighthouse.svg",revision:"d43cc830d674e5063b85b9180a41d145"},{url:"/assets/images/illustrations/mobile-message.svg",revision:"8d5176017138d96e77b9106d4b94cbd8"},{url:"/assets/images/illustrations/posting_photo.svg",revision:"ee01a6cb037d21147a5deae47db0c094"},{url:"/assets/images/illustrations/upgrade.svg",revision:"ed9c54d4d88bb5dc336da398471de619"},{url:"/assets/images/logo.svg",revision:"f2bd797f067e8bff440124978ff1d811"},{url:"/assets/images/logos/shopping-bag.svg",revision:"8390ef9027b92bf01bc1e75f054379a7"},{url:"/favicon.ico",revision:"ad34900331aff401ee074f3ad4047c7c"},{url:"/firebase-messaging-sw.js",revision:"ead4499e9ca3fcbcf75af307c1098448"},{url:"/icon.png",revision:"caea59e51842b774339c30e18ac210a3"},{url:"/iconApp.png",revision:"31c60ca39f0b8987049a3e10014e1c0c"},{url:"/iconResto.png",revision:"3b9e89f87835d44ecf97f00394cfe715"},{url:"/laToqueLogo.png",revision:"aba22dcbdcf67b0789c6c4a63d16f658"},{url:"/manifest-template.json",revision:"c0bea81e4141a50edea010ff5a448533"},{url:"/manifest.json",revision:"8a212ebe0aaef5263f9a1914e2cd8d05"},{url:"/registerServiceWorker.js",revision:"fb80441a904264b76e8e8ad4515ec52b"},{url:"/sw.naz",revision:"5f97fc88fe61b92796d4197229641aa1"},{url:"/sw.old",revision:"5f97fc88fe61b92796d4197229641aa1"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:mp3|mp4)$/i,new e.StaleWhileRevalidate({cacheName:"static-media-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600,purgeOnQuotaError:!0})]}),"GET")}));
