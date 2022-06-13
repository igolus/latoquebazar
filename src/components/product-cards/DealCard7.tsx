import Image from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import {Span, Tiny2} from '@component/Typography'
import {Avatar, Button, IconButton, Tooltip} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import {Box} from '@material-ui/system'
import React from 'react'
import ProductCard7Style from './ProductCard7Style'
import useAuth from "@hook/useAuth";
import {decreaseDealCartQte, deleteDealInCart, getPriceWithOptions, increaseDealCartQte} from '../../util/cartUtil'
import {formatProductAndSkuName, getPriceDeal} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import {itemHaveRestriction, itemRestrictionMax} from "@component/mini-cart/MiniCart";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import Link from "next/link";
import EditIcon from "@material-ui/icons/Edit";

export interface DealCard7Props {
    id: string | number
    name: string
    qty: number
    price: number
    products: any
    deal: any,
    currency: string
    modeOrder: boolean
}

const DealCard7: React.FC<DealCard7Props> = ({
                                                 id,
                                                 name,
                                                 qty,
                                                 price,
                                                 products,
                                                 deal,
                                                 currency,
                                                 modeOrder
                                             }) => {

    const item = deal.deal;
    const {getOrderInCreation, setOrderInCreation, setGlobalDialog, currentBrand} = useAuth();
    let imgUrl = "/assets/images/Icon_Sandwich.png";
    if (deal.productAndSkusLines && deal.productAndSkusLines.length === 1) {
        const singleProductLine = deal.productAndSkusLines[0];
        let singleProduct = products.find(p => p.id === singleProductLine?.productId)
        if (singleProduct) {
            imgUrl = singleProduct.files[0].url;
        }
    }

    else if (item && item.files && item.files.length > 0) {
        imgUrl = item.files[0].url;
    }
    else if (imgUrl) {
        imgUrl = imgUrl;
    }

    function getPricingValueDeal(key) {
        if (deal.deal.lines[key].pricingValueAfterDisc != null) {
            return deal.deal.lines[key].pricingValueAfterDisc;
        }
        return parseFloat(
            deal.deal.lines[key].pricingValue)
    }

    return (
        <ProductCard7Style>
            {/*<p>{JSON.stringify(deal)}</p>*/}
            {modeOrder ?
                <Link href={"/product/detailDeal/" + deal.id}>
                    <a>
                        <Avatar
                            src={imgUrl}
                            sx={{height: 80, width: 80, mt: 1, ml: 2, mb: 1}}
                        />
                    </a>
                </Link>
                :
                <Link href={"/product/detailDealUpdate?uuid=" + deal.uuid}>
                    <a>
                        <Image
                            src={imgUrl}
                            height={140}
                            width={140}
                            display="block"
                            alt={name}
                        />
                    </a>
                </Link>
            }
            <FlexBox
                className="product-details"
                flexDirection="column"
                justifyContent="space-between"
                minWidth="0px"
                width="100%"
            >
                <>
                    {deal.deal.dealNotSelectable ?
                        <Span className="title" fontWeight="600" fontSize="18px" mb={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                            {item.name}
                        </Span>
                        :
                        <Link href={"/product/detailDealUpdate?uuid=" + deal.uuid}>
                            <a>
                                <Span className="title" fontWeight="600" fontSize="18px" mb={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                                    {item.name}
                                </Span>
                            </a>
                        </Link>
                    }

                    {!itemHaveRestriction(item) &&
                        <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                            {" " + getPriceDeal(item).toFixed(2) + " " + currency}
                        </Span>
                    }
                </>
                {/*{JSON.stringify(deal)}*/}
                {
                    deal.productAndSkusLines && deal.productAndSkusLines.map((productAndSkusLine, key) =>
                        // <h1>{option.name}</h1>
                        <>
                            <FlexBox flexWrap="wrap" alignItems="center">
                                {deal.deal.dealNotSelectable ?
                                    <Span color="grey.600" fontSize="14px"  mr={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                                        {formatProductAndSkuName(productAndSkusLine)}
                                    </Span>
                                    :
                                    <Link href={"/product/detailDealUpdate?uuid=" + deal.uuid}>
                                        <a>
                                            <Span color="grey.600" fontSize="14px"  mr={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                                                {formatProductAndSkuName(productAndSkusLine)}
                                            </Span>
                                        </a>
                                    </Link>
                                }

                                {!itemHaveRestriction(item) &&
                                    <>
                                        <Span color="grey.600" fontSize="14px" mr={1}>
                                            {getPricingValueDeal(key).toFixed(2) + " " + currency} x {deal.quantity}
                                        </Span>
                                        <Span color="grey.600" fontSize="14px" color="primary.main" mr={2}>
                                            {(getPricingValueDeal(key) * deal.quantity).toFixed(2) + " " + currency}
                                        </Span>
                                    </>
                                }
                            </FlexBox>

                            {
                                !itemHaveRestriction(item) && productAndSkusLine.options && productAndSkusLine.options.map((option, key) =>
                                        // <h1>{option.name}</h1>
                                        <FlexBox flexWrap="wrap" alignItems="center">
                                            <Span color="grey.700" fontSize="12px"  mr={1}>
                                                {option.name}
                                            </Span>
                                            <Span color="grey.700" fontSize="12px"  mr={1}>
                                                {option.price +  " " + currency} x {deal.quantity}
                                            </Span>
                                            <Span fontWeight={600} color="primary.main" fontSize="12px" mr={2}>
                                                {(parseFloat(option.price) * deal.quantity).toFixed(2) + " " + currency}
                                            </Span>
                                        </FlexBox>

                                    //   <Span key={key} className="title" fontWeight="200" fontSize="14px" mb={1}>
                                    //   {option.name} {}
                                    // </Span>

                                )
                            }

                        </>
                    )}
                {!modeOrder &&
                    <Box position="absolute" right="1rem" top="1rem">
                        <IconButton
                            size="small"
                            sx={{
                                padding: '4px',
                                ml: '12px',
                            }}
                            onClick={() => deleteDealInCart(setGlobalDialog, getOrderInCreation, setOrderInCreation, deal.uuid)}
                        >
                            <Close fontSize="small"/>
                        </IconButton>
                    </Box>
                }

                <FlexBox
                    justifyContent="space-between"
                    alignItems="flex-end"
                >
                    {!itemHaveRestriction(item) &&
                        <FlexBox flexWrap="wrap" alignItems="center">
                            <Span color="grey.600" mr={1}>
                                {getPriceWithOptions(deal).toFixed(2) + " " + currency} x {deal.quantity}
                            </Span>
                            <Span fontWeight={600} color="primary.main" mr={2}>
                                {" " + localStrings.total + ": " + (getPriceWithOptions(deal) * deal.quantity).toFixed(2) + " " + currency}
                            </Span>
                        </FlexBox>
                    }

                    {(itemHaveRestriction(item) || itemRestrictionMax(item)) &&
                        <AlertHtmlLocal title={localStrings.productRestricted}>
                            <ul>
                                {item.restrictionsApplied.map((restriction, key) => {
                                    return (
                                        <li>
                                            <Tiny2 color="grey.600" key={key}>
                                                {restriction.local || restriction.type}
                                            </Tiny2>
                                        </li>
                                    )
                                })}
                            </ul>
                        </AlertHtmlLocal>
                    }
                    {/*<p>{JSON.stringify(deal)}</p>*/}
                    {!modeOrder &&
                        <FlexBox alignItems="center">
                            {/*{item.options && item.options.length > 0 &&*/}

                            {!deal.deal.dealNotSelectable &&
                                <Tooltip title={localStrings.editProductMenu}>
                                    <Link href={"/product/detailDealUpdate?uuid=" + deal.uuid}>
                                        <a>
                                            <Button
                                                sx={{p: '5px', mr: '5px'}}
                                                variant="outlined"
                                                color="primary"
                                            >
                                                <EditIcon fontSize="small"/>
                                            </Button>
                                        </a>
                                    </Link>
                                </Tooltip>

                            }


                            {/*}*/}


                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={item.quantity === 0}
                                // padding="5px"
                                // size="none"
                                // borderColor="primary.light"
                                //disabled={item.quantity === 0}
                                sx={{p: '5px'}}
                                onClick={() => decreaseDealCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation, deal.uuid)}
                            >
                                <Remove fontSize="small"/>
                            </Button>

                            <Span mx={1} fontWeight="600" fontSize="15px">
                                {deal.quantity}
                            </Span>

                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={itemHaveRestriction(item) || itemRestrictionMax(item)}
                                // padding="5px"
                                // size="none"
                                // borderColor="primary.light"
                                sx={{p: '5px'}}
                                onClick={() => increaseDealCartQte(setGlobalDialog,getOrderInCreation(),
                                    setOrderInCreation, deal.uuid, currentBrand())}
                            >
                                <Add fontSize="small"/>
                            </Button>

                        </FlexBox>
                    }
                </FlexBox>
            </FlexBox>
        </ProductCard7Style>
    )
}

export default DealCard7
