import FlexBox from '@component/FlexBox'
import Delivery from '@component/icons/Delivery'
import PackageBox from '@component/icons/PackageBox'
import TruckFilled from '@component/icons/TruckFilled'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import {H5, H6, Paragraph, Span} from '@component/Typography'
import productDatabase from '@data/product-database'
import useWindowSize from '@hook/useWindowSize'
import { Avatar, Button, Card, Divider, Grid, Typography } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import Done from '@material-ui/icons/Done'
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import { Box, useTheme } from '@material-ui/system'
import { format } from 'date-fns'
import React, {Fragment, useEffect, useState} from 'react'
import {getStaticPathsUtil, getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {GetStaticPaths, GetStaticProps} from "next";
import {useRouter} from "next/router";
import {getOrderByIdQuery, getSiteUserOrderById} from "../../src/gql/orderGql";
import {executeQueryUtil} from "../../src/apolloClient/gqlUtil";
import useAuth from "@hook/useAuth";
import {
    formatOrderConsumingMode, formatOrderDeliveryDateSlot,
    formatProductAndSkuName, getBrandCurrency,
    getImgUrlFromProducts,
    getImgUrlFromProductsWithExtRef, getOrderBookingSlotEndDate, getOrderBookingSlotStartDate
} from "../../src/util/displayUtil";
import {getCartItems} from "../../src/util/cartUtil";
import {
    ORDER_DELIVERY_MODE_DELIVERY, ORDER_STATUS_DELIVERING, ORDER_STATUS_FINISHED,
    ORDER_STATUS_NEW,
    ORDER_STATUS_PREPARATION, ORDER_STATUS_READY,
    TYPE_DEAL,
    TYPE_PRODUCT
} from "../../src/util/constants";
import DealCard7 from "@component/product-cards/DealCard7";
import ProductCard7 from "@component/product-cards/ProductCard7";
import localStrings from "../../src/localStrings";
import OrderAmountSummary from "@component/checkout/OrderAmountSummary";
import OrderContent from '../../src/components/orders/OrderContent';
import moment from "moment";
import ClipLoaderComponent from "@component/ClipLoaderComponent";

const StyledFlexbox = styled(FlexBox)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '2rem',
    marginBottom: '2rem',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },

    '& .line': {
        // flex={width < breakpoint ? 'unset' : '1 1 0'}
        // height={width < breakpoint ? 50 : 4}
        // minWidth={width < breakpoint ? 4 : 50}
        // bgcolor={ind < statusIndex ? 'primary.main' : 'grey.300'}
        flex: '1 1 0',
        height: 4,
        minWidth: 50,
        [theme.breakpoints.down('sm')]: {
            flex: 'unset',
            height: 50,
            minWidth: 4,
        },
    },
}))

type OrderStatus = 'packaging' | 'shipping' | 'delivering' | 'complete'

export interface OrderDetailsProps {
    contextData?: any
}

const OrderDetails:React.FC<OrderDetailsProps> = ({contextData}) => {
    const router = useRouter();
    const { id } = router.query
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
    }, [contextData, currentEstablishment(), dbUser])

    useEffect(() => {
            if (!dbUser) {
                //alert("push user")
                router.push("/")
            }
        },
        [dbUser]
    )

    async function refresh() {
        try {
            setRefreshing(true)
            //alert("refresh")
            if (contextData && contextData.brand && dbUser) {
                let result = await executeQueryUtil(getOrderByIdQuery(contextData.brand.id, currentEstablishment().id, id));
                if (result && result.data && result.data.getOrdersByOrderIdEstablishmentIdAndOrderId) {
                    //alert( "result.data " + result.data)
                    let order = result.data.getOrdersByOrderIdEstablishmentIdAndOrderId;
                    setOrder(order);
                    setRefreshing(false)
                }
                else {
                    let result = await executeQueryUtil(getSiteUserOrderById(contextData.brand.id, dbUser.id, id));
                    if (result && result.data && result.data.getSiteUserOrderById) {
                        let order = result.data.getSiteUserOrderById;
                        setOrder(order);
                        setRefreshing(false);
                        setNoStatus(true);
                    }
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
        // if ([ORDER_STATUS_NEW, ORDER_STATUS_PREPARATION, ORDER_STATUS_READY].includes(order.status)) {
        //     return 0;
        // }
        if (ORDER_STATUS_DELIVERING === order.status) {
            return 1;
        }
        if (ORDER_STATUS_FINISHED === order.status) {
            return 2;
        }
        return 0

    }

    return (
        <DashboardLayout contextData={contextData}>
            <DashboardPageHeader
                title={localStrings.orderDetail}
                icon={ShoppingBag}
                button={
                    <Button color="primary" variant="contained" onClick={refresh}>
                        {localStrings.refresh}
                    </Button>
                }
            />

            {/*<p>{order && order.status}</p>*/}
            {/*<p>{JSON.stringify(order || {})}</p>*/}
            {/*<p>{JSON.stringify(contextData ? contextData.products : {})}</p>*/}

            {!noStatus &&
            <Card sx={{ p: '2rem 1.5rem', mb: '30px' }}>
                {refreshing ?
                    <ClipLoaderComponent/>
                    :
                    <StyledFlexbox>
                        {stepIconList.map((Icon, ind) => (
                            <Fragment key={ind}>
                                <Box position="relative">
                                    <Avatar
                                        sx={{
                                            height: 64,
                                            width: 64,
                                            // bgcolor: false ? 'primary.main' : 'grey.300',
                                            // color: false ? 'grey.white' : 'primary.main',
                                            bgcolor: ind <= getStepOrder() ? 'primary.main' : 'grey.300',
                                            color: ind <=  getStepOrder() ? 'grey.white' : 'primary.main',
                                        }}
                                    >
                                        <Icon color="inherit" sx={{ fontSize: '32px' }} />
                                    </Avatar>
                                    {ind <= getStepOrder() && (
                                        <Box position="absolute" right="0" top="0">
                                            <Avatar
                                                sx={{
                                                    height: 22,
                                                    width: 22,
                                                    bgcolor: 'grey.200',
                                                    color: 'success.main',
                                                }}
                                            >
                                                <Done color="inherit" sx={{ fontSize: '1rem' }} />
                                            </Avatar>
                                        </Box>
                                    )
                                    }
                                </Box>
                                {ind < stepIconList.length - 1 && (
                                    <Box
                                        className="line"
                                        bgcolor={ind < getStepOrder() ? 'primary.main' : 'grey.300'}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </StyledFlexbox>
                }

                <FlexBox justifyContent={width < breakpoint ? 'center' : 'flex-end'}>
                    <Typography
                        p="0.5rem 1rem"
                        borderRadius="300px"
                        bgcolor="primary.light"
                        color="primary.main"
                        textAlign="center"
                    >
                        {localStrings.formatString(localStrings.deliveryEstimateDate, formatOrderDeliveryDateSlot(order))}
                    </Typography>
                </FlexBox>
            </Card>
            }
            <OrderContent order={order} contextData={contextData}/>
            {/*<Card sx={{ p: '0px', mb: '20px'}}>*/}
            {/*    <TableRow*/}
            {/*        sx={{*/}
            {/*            bgcolor: 'grey.200',*/}
            {/*            p: '12px',*/}
            {/*            boxShadow: 'none',*/}
            {/*            borderRadius: 0,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {order &&*/}
            {/*        <>*/}
            {/*            <FlexBox className="pre" m={0.75} alignItems="center">*/}
            {/*                <Typography fontSize="14px" color="grey.600" mr={0.5}>*/}
            {/*                    {localStrings.orderNumber}*/}
            {/*                </Typography>*/}
            {/*                <Typography fontSize="14px">{order.orderNumber}</Typography>*/}
            {/*            </FlexBox>*/}

            {/*            <FlexBox className="pre" m={0.75} alignItems="center">*/}
            {/*                <Typography fontSize="14px" color="grey.600" mr={0.5}>*/}
            {/*                    {localStrings.orderId}*/}
            {/*                </Typography>*/}
            {/*                <Typography fontSize="14px">{order.id}</Typography>*/}
            {/*            </FlexBox>*/}
            {/*            <FlexBox className="pre" m={0.75} alignItems="center">*/}
            {/*                <Typography fontSize="14px" color="grey.600" mr={0.5}>*/}
            {/*                    {localStrings.orderDate}*/}
            {/*                </Typography>*/}
            {/*                <Typography fontSize="14px">*/}
            {/*                    {moment(parseFloat(order.creationDate)).locale("fr").calendar()}*/}
            {/*                </Typography>*/}
            {/*            </FlexBox>*/}
            {/*        </>*/}
            {/*        }*/}

            {/*    </TableRow>*/}

            {/*    <Box py={1}>*/}
            {/*        {getCartItems(() => order).map((item) => {*/}

            {/*            let currency = getBrandCurrency(contextData.brand)*/}
            {/*            //<p>{JSON.stringify(item)}</p>*/}
            {/*            if (item.type === TYPE_DEAL) {*/}
            {/*                return(<DealCard7 key={item.id}*/}
            {/*                                  deal={item}*/}
            {/*                                  modeOrder*/}
            {/*                                  currency={currency}*/}
            {/*                                  products={contextData ? contextData.products : []}/>)*/}
            {/*            }*/}
            {/*            else if (item.type === TYPE_PRODUCT) {*/}
            {/*                return(<ProductCard7 key={item.id}*/}
            {/*                                     item={item}*/}
            {/*                                     modeOrder*/}
            {/*                                     currency={currency}*/}
            {/*                                     products={contextData ? contextData.products : []}/>)*/}
            {/*            }*/}
            {/*        })}*/}


            {/*        /!*{order && order.order && order.order.items && order.order.items.map(item => (*!/*/}
            {/*        /!*    //{productDatabase.slice(179, 182).map((item) => (*!/*/}
            {/*        /!*    <>*!/*/}
            {/*        /!*      <FlexBox px={2} py={1} flexWrap="wrap" alignItems="center" key={item.id}>*!/*/}
            {/*        /!*        /!*<p>{JSON.stringify(item)}</p>*!/*!/*/}
            {/*        /!*        /!*<p>{getImgUrlFromProductsWithExtRef(item, contextData ? contextData.products : null)}</p>*!/*!/*/}
            {/*        /!*        <FlexBox flex="2 2 260px" m={0.75} alignItems="center">*!/*/}
            {/*        /!*          <Avatar src={getImgUrlFromProductsWithExtRef(item, contextData ? contextData.products : null)} sx={{ height: 64, width: 64 }} />*!/*/}
            {/*        /!*          <Box ml={2.5}>*!/*/}
            {/*        /!*            <H6 my="0px">{item.title}</H6>*!/*/}



            {/*        /!*            <Typography fontSize="14px" color="grey.600">*!/*/}
            {/*        /!*              {parseFloat(item.price).toFixed(2) + " " + getBrandCurrency(contextData.brand) + " x " + item.quantity}*!/*/}
            {/*        /!*            </Typography>*!/*/}

            {/*        /!*            {*!/*/}
            {/*        /!*              item.options && item.options.map((option, key) =>*!/*/}
            {/*        /!*                  // <FlexBox flexWrap="wrap" alignItems="left">*!/*/}
            {/*        /!*                  <FlexBox alignItems="left">*!/*/}
            {/*        /!*                    <Typography color="grey.600" fontSize="14px"  mr={1}>*!/*/}
            {/*        /!*                      {option.name}*!/*/}
            {/*        /!*                    </Typography>*!/*/}
            {/*        /!*                    <Typography color="grey.600" fontSize="14px"  mr={1}>*!/*/}
            {/*        /!*                      {option.price +  " " + getBrandCurrency(contextData.brand)} x {item.quantity}*!/*/}
            {/*        /!*                    </Typography>*!/*/}
            {/*        /!*                    <Typography fontWeight={600} color="primary.main" fontSize="14px" mr={2}>*!/*/}
            {/*        /!*                      {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + getBrandCurrency(contextData.brand)}*!/*/}
            {/*        /!*                    </Typography>*!/*/}
            {/*        /!*                  </FlexBox>)*!/*/}
            {/*        /!*            }*!/*/}
            {/*        /!*          </Box>*!/*/}
            {/*        /!*        </FlexBox>*!/*/}
            {/*        /!*        <FlexBox flex="1 1 260px" m={0.75} alignItems="center">*!/*/}
            {/*        /!*          <Typography fontSize="14px" color="grey.600">*!/*/}
            {/*        /!*            {formatProductAndSkuName(item)}*!/*/}
            {/*        /!*          </Typography>*!/*/}


            {/*        /!*        </FlexBox>*!/*/}


            {/*        /!*        /!*<FlexBox flex="160px" m={0.75} alignItems="center">*!/*!/*/}
            {/*        /!*        /!*  <Button variant="text" color="primary">*!/*!/*/}
            {/*        /!*        /!*    <Typography fontSize="14px">Write a Review</Typography>*!/*!/*/}
            {/*        /!*        /!*  </Button>*!/*!/*/}
            {/*        /!*        /!*</FlexBox>*!/*!/*/}
            {/*        /!*      </FlexBox>*!/*/}

            {/*        /!*      /!*{*!/*!/*/}
            {/*        /!*      /!*  item.options && item.options.map((option, key) =>*!/*!/*/}
            {/*        /!*      /!*      // <h1>{option.name}</h1>*!/*!/*/}
            {/*        /!*      /!*      <FlexBox flexWrap="wrap" alignItems="center">*!/*!/*/}
            {/*        /!*      /!*        <Span color="grey.600" fontSize="14px"  mr={1}>*!/*!/*/}
            {/*        /!*      /!*          {option.name}*!/*!/*/}
            {/*        /!*      /!*        </Span>*!/*!/*/}
            {/*        /!*      /!*        <Span color="grey.600" fontSize="14px"  mr={1}>*!/*!/*/}
            {/*        /!*      /!*          {option.price +  " " + getBrandCurrency(contextData.brand)} x {item.quantity}*!/*!/*/}
            {/*        /!*      /!*        </Span>*!/*!/*/}
            {/*        /!*      /!*        <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>*!/*!/*/}
            {/*        /!*      /!*          {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + getBrandCurrency(contextData.brand)}*!/*!/*/}
            {/*        /!*      /!*        </Span>*!/*!/*/}
            {/*        /!*      /!*      </FlexBox>*!/*!/*/}
            {/*        /!*      /!*  )*!/*!/*/}
            {/*        /!*      /!*}*!/*!/*/}
            {/*        /!*    </>*!/*/}


            {/*        /!*))}*!/*/}
            {/*    </Box>*/}
            {/*</Card>*/}

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

                        {order && order.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                        order.status !== ORDER_STATUS_FINISHED &&
                        <>
                            <H5 mt={0} mb={2} mt={2}>
                                {localStrings.deliveryHour}
                            </H5>
                            <Paragraph fontSize="14px" my="0px">
                                {formatOrderDeliveryDateSlot(order)}
                            </Paragraph>
                        </>
                        }

                    </Card>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>


                    <OrderAmountSummary
                        orderSource={order}
                        modeOrdered
                        currency={getBrandCurrency(contextData ? contextData.brand : null)}
                        hideDetail/>
                    {/*<Card sx={{ p: '20px 30px' }}>*/}
                    {/*  <H5 mt={0} mb={2}>*/}
                    {/*    Total Summary*/}
                    {/*  </H5>*/}
                    {/*  <FlexBox justifyContent="space-between" alignItems="center" mb={1}>*/}
                    {/*    <Typography fontSize="14px" color="grey.600">*/}
                    {/*      Subtotal:*/}
                    {/*    </Typography>*/}
                    {/*    <H6 my="0px">$335</H6>*/}
                    {/*  </FlexBox>*/}
                    {/*  <FlexBox justifyContent="space-between" alignItems="center" mb={1}>*/}
                    {/*    <Typography fontSize="14px" color="grey.600">*/}
                    {/*      Shipping fee:*/}
                    {/*    </Typography>*/}
                    {/*    <H6 my="0px">$10</H6>*/}
                    {/*  </FlexBox>*/}
                    {/*  <FlexBox justifyContent="space-between" alignItems="center" mb={1}>*/}
                    {/*    <Typography fontSize="14px" color="grey.600">*/}
                    {/*      Discount:*/}
                    {/*    </Typography>*/}
                    {/*    <H6 my="0px">-$30</H6>*/}
                    {/*  </FlexBox>*/}

                    {/*  <Divider sx={{ mb: '0.5rem' }} />*/}

                    {/*  <FlexBox justifyContent="space-between" alignItems="center" mb={2}>*/}
                    {/*    <H6 my="0px">Total</H6>*/}
                    {/*    <H6 my="0px">$315</H6>*/}
                    {/*  </FlexBox>*/}
                    {/*  <Typography fontSize="14px">Paid by Credit/Debit Card</Typography>*/}
                    {/*</Card>*/}
                </Grid>
            </Grid>
        </DashboardLayout>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return getStaticPathsUtil()
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


export default OrderDetails
