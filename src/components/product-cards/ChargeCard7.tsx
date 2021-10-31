import Image from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import {Span, Tiny2} from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import {Avatar, Button, IconButton} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import { Box } from '@material-ui/system'
import Link from 'next/link'
import React, { useCallback } from 'react'
import ProductCard7Style from './ProductCard7Style'
import useAuth from "@hook/useAuth";
import {decreaseCartQte, deleteItemInCart, getPriceWithOptions, increaseCartQte} from '../../util/cartUtil'
import {formatProductAndSkuName, getImgUrlFromProductsWithExtRef} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import {itemHaveRestriction, itemRestrictionMax} from "@component/mini-cart/MiniCart";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import ReactMarkdown from "react-markdown";

export interface ProductCard7Props {
    id: string | number
    name: string
    qty: number
    price: number
    products: any
    item: any,
    currency: string
    modeOrder: boolean
}

const ChargeCard7: React.FC<ProductCard7Props> = ({
                                                      item,
                                                      currency,

                                                  }) => {

    //const {getOrderInCreation, setOrderInCreation} = useAuth();
    //let product = products.find(p => p.id === item.productId);
    let imgUrl = "/assets/images/Icon Color_13.png";
    //alert("product " + product)
    // if (!product) {
    //   //try to find with extRef in skus
    //   product = products.find(p => p.skus && p.skus.some(sku => sku.extRef === item.extRef));
    // }
    //alert("product " + product)
    // if (product && product.files && product.files.length > 0) {
    //   imgUrl = product.files[0].url;
    // }


    // if (!imgUrl) {
    //   imgUrl = imgUrl;
    // }

    return (
        <ProductCard7Style>
            <Avatar
                src={imgUrl}
                sx={{height: 80, width: 80, mt: 1, ml: 2, mb: 1}}
            />
            <FlexBox
                className="product-details"
                flexDirection="column"
                justifyContent="space-between"
                minWidth="0px"
                width="100%"
            >
                {/*<Link href={"/product/detail/" + product.id}>*/}
                <Span className="title" fontWeight="600" fontSize="18px" mb={1} >
                    {item.name}
                </Span>
                {!itemHaveRestriction(item) &&
                <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                    {" " + parseFloat(item.price).toFixed(2) + " " + currency}
                </Span>
                }


                {item.restrictionsList && item.restrictionsList.length === 1 &&
                <FlexBox
                    justifyContent="space-between"
                    alignItems="flex-end"
                >
                    <Tiny2 color="grey.600">
                        <ReactMarkdown>{item.restrictionsList[0].description}</ReactMarkdown>
                    </Tiny2>
                </FlexBox>
                }

            </FlexBox>
        </ProductCard7Style>
    )
}

export default ChargeCard7
