import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import { Button, Divider, TextField, Typography } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import {
    computePriceDetail,
    formatOrderConsumingMode,
    getBrandCurrency,
    getRemainingToPay
} from "../../util/displayUtil";
import {CSSProperties} from "@material-ui/styles";
import localStrings from "../../localStrings";
import moment from "moment";
import {ORDER_DELIVERY_MODE_DELIVERY} from "../../util/constants";
import {Tiny2} from "@component/Typography";
import ReactMarkdown from "react-markdown";

export interface OrderAmountSummaryProps {
    currency: string
    hideDetail: boolean
    modeOrdered: boolean
    orderSource: any
}

const OrderAmountSummary:React.FC<OrderAmountSummaryProps> = ({currency, hideDetail,
                                                                  modeOrdered,orderSource}) => {

    const {getOrderInCreation, currentBrand} = useAuth();
    const [priceDetails, setPriceDetails] = useState({});
    const {maxDistanceReached} = useAuth();

    const getOrder = () => {
        return orderSource || getOrderInCreation();
    }

    useEffect(() => {
        setPriceDetails(computePriceDetail(getOrder()))
    }, [getOrderInCreation, orderSource])

    return (
        <Card1>
            {/*{JSON.stringify(orderSource || getOrderInCreation())}*/}
            <Typography fontWeight="600" mb={1} mt={2}>
                {modeOrdered ?

                    (getRemainingToPay(getOrder()) === 0 ?
                            localStrings.pricePaid
                            :
                            localStrings.formatString(localStrings.remainingToPay,
                                getRemainingToPay(getOrder()).toFixed(2) + getBrandCurrency(currentBrand()))
                    )
                    :
                    localStrings.priceToPay}
            </Typography>

            {(getOrder()?.charges || []).map((chargeItem, key) =>
                <>
                    <FlexBox key={key} justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography color="grey.600">{chargeItem.name}</Typography>
                        <FlexBox alignItems="flex-end">
                            <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                                {chargeItem.price.toFixed(2)} {currency}
                            </Typography>
                        </FlexBox>


                        {/*<Tiny2 color="grey.600" key={key}>*/}
                        {/*    {JSON.stringify(chargeItem)}*/}
                        {/*</Tiny2>*/}
                    </FlexBox>
                    {chargeItem.restrictionsList && chargeItem.restrictionsList.length === 1 &&
                    <FlexBox key={key} justifyContent="space-between" alignItems="center" mb={1}>
                        <Tiny2 color="grey.600">
                            <ReactMarkdown>{chargeItem.restrictionsList[0].description}</ReactMarkdown>
                        </Tiny2>
                    </FlexBox>
                    }
                </>
            )}

            {/*<p>{JSON.stringify(priceDetails)}</p>*/}
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalCharge}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.totalCharge).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>



            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalNoTax}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.totalNoTax).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalFee}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.totalCharge).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalTax}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.totalNoCharge - priceDetails.totalNoTax).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>
            {/*<FlexBox justifyContent="space-between" alignItems="center" mb={2}>*/}
            {/*    <Typography color="grey.600">Discount:</Typography>*/}
            {/*    <FlexBox alignItems="flex-end">*/}
            {/*        <Typography fontSize="18px" fontWeight="600" lineHeight="1">*/}
            {/*            -*/}
            {/*        </Typography>*/}
            {/*    </FlexBox>*/}
            {/*</FlexBox>*/}


            <Divider sx={{mb: '1rem'}}/>

            <Typography
                fontSize="25px"
                fontWeight="600"
                lineHeight="1"
                textAlign="right"
                mb={3}
            >
                {parseFloat(priceDetails.total).toFixed(2)} {currency}
            </Typography>

            {!hideDetail &&
            <>

                {getOrder() && getOrder().deliveryAddress &&
                getOrder().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                <>
                    <Divider sx={{mb: '1rem'}}/>

                    <Typography fontWeight="600" mb={1} mt={2}>
                        {localStrings.deliveryAdress}
                    </Typography>

                    <Typography color="grey.600" fontSize="16px">
                        {maxDistanceReached ? localStrings.tooFarAddress : getOrder().deliveryAddress.address}
                    </Typography>

                </>
                }
                <Divider sx={{mb: '1rem'}}/>
                <Typography fontWeight="600" mb={1} mt={2}>
                    {localStrings.deliveryMode}
                </Typography>
                {getOrder() && getOrder().deliveryMode &&
                <Typography color="grey.600" fontSize="16px">
                    {/*{orderInCreation().deliveryMode}*/}
                    {formatOrderConsumingMode(getOrder(), localStrings)}
                </Typography>

                }

                <Divider sx={{mb: '1rem'}}/>
                <Typography fontWeight="600" mb={1} mt={2}>
                    {localStrings.timeSlot}
                </Typography>
                {getOrder() && getOrder().bookingSlot ?
                    <>
                        {modeOrdered ?
                            <Typography color="grey.600" fontSize="16px">
                                {moment.unix(getOrder().bookingSlot.startDate).locale("fr").calendar().split(' ')[0]}
                                {" "}
                                {moment.unix(getOrder().bookingSlot.startDate).format("HH:mm")}
                                -
                                {moment.unix(getOrder().bookingSlot.endDate).format("HH:mm")}
                            </Typography>
                            :
                            <Typography color="grey.600" fontSize="16px">
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
                    <Typography color="grey.600" fontSize="16px">
                        -
                    </Typography>
                }

            </>
            }
        </Card1>
    )
};

export default OrderAmountSummary