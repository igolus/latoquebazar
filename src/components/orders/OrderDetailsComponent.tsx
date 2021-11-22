import Delivery from '@component/icons/Delivery'
import PackageBox from '@component/icons/PackageBox'
import TruckFilled from '@component/icons/TruckFilled'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {H2, H5, Paragraph} from '@component/Typography'
import useWindowSize from '@hook/useWindowSize'
import {Button, Card, Grid} from '@material-ui/core'
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import {Box, useTheme} from '@material-ui/system'
import React, {useEffect, useState} from 'react'
import {useRouter} from "next/router";
// import {getOrderByIdQuery, getSiteUserOrderById} from "../../src/gql/orderGql";
// import {executeQueryUtil} from "../../src/apolloClient/gqlUtil";
import useAuth from "@hook/useAuth";
import {
    formatOrderConsumingMode,
    formatOrderDeliveryDateSlot,
    getBrandCurrency,
    getTextStatus
} from "../../util/displayUtil";
import {
    HUBRISE_ORDER_STATUS_ACCEPTED,
    HUBRISE_ORDER_STATUS_AWAITING_COLLECTION,
    HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT,
    HUBRISE_ORDER_STATUS_CANCELLED,
    HUBRISE_ORDER_STATUS_COMPLETED,
    HUBRISE_ORDER_STATUS_DELIVERY_FAILED,
    HUBRISE_ORDER_STATUS_IN_DELIVERY,
    HUBRISE_ORDER_STATUS_IN_PREPARATION,
    HUBRISE_ORDER_STATUS_NEW,
    HUBRISE_ORDER_STATUS_RECEIVED,
    HUBRISE_ORDER_STATUS_REJECTED,
    ORDER_DELIVERY_MODE_DELIVERY,
    ORDER_STATUS_DELIVERING,
    ORDER_STATUS_FINISHED
} from "../../util/constants";
import OrderAmountSummary from "@component/checkout/OrderAmountSummary";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import BazarImage from "@component/BazarImage";
import {isMobile} from "react-device-detect";
import localStrings from "../../localStrings";
import OrderContent from "@component/orders/OrderContent";
import {executeQueryUtil} from "../../apolloClient/gqlUtil";
import {getOrderByIdQuery, getSiteUserOrderById} from "../../gql/orderGql";

// const StyledFlexbox = styled(FlexBox)(({ theme }) => ({
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginTop: '2rem',
//     marginBottom: '2rem',
//     [theme.breakpoints.down('sm')]: {
//         flexDirection: 'column',
//     },
//
//     '& .line': {
//         // flex={width < breakpoint ? 'unset' : '1 1 0'}
//         // height={width < breakpoint ? 50 : 4}
//         // minWidth={width < breakpoint ? 4 : 50}
//         // bgcolor={ind < statusIndex ? 'primary.main' : 'grey.300'}
//         flex: '1 1 0',
//         height: 4,
//         minWidth: 50,
//         [theme.breakpoints.down('sm')]: {
//             flex: 'unset',
//             height: 50,
//             minWidth: 4,
//         },
//     },
// }))
//
// type OrderStatus = 'packaging' | 'shipping' | 'delivering' | 'complete'

export interface OrderDetailsProps {
    contextData?: any
}

const OrderDetailsComponent:React.FC<OrderDetailsProps> = ({contextData}) => {
    //let params = {};
    let id;
    let params = {};
    try {
        params = new URLSearchParams(window.location.search)
        id = params?.get("orderId");
        //alert("orderId " + id);
    }
    catch (err) {

    }


    function getContextData() {
        return contextData;
    }
    // try {
    //     params = new URLSearchParams(window.location.search)
    // }
    // catch(err) {
    //
    // }

    const router = useRouter();

    //alert("orderId " + orderId);
    const [refreshing, setRefreshing] = useState(false);
    const [noStatus, setNoStatus] = useState(false);

    const {currentEstablishment, dbUser} = useAuth()
    const stepIconList = [PackageBox, TruckFilled, Delivery]

    const width = useWindowSize()
    const theme = useTheme()
    const breakpoint = 350
    console.log(theme.breakpoints.up('md'))

    const [order, setOrder] = useState(null)

    useEffect(async() => {
        await refresh();
    }, [getContextData(), currentEstablishment(), dbUser])


    async function refresh() {
        try {
            setRefreshing(true)
            //alert("refresh")
            if (getContextData() && getContextData().brand && currentEstablishment() && id) {
                let result = await executeQueryUtil(getOrderByIdQuery(getContextData().brand.id, currentEstablishment().id, id));
                let orderSet = null;
                if (result && result.data && result.data.getOrdersByOrderIdEstablishmentIdAndOrderId) {
                    //alert( "result.data " + result.data)
                    let order = result.data.getOrdersByOrderIdEstablishmentIdAndOrderId;
                    setOrder(order);
                    orderSet = order;
                    setRefreshing(false)
                }
                else if (dbUser) {
                    let result = await executeQueryUtil(getSiteUserOrderById(getContextData().brand.id, dbUser.id, id));
                    if (result && result.data && result.data.getSiteUserOrderById) {
                        let order = result.data.getSiteUserOrderById;
                        setOrder(order);
                        orderSet = order;
                        setRefreshing(false);
                        setNoStatus(true);
                    }
                }
                if (orderSet == null) {
                    router.push("/404");
                }
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setRefreshing(false)
        }

    }

    function getStepOrder() {
        if (!order) {
            return 0;
        }

        if (ORDER_STATUS_DELIVERING === order.status) {
            return 1;
        }
        if (ORDER_STATUS_FINISHED === order.status) {
            return 2;
        }
        return 0

    }

    function getImageStatus() {

        // export const HUBRISE_ORDER_STATUS_NEW = "new";
        // export const HUBRISE_ORDER_STATUS_RECEIVED = "received";
        // export const HUBRISE_ORDER_STATUS_ACCEPTED = "accepted";
        // export const HUBRISE_ORDER_STATUS_IN_PREPARATION = "in_preparation";
        // export const HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT= "awaiting_shipment";
        // export const HUBRISE_ORDER_STATUS_AWAITING_COLLECTION= "awaiting_collection";
        // export const HUBRISE_ORDER_STATUS_IN_DELIVERY= "in_delivery";
        // export const HUBRISE_ORDER_STATUS_COMPLETED= "completed";
        // export const HUBRISE_ORDER_STATUS_REJECTED= "rejected";
        // export const HUBRISE_ORDER_STATUS_CANCELLED= "cancelled";
        // export const HUBRISE_ORDER_STATUS_DELIVERY_FAILED= "delivery_failed";
        switch (order?.status) {
            case HUBRISE_ORDER_STATUS_NEW:
            case HUBRISE_ORDER_STATUS_RECEIVED:
            case HUBRISE_ORDER_STATUS_ACCEPTED:
                return "/assets/images/IconsDelivery/Get_box.png"
            case HUBRISE_ORDER_STATUS_IN_PREPARATION:
            case HUBRISE_ORDER_STATUS_AWAITING_SHIPMENT:
            case HUBRISE_ORDER_STATUS_AWAITING_COLLECTION:
                return "/assets/images/IconsDelivery/Save_box.png"
            case HUBRISE_ORDER_STATUS_IN_DELIVERY:
                return "/assets/images/IconsDelivery/Delivery_by_scooter.png"
            case HUBRISE_ORDER_STATUS_COMPLETED:
                return "/assets/images/IconsDelivery/Box_received.png"
            case HUBRISE_ORDER_STATUS_REJECTED:
            case HUBRISE_ORDER_STATUS_CANCELLED:
            case HUBRISE_ORDER_STATUS_DELIVERY_FAILED:
                return "/assets/images/IconsDelivery/Support_delivery.png"
        }
        return "/assets/images/IconsDelivery/Get_box.png"
    }

    return (
        <>
            <DashboardPageHeader
                title={localStrings.orderDetail}
                icon={ShoppingBag}
                button={
                    <>
                        {!noStatus &&
                        <Button color="primary" variant="contained" onClick={refresh}>
                            {localStrings.refresh}
                        </Button>
                        }
                    </>
                }
            />

            {!noStatus &&
            <Card sx={{ p: '.2rem .2rem', mb: '0' }}>
                {refreshing ?
                    <ClipLoaderComponent/>
                    :
                    <div style={{width: '100%'}}>
                        {isMobile && !noStatus &&
                        <>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <Box m={5}>
                                    {/*<BazarImage width={120} height={120} src={"/assets/images/IconsDelivery/Get_box.png"}/>*/}
                                    <BazarImage width={120} height={120} src={getImageStatus()}/>
                                </Box>
                            </Box>

                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                <Box mt={7}>
                                    <H2 my="0px" lineHeight="1" whiteSpace="pre">
                                        {localStrings.orderStatus}
                                    </H2>
                                    <H5 mt={0} mb={2} mt={2}>
                                        {getTextStatus(order, localStrings)}
                                    </H5>
                                </Box>
                            </Box>
                        </>
                        }
                        {!isMobile && !noStatus &&
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            <Box m={5} justifyContent={"center"}>
                                {/*<BazarImage width={120} height={120} src={"/assets/images/IconsDelivery/Get_box.png"}/>*/}
                                <BazarImage width={120} height={120} src={getImageStatus()}/>
                            </Box>
                            <Box mt={7}>
                                <H2 my="0px" lineHeight="1" whiteSpace="pre">
                                    {localStrings.orderStatus}
                                </H2>
                                <H5 mt={0} mb={2} mt={2}>
                                    {getTextStatus(order, localStrings)}
                                </H5>
                            </Box>
                        </Box>
                        }

                    </div>
                }
            </Card>
            }

            <OrderContent order={order} contextData={getContextData()}/>


            <Grid container spacing={3}>
                <Grid item lg={6} md={6} xs={12}>
                    <Card sx={{ p: '20px 30px' }}>
                        <H5 mt={0} mb={2}>
                            {localStrings.deliveryMode}
                        </H5>
                        <Paragraph fontSize="14px" my="0px">
                            {/*{JSON.stringify(order || {})}*/}
                            {formatOrderConsumingMode(order, localStrings)}
                        </Paragraph>

                        {order &&
                        order.status !== ORDER_STATUS_FINISHED &&
                        <>
                            <H5 mt={0} mb={2} mt={2}>
                                {order.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY ? localStrings.deliveryHour
                                    : localStrings.pickupHour}
                            </H5>
                            <Paragraph fontSize="14px" my="0px">
                                {formatOrderDeliveryDateSlot(order)}
                            </Paragraph>
                        </>
                        }

                        {order &&
                        order.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                        <>
                            <H5 mt={0} mb={2} mt={2}>
                                {localStrings.deliveryAdress}
                            </H5>
                            <Paragraph fontSize="14px" my="0px">
                                {order?.deliveryAddress?.address}
                            </Paragraph>
                        </>
                        }

                    </Card>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <OrderAmountSummary
                        orderSource={order}
                        modeOrdered
                        currency={getBrandCurrency(getContextData() ? getContextData().brand : null)}
                        hideDetail/>

                </Grid>
            </Grid>
        </>
    )
}

// export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
//     return getStaticPathsUtil()
// }



export default OrderDetailsComponent