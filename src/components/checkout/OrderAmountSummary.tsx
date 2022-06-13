import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import {Alert, Box, Button, Divider, Typography} from '@material-ui/core'
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
import {ORDER_DELIVERY_MODE_DELIVERY, TOP_STICKY} from "../../util/constants";
import {Tiny2} from "@component/Typography";
import ReactMarkdown from "react-markdown";
import CouponCode from "@component/checkout/CouponCode";
import 'moment/locale/fr'
import {success} from "@theme/themeColors";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import MdRender from "@component/MdRender";

const config = require("../../conf/config.json");

const fontSize = "14px";
const fontWeight = "400";

moment.locale('fr')

export interface OrderAmountSummaryProps {
    currency: string
    hideDetail: boolean
    hideCoupon: boolean
    modeOrdered: boolean
    orderSource: any
    contextData: any
}

const OrderAmountSummary:React.FC<OrderAmountSummaryProps> = ({currency, hideDetail,
                                                                  modeOrdered,orderSource, contextData, hideCoupon}) => {

    const {getOrderInCreation, currentBrand, currentEstablishment, setEstanavOpen, dbUser} = useAuth();
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

    return (
        <Card1 style={{position: 'sticky', top: TOP_STICKY}}>
            {/*{JSON.stringify(getOrder())}*/}
            {modeOrdered &&
                <Typography fontWeight={fontWeight} mb={0} mt={.5}>

                    {getRemainingToPay(getOrder()) === 0 ?
                        localStrings.pricePaid
                        :
                        localStrings.formatString(localStrings.remainingToPay,
                            getRemainingToPay(getOrder()).toFixed(2) + getBrandCurrency(currentBrand()))
                    }
                </Typography>
            }

            {(getOrder()?.charges || []).map((chargeItem, key) =>
                <>
                    <FlexBox key={key} justifyContent="space-between" alignItems="center" mb={0}>
                        <Typography color="grey.600">{chargeItem.name}</Typography>
                        <FlexBox alignItems="flex-end">
                            <Typography fontSize={fontSize} fontWeight={fontWeight} lineHeight="1">
                                {chargeItem.price.toFixed(2)} {currency}
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
                        {parseFloat(priceDetails.totalNoCharge - priceDetails.totalNoTax).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>


            {priceDetails.totalNonDiscounted !== priceDetails.total &&
                <FlexBox justifyContent="space-between" alignItems="center" mb={0}>
                    {/*<Typography color="grey.600">{getDiscountText()}</Typography>*/}
                    <Typography color="grey.600">{getDiscountText()}</Typography>

                    <FlexBox alignItems="flex-end">
                        <Typography fontSize={fontSize} fontWeight={fontWeight} lineHeight="1" color={"green"}>
                            -{parseFloat(priceDetails.totalNonDiscounted - priceDetails.total).toFixed(2)} {currency}
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
                            {parseFloat(priceDetails.totalNonDiscounted).toFixed(2)} {currency + " "}
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
                        {parseFloat(priceDetails.total).toFixed(2)} {currency}
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

                    {getOrder() && getOrder().deliveryAddress &&
                        getOrder().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                        <>
                            <Divider sx={{mb: 0}}/>

                            <Typography fontWeight={fontWeight} mb={0} mt={.25}>
                                {localStrings.deliveryAdress}
                            </Typography>

                            <Typography color="grey.600" fontSize={fontSize}>
                                {maxDistanceReached ? localStrings.tooFarAddress : getOrder().deliveryAddress.address}
                            </Typography>

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
                                    {moment.unix(getOrder().bookingSlot.startDate).locale("fr").calendar().split(' ')[0]}
                                    {" "}
                                    {moment.unix(getOrder().bookingSlot.startDate).format("HH:mm")}
                                    -
                                    {moment.unix(getOrder().bookingSlot.endDate).format("HH:mm")}
                                </Typography>
                                :
                                <Typography color="grey.600" fontSize={fontSize}>
                                    {getOrder().bookingSlot.startDate.locale("fr").calendar().split(' ')[0]}
                                    {" "}
                                    {getOrder().bookingSlot.startDate.format("HH:mm")}
                                    -
                                    {getOrder().bookingSlot.endDate.format("HH:mm")}
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

                    {contextData.establishments && contextData.establishments.length > 1 &&
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
