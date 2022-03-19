import FlexBox from '@component/FlexBox'
import {Span} from '@component/Typography'
import {Avatar, IconButton} from '@material-ui/core'
import React from 'react'
import ProductCard7Style from './ProductCard7Style'
import localStrings from "../../localStrings";
import MdRender from "@component/MdRender";
import {deleteDiscountInCart} from "../../util/cartUtil";
import useAuth from "@hook/useAuth";
import Close from "@material-ui/icons/Close";
import {Box} from "@material-ui/system";

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

const DiscountCard7: React.FC<ProductCard7Props> = ({
                                                      item,

                                                  }) => {

    let imgUrl = "/assets/images/discount.png";
    const {getOrderInCreation, setOrderInCreation} = useAuth();

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
                {item.couponCodeValues && item.couponCodeValues.length == 1 &&
                <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                    {localStrings.formatString(localStrings.codeApplied, item.couponCodeValues[0])}
                </Span>
                }

                {item.description && item.description !== "" &&
                <FlexBox
                    justifyContent="space-between"
                    alignItems="flex-end"
                >
                    <MdRender content={item.description}/>
                </FlexBox>
                }

                <Box position="absolute" right="1rem" top="1rem">
                    <IconButton
                        size="small"
                        sx={{
                            padding: '4px',
                            ml: '12px',
                        }}
                        onClick={() => deleteDiscountInCart(getOrderInCreation, setOrderInCreation, item.id)}
                    >
                        <Close fontSize="small"/>
                    </IconButton>
                </Box>

                {/*<Button*/}
                {/*    variant="outlined"*/}
                {/*    color="primary"*/}
                {/*    // padding="5px"*/}
                {/*    // size="none"*/}
                {/*    // borderColor="primary.light"*/}
                {/*    sx={{p: '5px'}}*/}
                {/*    onClick={() => deleteDiscountInCart(getOrderInCreation(), setOrderInCreation, item.id)}*/}
                {/*>*/}
                {/*    <Add fontSize="small"/>*/}
                {/*</Button>*/}
            </FlexBox>
        </ProductCard7Style>
    )
}

export default DiscountCard7
