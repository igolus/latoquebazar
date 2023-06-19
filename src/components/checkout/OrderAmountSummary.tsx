import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import {Alert, Button, CircularProgress, Divider, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import {
    computePriceDetail,
    firstOrCurrentEstablishment,
    formatOrderConsumingMode,
    getBrandCurrency,
    getRemainingToPay
} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import moment from "moment";
import {ORDER_DELIVERY_MODE_DELIVERY, ORDER_STATUS_PENDING_PAYMENT, TOP_STICKY} from "../../util/constants";
import {Tiny2} from "@component/Typography";
import ReactMarkdown from "react-markdown";
import CouponCode from "@component/checkout/CouponCode";
import 'moment/locale/fr'
import {getMessagDeliveryAddress} from "@component/checkout/CheckoutForm";
import {formatPriceLocal} from "@component/products/ProductIntro";

const config = require("../../conf/config.json");

const fontSize = "14px";
const fontWeight = "400";

export interface OrderAmountSummaryProps {
    currency: string
    hideDetail: boolean
    hideCoupon: boolean
    modeOrdered: boolean
    orderSource: any
    contextData: any
    loading: boolean
}

export function getHourFormat(language) {
    if (language === 'en') {
        return 'hh:mm A'
    }

    return "HH:mm";
}

const OrderAmountSummary:React.FC<OrderAmountSummaryProps> = ({currency, hideDetail,
                                                                  modeOrdered,orderSource, contextData, hideCoupon, loading}) => {

    // console.log("contextData " + JSON.stringify(contextData));
    const language = contextData?.brand?.config?.language || 'fr';
    const {getOrderInCreation, currentBrand, currentEstablishment,
        setEstanavOpen, dbUser, stuartError, stuartAmount, zoneMap} = useAuth();
    const [priceDetails, setPriceDetails] = useState({});
    const {maxDistanceReached} = useAuth();

    function getEsta() {
        return firstOrCurrentEstablishment(currentEstablishment, contextData)
    }

    const getOrder = () => {
        return orderSource || getOrderInCreation();
    }

    useEffect(() => {
        setPriceDetails(computePriceDetail(getOrder()))
    }, [getOrderInCreation, orderSource])

    function getDiscountText() {
        if (getOrder()?.discounts && getOrder()?.discounts.length > 0) {
            //alert(JSON.stringify(getOrder()?.discounts[0]))
            if (getOrder()?.discounts[0].couponCodeValues) {
                return localStrings.formatString(localStrings.couponCode, getOrder()?.discounts[0].couponCodeValues[0])
            } else if (getOrder()?.discounts[0].loyaltyPointCost) {
                return localStrings.formatString(localStrings.pointsSave, getOrder()?.discounts[0].loyaltyPointCost)
            }
        }
        return "";
    }

    function formatPointsEarned() {
        if (getOrder()?.discounts && getOrder()?.discounts.length > 0 && getOrder()?.discounts[0].loyaltyPointCost) {
            return localStrings.formatString(localStrings.pendingPointsGain, 0);
        } else {
            let conversion = currentBrand().config?.loyaltyConfig.loyaltyConversionEarn;
            let totalPriceNoCharge = priceDetails.totalNoCharge;
            let newPoints = Math.floor(totalPriceNoCharge * conversion)
            return localStrings.formatString(localStrings.pendingPointsGain, newPoints);
        }
    }

    function getDeliveryAdressMessage() {
        return getOrderInCreation()?.deliveryAddress?.address || "-";
    }

    function getAmountRemainingMessage() {
        if (getOrder()?.status === ORDER_STATUS_PENDING_PAYMENT) {
            return  localStrings.pendingPayment
        }
        if (getRemainingToPay(getOrder()) === 0) {
            return  localStrings.pricePaid;
        }
        return localStrings.formatString(localStrings.remainingToPay,
            formatPriceLocal(
                getRemainingToPay(getOrder()).toFixed(2),
                getBrandCurrency(currentBrand()),
                language));
    }

    return (
        <Card1 style={{position: 'sticky', top: TOP_STICKY}}>
            {/*{JSON.stringify(getOrder())}*/}
            {modeOrdered &&
                <Typography fontWeight={fontWeight} mb={0} mt={.5}>
                    {getAmountRemainingMessage()}
                </Typography>
            }

            {(getOrder()?.charges || []).map((chargeItem, key) =>
                <>
                    <FlexBox key={key} justifyContent="space-between" alignItems="center" mb={0}>
                        <Typography color="grey.600">{chargeItem.name}</Typography>
                        <FlexBox alignItems="flex-end">
                            <Typography fontSize={fontSize} fontWeight={fontWeight} lineHeight="1">
                                {chargeItem?.price?.toFixed(2)} {currency}
                            </Typography>
                        </FlexBox>
                    </FlexBox>
                    {chargeItem.restrictionsList && chargeItem.restrictionsList.length === 1 &&
                        <FlexBox key={key} justifyContent="space-between" alignItems="center" mb={0}>
                            <Tiny2 color="grey.600">
                                <ReactMarkdown>{chargeItem.restrictionsList[0].description}</ReactMarkdown>
                            </Tiny2>
                        </FlexBox>
                    }
                </>
            )}
            <FlexBox justifyContent="space-between" alignItems="center" mb={0}>
                <Typography color="grey.600">{localStrings.totalTax}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize={fontSize} fontWeight={fontWeight} lineHeight="1">
                        {formatPriceLocal((priceDetails.totalNoCharge - priceDetails.totalNoTax).toFixed(2), currency, language)}
                        {/*{parseFloat(priceDetails.totalNoCharge - priceDetails.totalNoTax).toFixed(2)} {currency}*/}
                    </Typography>
                </FlexBox>
            </FlexBox>


            {priceDetails.totalNonDiscounted !== priceDetails.total &&
                <FlexBox justifyContent="space-between" alignItems="center" mb={0}>
                    {/*<Typography color="grey.600">{getDiscountText()}</Typography>*/}
                    <Typography color="grey.600">{getDiscountText()}</Typography>

                    <FlexBox alignItems="flex-end">
                        <Typography fontSize={fontSize} fontWeight={fontWeight} lineHeight="1" color={"green"}>
                            {/*-{parseFloat(priceDetails.totalNonDiscounted - priceDetails.total).toFixed(2)} {currency}*/}
                            -{formatPriceLocal(parseFloat(priceDetails.totalNonDiscounted - priceDetails.total).toFixed(2), currency, language)}
                        </Typography>
                    </FlexBox>
                </FlexBox>
            }
            <FlexBox justifyContent="space-between" alignItems="center" mb={0} mt={0}>
                <Typography color="grey.600">{localStrings.totalTTC}</Typography>
                <FlexBox alignItems="flex-end">

                    {priceDetails.totalNonDiscounted !== priceDetails.total &&
                        <Typography
                            fontSize="22px"
                            fontWeight="400"
                            lineHeight="1"
                            textAlign="right"
                            mb={0}
                            mr={1}
                            style={{textDecoration: 'line-through'}}
                        >
                            {formatPriceLocal(parseFloat(priceDetails.totalNonDiscounted).toFixed(2), currency, language)}
                            {/*{parseFloat(priceDetails.totalNonDiscounted).toFixed(2)} {currency + " "}*/}
                        </Typography>
                    }

                    <Typography
                        fontSize="22px"
                        fontWeight={"600"}
                        //color={success[900]}
                        lineHeight="1"
                        textAlign="right"
                        mb={0}
                    >
                        {formatPriceLocal(parseFloat(priceDetails.total).toFixed(2), currency, language)}
                        {/*{parseFloat(priceDetails.total).toFixed(2)} {currency}*/}
                    </Typography>

                </FlexBox>
            </FlexBox>
            {currentBrand()?.config?.loyaltyConfig && dbUser &&

                <>
                    <Alert severity="success" sx={{marginBottom:1}}>{formatPointsEarned()}</Alert>
                </>
            }
            {!hideDetail &&
                <>

                    {getOrder()  &&
                        getOrder().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                        <>
                            <Divider sx={{mb: 0}}/>
                            <Typography fontWeight={fontWeight} mb={0} mt={.25}>
                                {localStrings.deliveryAdress}
                            </Typography>
                            {loading ?
                                <CircularProgress size={30}/>
                                :
                                <Typography color="grey.600" fontSize={fontSize}>
                                    {getDeliveryAdressMessage()}
                                </Typography>
                            }
                        </>
                    }
                    {/*<Divider sx={{mb: '1rem'}}/>*/}
                    <Typography fontWeight={fontWeight} mb={0} mt={.25}>
                        {localStrings.deliveryMode}
                    </Typography>
                    {getOrder() && getOrder().deliveryMode &&
                        <Typography color="grey.600" fontSize={fontSize}>
                            {/*{orderInCreation().deliveryMode}*/}
                            {formatOrderConsumingMode(getOrder(), localStrings)}
                        </Typography>

                    }
                    <Typography fontWeight={fontWeight} mb={0} mt={.5}>
                        {localStrings.timeSlot}
                    </Typography>

                    {getOrder() && getOrder().bookingSlot ?
                        <>
                            {modeOrdered ?
                                <Typography color="grey.600" fontSize={fontSize}>
                                    {moment.unix(getOrder().bookingSlot.startDate).locale(language).calendar().split(' ')[0]}
                                    {" "}
                                    {moment.unix(getOrder().bookingSlot.startDate).format(getHourFormat())}
                                    -
                                    {moment.unix(getOrder().bookingSlot.endDate).format(getHourFormat())}
                                </Typography>
                                :
                                <Typography color="grey.600" fontSize={fontSize}>
                                    {getOrder().bookingSlot.startDate.locale(language).calendar().split(' ')[0]}
                                    {" "}
                                    {getOrder().bookingSlot.startDate.format(getHourFormat(language))}
                                    -
                                    {getOrder().bookingSlot.endDate.format(getHourFormat(language))}
                                    {/*{JSON.stringify(getOrder().bookingSlot)}*/}
                                </Typography>
                                // <p>{JSON.stringify(getOrder().bookingSlot)}</p>
                            }
                        </>
                        :
                        <Typography color="grey.600" fontSize={fontSize}>
                            -
                        </Typography>
                    }

                    <Divider sx={{mb: '1rem'}}/>
                    <Typography fontWeight={fontWeight} mb={0} mt={0}>
                        {localStrings.selectedEsta}
                    </Typography>

                    <Typography color="grey.600" fontSize={fontSize}>
                        {/*{orderInCreation().deliveryMode}*/}
                        {getEsta().establishmentName}
                    </Typography>

                    <Typography color="grey.600" fontSize={fontSize}>
                        {/*{orderInCreation().deliveryMode}*/}
                        {getEsta().address}
                    </Typography>

                    {!modeOrdered && contextData.establishments && contextData.establishments.length > 1 &&
                        <Button variant="contained" color="primary" type="button" fullWidth
                                onClick={() => setEstanavOpen(true)}
                                style={{marginTop: "5px"}}
                        >
                            {localStrings.changeEsta}
                        </Button>
                    }
                </>
            }

            {/*<Divider/>*/}
            {!hideCoupon &&
                <CouponCode contextData={contextData}/>
            }
        </Card1>
    )
};

export default OrderAmountSummary
