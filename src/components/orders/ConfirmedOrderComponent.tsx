import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import {Button, Grid} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import ConfirmInfo from "@component/confirm/ConfirmInfo";
import ShoppingBag from "@material-ui/icons/ShoppingBag";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import useAuth from "@hook/useAuth";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {executeMutationUtil, executeQueryUtil} from "../../apolloClient/gqlUtil";
import {addSiteUserMessagingToken} from "../../gql/siteUserGql";
import {getOrderByIdQuery} from "../../gql/orderGql";
import localStrings from "../../localStrings";
import {getBrandCurrency} from "../../util/displayUtil";
import {useRouter} from "next/router";
import firebase from "firebase/app";

export interface ConfirmedOrderComponentProps {
    contextData?: any
}

const ConfirmedOrderComponent:React.FC<ConfirmedOrderComponent> = ({contextData}) => {
    const router = useRouter();
    let id;
    let params = {};
    try {
        params = new URLSearchParams(window.location.search)
        id = params?.get("orderId");
        //alert("orderId " + id);
    }
    catch (err) {

    }

    //const router = useRouter();

    function getContextData() {
        return contextData;
    }

    const {currentBrand, currentEstablishment, dbUser} = useAuth();
    //
    // const { id } = router.query;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    //const [token, setToken] = useState(null);

    const registerMessaging = async () => {
        try {
            console.log("registerMessaging ");
            if (currentBrand() && currentBrand().config?.notifPushConfig?.sendPushNotification) {
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
            await registerMessaging();
        }

    }, [currentBrand(), currentEstablishment(), id])

    // useEffect(async () => {
    //     registerMessaging();
    // }, [])

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }

    }, [])

    function seeMyOrderDetail() {
        router.push("/orders/orderDetail?orderId=" + id + "&establishmentId=" + currentEstablishment().id)
    }

    return (
        <>
            {order && !loading ?
                <>
                    {/*<p>{JSON.stringify(order || {})}</p>*/}
                    <DashboardPageHeader
                        title={localStrings.orderCompleted}
                        icon={ShoppingBag}
                        button={
                            order ?
                                <Button color="primary" variant={"contained"}
                                        style={{textTransform: "none"}}
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
                        {currentBrand()?.config?.notifEmailConfig?.sendMailOnlineOrdering &&
                        <AlertHtmlLocal severity="info"
                                        title={localStrings.mailSent}
                                        content={localStrings.formatString(localStrings.mailSentDetail,
                                            order?.customer?.userProfileInfo?.email)}
                        >
                        </AlertHtmlLocal>
                        }
                        <AlertHtmlLocal severity="info"
                                        title={localStrings.activateNotification}
                                        content={localStrings.notificationInfo}
                        >


                        </AlertHtmlLocal>


                    </div>

                    <Grid container flexWrap="wrap-reverse" spacing={3}>
                        <Grid item lg={8} md={8} xs={12} mt={2}>
                            <ConfirmInfo contextData={getContextData()} orderSource={order}/>
                        </Grid>
                        <Grid item lg={4} md={4} xs={12} mt={2}>
                            <OrderAmountSummary
                                hideCoupon={true}
                                contextData={getContextData()}
                                modeOrdered
                                currency={getBrandCurrency(getContextData().brand)}
                                orderSource={order}/>
                        </Grid>
                    </Grid>
                </>
                :
                <ClipLoaderComponent/>
            }
        </>
    )
}

export default ConfirmedOrderComponent
