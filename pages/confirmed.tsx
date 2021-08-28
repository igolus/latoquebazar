import CheckoutForm from '@component/checkout/CheckoutForm'
import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import {Box, Button, CircularProgress, Grid} from '@material-ui/core'
import React, {useEffect} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";
import ConfirmInfo from "../src/components/confirm/ConfirmInfo";
import localStrings from "../src/localStrings";
import ShoppingBag from "@material-ui/icons/ShoppingBag";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import firebase from "../src/lib/firebase";
import {executeMutationUtil} from "../src/apolloClient/gqlUtil";
import {addSiteUserMessagingToken} from "../src/gql/siteUserGql";

export interface ConfirmedProps {
    contextData?: any
}

const Confirmed:React.FC<ConfirmedProps> = ({contextData}) => {
    const router = useRouter()
    const {justCreatedOrder, currentBrand, brand, dbUser} = useAuth();

    const registerMessaging = async () => {
        try {
            if (brand) {
                const messaging = firebase.messaging();
                await messaging.requestPermission();
                const token = await messaging.getToken();
                console.log("token ", token);
                alert("token" + token);
                await executeMutationUtil(addSiteUserMessagingToken(brand.id, dbUser.id, token));
            }
            else {
                alert("no brand")
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    // useEffect(async () => {
    //     registerMessaging();
    // }, [])

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }

        if("serviceWorker" in navigator) {
            //register(window);
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/firebase-messaging-sw.old").then(
                    function (registration) {
                        console.log("Service Worker registration successful with scope: ", registration.scope);
                    },
                    function (err) {
                        console.log("Service Worker registration failed: ", err);
                    }
                );

                // navigator.serviceWorker.register("/registerServiceWorker.js").then(
                //     function (registration) {
                //         console.log("Service Worker registration successful with scope: ", registration.scope);
                //     },
                //     function (err) {
                //         console.log("Service Worker registration failed: ", err);
                //     }
                // );
            });
        }

    }, [])

    function seeMyOrderDetail() {
        router.push("/orders/" + justCreatedOrder.id)
    }

    return (
        <CheckoutNavLayout contextData={contextData}>
            <DashboardPageHeader
                title={localStrings.orderCompleted}
                icon={ShoppingBag}
                button={
                    justCreatedOrder ?
                    <Button color="primary" sx={{ bgcolor: 'primary.light', px: '2rem' }} onClick={seeMyOrderDetail}>
                        {localStrings.seeMyOrderDetail}
                    </Button> :
                        <></>
                }
            />

            <div style={{marginBottom: "2"}}>
                <AlertHtmlLocal severity="info"
                                title={localStrings.orderCompleted}
                                content={localStrings.formatString(localStrings.orderCompletedThanks,
                                    currentBrand() ? currentBrand().brandName : "")}
                />

                <AlertHtmlLocal severity="info"
                                title={localStrings.activateNotification}
                                content={localStrings.notificationInfo}
                >
                    <Box display="flex" flexDirection="row-reverse">
                        <Box mt={2} mb={2}>
                            <Button variant="contained" color="primary" type="button" fullWidth
                                    onClick={registerMessaging}>
                                {localStrings.activateNotification}
                            </Button>
                        </Box>
                    </Box>
                </AlertHtmlLocal>
            </div>

            <Grid container flexWrap="wrap-reverse" spacing={3}>
                <Grid item lg={8} md={8} xs={12} mt={2}>
                    <ConfirmInfo contextData={contextData}/>
                </Grid>
                <Grid item lg={4} md={4} xs={12} mt={2}>
                    <OrderAmountSummary
                        modeOrdered
                        currency={getBrandCurrency(contextData.brand)}
                        orderSource={justCreatedOrder}/>
                </Grid>
            </Grid>
        </CheckoutNavLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default Confirmed
