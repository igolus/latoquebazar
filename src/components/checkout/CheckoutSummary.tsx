import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import { Button, Divider, TextField, Typography } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import {computePriceDetail, formatOrderConsumingMode} from "../../util/displayUtil";
import {CSSProperties} from "@material-ui/styles";
import localStrings from "../../localStrings";
import moment from "moment";
import {ORDER_DELIVERY_MODE_DELIVERY} from "../../util/constants";

export interface CheckoutSummaryProps {
    currency: string
}

const CheckoutSummary:React.FC<CheckoutSummaryProps> = ({currency}) => {

    const {orderInCreation} = useAuth();
    const [priceDetails, setPriceDetails] = useState({});
    const {maxDistanceReached} = useAuth();

    useEffect(() => {
        setPriceDetails(computePriceDetail(orderInCreation()))
    }, [orderInCreation])

    return (
        <Card1>
            <Typography fontWeight="600" mb={1} mt={2}>
                {localStrings.priceDetail}
            </Typography>
            {/*<p>{JSON.stringify(priceDetails)}</p>*/}
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalNoTax}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.totalNoTax).toFixed(2)} {currency}
                    </Typography>
                </FlexBox>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.deliveryFee}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        -
                    </Typography>
                </FlexBox>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="grey.600">{localStrings.totalTax}</Typography>
                <FlexBox alignItems="flex-end">
                    <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                        {parseFloat(priceDetails.total - priceDetails.totalNoTax).toFixed(2)} {currency}
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

            <Divider sx={{ mb: '1rem' }} />

            <Typography
                fontSize="25px"
                fontWeight="600"
                lineHeight="1"
                textAlign="right"
                mb={3}
            >
                {parseFloat(priceDetails.total).toFixed(2)} {currency}
            </Typography>

            {orderInCreation() && orderInCreation().deliveryAddress &&
            orderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
            <>
                <Divider sx={{ mb: '1rem' }} />

                <Typography fontWeight="600" mb={1} mt={2}>
                    {localStrings.deliveryAdress}
                </Typography>

                <Typography color="grey.600" fontSize="16px">
                    {maxDistanceReached ? localStrings.tooFarAddress : orderInCreation().deliveryAddress.adress}
                </Typography>

            </>
            }
            <Divider sx={{ mb: '1rem' }} />
            <Typography fontWeight="600" mb={1} mt={2}>
                {localStrings.deliveryMode}
            </Typography>
            {orderInCreation() && orderInCreation().deliveryMode &&
            <Typography color="grey.600" fontSize="16px">
                {/*{orderInCreation().deliveryMode}*/}
                {formatOrderConsumingMode(orderInCreation(), localStrings)}
            </Typography>

            }

            <Divider sx={{ mb: '1rem' }} />
            <Typography fontWeight="600" mb={1} mt={2}>
                {localStrings.timeSlot}
            </Typography>
            {orderInCreation() && orderInCreation().bookingSlot ?
                <Typography color="grey.600" fontSize="16px">
                    {moment(orderInCreation().bookingSlot.startDate).locale("fr").calendar().split(' ')[0]}
                    {" "}
                    {moment(orderInCreation().bookingSlot.startDate).format("HH:mm")}
                    -
                    {moment(orderInCreation().bookingSlot.endDate).format("HH:mm")}
                    {/*{JSON.stringify(orderInCreation().bookingSlot)}*/}
                </Typography>
                :
                <Typography color="grey.600" fontSize="16px">
                    -
                </Typography>
            }
            {/*<TextField placeholder="Voucher" variant="outlined" size="small" fullWidth />*/}
            {/*<Button*/}
            {/*    variant="outlined"*/}
            {/*    color="primary"*/}
            {/*    fullWidth*/}
            {/*    sx={{ mt: '1rem', mb: '30px' }}*/}
            {/*>*/}
            {/*    Apply Voucher*/}
            {/*</Button>*/}
        </Card1>
    )
}

export default CheckoutSummary
