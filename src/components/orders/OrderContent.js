import React from 'react';
import TableRow from "../TableRow";
import FlexBox from "../FlexBox";
import {Card, Typography} from "@material-ui/core";
import localStrings from "../../localStrings";
import moment from "moment";
import {Box} from "@material-ui/system";
import {getCartItems} from "../../util/cartUtil";
import {getBrandCurrency} from "../../util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";
import DealCard7 from "../product-cards/DealCard7";
import ProductCard7 from "../product-cards/ProductCard7";

function OrderContent({ order, contextData, modeConfirmed }) {

    const language = contextData?.brand?.config?.language || 'fr';
    return (
        <>
            <Card sx={{ p: '0px', mb: '30px' }}>
                <TableRow
                    sx={{
                        bgcolor: 'grey.200',
                        p: '12px',
                        boxShadow: 'none',
                        borderRadius: 0,
                    }}
                >
                    {order &&
                    <>
                        <FlexBox className="pre" m={0.75} alignItems="center">
                            <Typography fontSize="14px" color="grey.600" mr={0.5}>
                                {localStrings.orderNumber}
                            </Typography>
                            <Typography fontSize="14px">{order.orderNumber}</Typography>
                        </FlexBox>

                        <FlexBox className="pre" m={0.75} alignItems="center">
                            <Typography fontSize="14px" color="grey.600" mr={0.5}>
                                {localStrings.orderId}
                            </Typography>
                            <Typography fontSize="14px">{order.id}</Typography>
                        </FlexBox>
                        {!modeConfirmed &&
                        <FlexBox className="pre" m={0.75} alignItems="center">
                            <Typography fontSize="14px" color="grey.600" mr={0.5}>
                                {localStrings.orderDate}
                            </Typography>
                            <Typography fontSize="14px">
                                {moment(parseFloat(order.creationDate)).locale(language).calendar()}
                            </Typography>
                        </FlexBox>
                        }
                    </>
                    }

                </TableRow>

                <Box py={1}>
                    {getCartItems(() => order).map((item) => {

                        let currency = contextData ? getBrandCurrency(contextData.brand) : "";
                        //<p>{JSON.stringify(item)}</p>
                        if (item.type === TYPE_DEAL) {
                            return(<DealCard7 key={item.id}
                                              deal={item}
                                              contextData={contextData}
                                              modeOrder
                                              currency={currency}
                                              products={contextData ? contextData.products : []}/>)
                        }
                        else if (item.type === TYPE_PRODUCT) {
                            return(<ProductCard7 key={item.id}
                                                 item={item}
                                                 modeOrder
                                                 currency={currency}
                                                 contextData={contextData}
                                                 products={contextData ? contextData.products : []}/>)
                        }
                    })}

                </Box>
            </Card>
        </>
    )
}

export default OrderContent
