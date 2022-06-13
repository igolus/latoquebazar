import FlexBox from '@component/FlexBox'
import {Span, Tiny2} from '@component/Typography'
import {Avatar} from '@material-ui/core'
import React from 'react'
import ProductCard7Style from './ProductCard7Style'
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
    let imgUrl = "/assets/images/Icon_Color_13.png";
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
                {/*{itemHaveRestriction(item) ? "true": "false"}*/}
                {/*{!itemHaveRestriction(item) &&*/}
                <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                    {" " + parseFloat(item.price).toFixed(2) + " " + currency}
                </Span>
                {/*}*/}


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
