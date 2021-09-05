import CheckoutForm from '@component/checkout/CheckoutForm'
import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import {Box, Button, CircularProgress, Grid} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../../src/util/displayUtil";
import ConfirmInfo from "@component/confirm/ConfirmInfo";
import localStrings from "../../src/localStrings";
import ShoppingBag from "@material-ui/icons/ShoppingBag";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import firebase from "../../src/lib/firebase";
import {executeMutationUtil, executeQueryUtil} from "../../src/apolloClient/gqlUtil";
import {addSiteUserMessagingToken} from "../../src/gql/siteUserGql";
import {getOrderByIdQuery} from "../../src/gql/orderGql";
import ClipLoaderComponent from "@component/ClipLoaderComponent";

export interface ConfirmedProps {
    contextData?: any
}

const Id:React.FC<ConfirmedProps> = ({contextData}) => {
    const router = useRouter()
    const {currentBrand, currentEstablishment, dbUser, brand} = useAuth();
    const { id } = router.query;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    //const [token, setToken] = useState(null);

    const registerMessaging = async () => {
        try {
            if (currentBrand()) {
                const messaging = firebase.messaging();
                await messaging.requestPermission();
                const token = await messaging.getToken();
                console.log("token ", token);
                //alert("token" + token);
                //setToken(token);
                await executeMutationUtil(addSiteUserMessagingToken(currentBrand().id, dbUser.id, token));
            }
            // else {
            //     alert("no brand")
            // }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(async () => {
        if (currentBrand() && currentEstablishment()) {
            setLoading(true);
            //alert("id " + id)
            let res = await executeQueryUtil(getOrderByIdQuery(currentBrand().id, currentEstablishment().id, id));
            //alert("res " + JSON.stringify(res))
            setOrder(res?.data?.getOrdersByOrderIdEstablishmentIdAndOrderId);
            setLoading(false);
        }

    }, [currentBrand(), currentEstablishment(), id])

    useEffect(async () => {
        registerMessaging();
    }, [])

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }

        // if("serviceWorker" in navigator) {
        //     //register(window);
        //     window.addEventListener("load", function () {
        //         navigator.serviceWorker.register("/firebase-messaging-sw.old").then(
        //             function (registration) {
        //                 console.log("Service Worker registration successful with scope: ", registration.scope);
        //             },
        //             function (err) {
        //                 console.log("Service Worker registration failed: ", err);
        //             }
        //         );
        //     });
        // }

    }, [])

    function seeMyOrderDetail() {
        router.push("/orders/" + id)
    }

    return (
        <CheckoutNavLayout contextData={contextData}>
            {order && !loading ?
                <>
                    {/*<p>{JSON.stringify(justCreatedOrder)}</p>*/}
                    <DashboardPageHeader
                        title={localStrings.orderCompleted}
                        icon={ShoppingBag}
                        button={
                            order ?
                                <Button color="primary" variant="primary"
                                        onClick={seeMyOrderDetail}>
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
                        </AlertHtmlLocal>
                    </div>

                    <Grid container flexWrap="wrap-reverse" spacing={3}>
                        <Grid item lg={8} md={8} xs={12} mt={2}>
                            <ConfirmInfo contextData={contextData} orderSource={order}/>
                        </Grid>
                        <Grid item lg={4} md={4} xs={12} mt={2}>
                            <OrderAmountSummary
                                modeOrdered
                                currency={getBrandCurrency(contextData.brand)}
                                orderSource={order}/>
                        </Grid>
                    </Grid>
                </>
                :
                <ClipLoaderComponent/>
            }
        </CheckoutNavLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return getStaticPathsUtil()
}

export default Id
