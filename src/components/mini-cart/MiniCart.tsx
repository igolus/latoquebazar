import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import BazarIconButton from '@component/BazarIconButton'
import FlexBox from '@component/FlexBox'
import ShoppingBagOutlined from '@component/icons/ShoppingBagOutlined'
import LazyImage from '@component/LazyImage'
import {H5, H6, Tiny, Tiny2} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Dialog, DialogContent, Divider, IconButton} from '@material-ui/core'
import {useTheme} from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import Link from 'next/link'
import React, {useCallback, useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {
    decreaseCartQte,
    decreaseDealCartQte,
    deleteDealInCart,
    deleteDiscountInCart,
    deleteItemInCart,
    getCartItems,
    getItemNumberInCart,
    getPriceWithOptions,
    increaseCartQte,
    increaseDealCartQte,
    RESTRICTION_MAX_ITEM
} from "../../util/cartUtil";
import {
    computePriceDetail,
    formatProductAndSkuName,
    getBrandCurrency,
    getImgUrlFromProducts,
    getProductFirstImgUrl, getProductFromItem,
    getTotalPriceOrderInCreation
} from "../../util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";
import ReactMarkdown from "react-markdown";
import ProductIntro from "@component/products/ProductIntro";
import {makeStyles} from "@material-ui/styles";
import {MuiThemeProps} from "@theme/theme";

function getStyleForUpdate(item: any) {
    if (item.optionListExtIds && item.optionListExtIds.length > 0) {
        return {cursor:"pointer"};
    }
    return null;
}

type MiniCartProps = {
    toggleSidenav?: () => void
    contextData: any
}

export function itemRestrictionMax(item: any) {
    return item && item.restrictionsApplied && item.restrictionsApplied.length === 1 &&
        item.restrictionsApplied[0].type === RESTRICTION_MAX_ITEM;
}

export function itemHaveRestriction(item: any) {
    return !itemRestrictionMax(item) && item.restrictionsApplied &&
        item.restrictionsApplied.length > 0
}

const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
    dialogContent: {
        paddingBottom: '1.25rem',
        backgroundColor: palette.background.default
        //maxWidth: "750px"
    },
}))

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav , contextData}) => {
    const { palette } = useTheme()
    const classes = useStyles()
    const { dispatch } = useAppContext()
    const [openProductDetail, setOpenProductDetail] = useState(false);
    const { getOrderInCreation, setOrderInCreation, setGlobalDialog,
        currentBrand, checkDealProposal, currentEstablishment} = useAuth();
    const [itemNumber, setItemNumber] = useState(0);
    const [currency, setcurrency] = useState("");
    const [clickedItem, setClickedItem] = useState(null);

    useEffect(() => {
        setItemNumber(getItemNumberInCart(getOrderInCreation))
        if (contextData) {
            setcurrency(getBrandCurrency(contextData.brand));
        }
    }, [getOrderInCreation, contextData])

    const handleCartAmountChange = useCallback(
        (amount, product) => () => {
            dispatch({
                type: 'CHANGE_CART_AMOUNT',
                payload: {
                    ...product,
                    qty: amount,
                },
            })
        },
        []
    )

    const displayProductDetail =  (item) => {
        //let product = getProductFromItem(item, contextData?.products)
        if (item.optionListExtIds && item.optionListExtIds.length > 0) {
            setClickedItem(item)
            setOpenProductDetail(true);
        }
    }

    return (
        <Box width="380px">
            <Dialog
                open={openProductDetail}
                maxWidth={false}
                onClose={() => setOpenProductDetail(false)}>
                <DialogContent className={classes.dialogContent}>
                    <ProductIntro imgUrl={[getImgUrlFromProducts(clickedItem, contextData?.products)]} price={0}
                                  disableFacebook={true}
                                  brand={currentBrand()}
                                  initialItem={clickedItem}
                                  product={getProductFromItem(clickedItem, contextData?.products)}
                                  options={contextData.options}
                                  currency={currency}
                                  addCallBack={() => {
                                      setOpenProductDetail(false)
                                  }}
                    />
                    <IconButton
                        sx={{position: 'absolute', top: '0', right: '0'}}
                        onClick={() => setOpenProductDetail(false)}
                    >
                        <Close className="close" fontSize="small" color="primary"/>
                    </IconButton>
                </DialogContent>
            </Dialog>
            {/*{JSON.stringify(orderInCreation())}*/}
            <Box
                overflow="auto"
                height={`calc(100vh - ${getItemNumberInCart(getOrderInCreation) > 0 ? '80px - 3.25rem' : '0px'})`}
            >
                <FlexBox
                    alignItems="center"
                    m="0px 20px"
                    height="74px"
                    color="secondary.main"
                >
                    <ShoppingBagOutlined color="inherit" />
                    <Box fontWeight={600} fontSize="16px" ml={1}>
                        {localStrings.formatString(localStrings.cartItemNumber, itemNumber)}
                    </Box>
                </FlexBox>

                <Divider />

                {itemNumber == 0 && (
                    <FlexBox
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="calc(100% - 90px)"
                    >

                        <LazyImage
                            objectFit="cover"
                            src="/assets/images/logos/shopping-bag.svg"
                            width="90px"
                            height="100%"
                        />
                        <Box
                            component="p"
                            mt={2}
                            color="grey.600"
                            textAlign="center"
                            maxWidth="200px"
                        >
                            {localStrings.emptyBasket}
                        </Box>
                    </FlexBox>
                )}

                {(getOrderInCreation()?.charges || []).map((chargeItem, key) =>

                    <FlexBox
                        alignItems="center"
                        py={2}
                        px={2.5}
                        borderBottom={`1px solid ${palette.divider}`}
                        key={key}
                    >
                        <BazarAvatar
                            src={"/assets/images/Icon_Color_13.png"}
                            mx={2}
                            height={76}
                            width={76}
                        />

                        <Box flex="1 1 0">
                            {/*<Link href={`/product/${item.id}`}>*/}
                            {/*  <a>*/}
                            <H5 className="title" fontSize="14px">
                                {chargeItem.name}
                            </H5>

                            {/*<p>{JSON.stringify(chargeItem)}</p>*/}
                            <Box fontWeight={600} fontSize="14px" color="primary.main" mt={0.5}>
                                {chargeItem?.price?.toFixed(2) +  " " + currency}
                            </Box>
                            {chargeItem.restrictionsList && chargeItem.restrictionsList.length === 1 &&
                                <Tiny2 color="grey.600">
                                    <ReactMarkdown>{chargeItem.restrictionsList[0].description}</ReactMarkdown>
                                </Tiny2>
                            }
                        </Box>

                    </FlexBox>
                )}

                {/*<p>{JSON.stringify(getOrderInCreation()?.discounts || [])}</p>*/}

                {(getOrderInCreation()?.discounts || []).map((discountItem, key) =>

                    <FlexBox
                        alignItems="center"
                        py={2}
                        px={2.5}
                        borderBottom={`1px solid ${palette.divider}`}
                        key={key}
                    >

                        <BazarAvatar
                            src={"/assets/images/discount.png"}
                            mx={2}
                            height={76}
                            width={76}
                        />

                        <Box flex="1 1 0">
                            <H5 className="title" fontSize="14px">
                                {discountItem.name}
                            </H5>
                            {discountItem.couponCodeValues && discountItem.couponCodeValues.length == 1 &&
                                <H6 className="title" fontSize="12px">
                                    {localStrings.formatString(localStrings.codeApplied, discountItem.couponCodeValues[0])}
                                </H6>
                            }
                        </Box>

                        <BazarIconButton
                            ml={2.5}
                            size="small"
                            onClick={() => {
                                deleteDiscountInCart(getOrderInCreation(), setOrderInCreation, discountItem.id)
                            }}
                        >
                            <Close fontSize="small" />
                        </BazarIconButton>

                    </FlexBox>
                )}


                {getCartItems(getOrderInCreation).map(item => (
                    // <p>{JSON.stringify(item)}</p>
                    <FlexBox
                        alignItems="center"
                        py={2}
                        px={2.5}
                        borderBottom={`1px solid ${palette.divider}`}
                        key={item.id}
                    >
                        <FlexBox alignItems="center" flexDirection="column">
                            <BazarButton
                                variant="outlined"
                                color="primary"
                                disabled={itemHaveRestriction(item.type === TYPE_PRODUCT ? item : item.deal) ||
                                    itemRestrictionMax(item.type === TYPE_PRODUCT ? item : item.deal)}
                                sx={{
                                    height: '32px',
                                    width: '32px',
                                    borderRadius: '300px',
                                }}
                                onClick={async () => {
                                    if (item.type === TYPE_DEAL) {
                                        increaseDealCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation, item.uuid, currentBrand())
                                    }
                                    else {
                                        //alert("increaseCartQte")
                                        await increaseCartQte(setGlobalDialog, getOrderInCreation(),
                                            setOrderInCreation, item.uuid, contextData, checkDealProposal, currentEstablishment, currentBrand())
                                    }
                                }}
                            >
                                <Add fontSize="small" />
                            </BazarButton>
                            <Box fontWeight={600} fontSize="15px" my="3px">
                                {item.quantity}
                            </Box>

                            <BazarButton
                                variant="outlined"
                                color="primary"
                                sx={{
                                    height: '32px',
                                    width: '32px',
                                    borderRadius: '300px',
                                }}
                                disabled={itemHaveRestriction(item.type === TYPE_PRODUCT ? item : item.deal)}
                                onClick={() => {
                                    if (item.type === TYPE_DEAL) {
                                        decreaseDealCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation, item.uuid)
                                    }
                                    else {
                                        decreaseCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation, item.uuid,
                                            false, currentEstablishment, currentBrand)
                                    }
                                }}
                                disabled={item.quantity === 1}
                            >
                                <Remove fontSize="small" />
                            </BazarButton>
                        </FlexBox>

                        {item.type === TYPE_PRODUCT ?

                            <div style={getStyleForUpdate(item)} onClick={() => displayProductDetail(item)}>
                                <BazarAvatar
                                    style={{ objectFit: "cover" }}
                                    src={getImgUrlFromProducts(item, contextData?.products)}
                                    mx={2}
                                    alt={item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                                    height={76}
                                    width={76}
                                />
                            </div>
                            :
                            <>
                                {item.deal.dealNotSelectable ?
                                    <BazarAvatar
                                        src={getImgUrlFromProducts(item, contextData?.products)}
                                        mx={2}
                                        alt={item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                                        height={76}
                                        width={76}
                                    />
                                    :
                                    <>
                                        {item.deal.dealNotSelectable ?
                                            <BazarAvatar
                                                src={getImgUrlFromProducts(item, contextData?.products)}
                                                mx={2}
                                                alt={item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                                                height={76}
                                                width={76}
                                            />
                                            :
                                            <Link href={"/product/detailDealUpdate?uuid=" + item.uuid}>
                                                <a>
                                                    <BazarAvatar
                                                        src={getImgUrlFromProducts(item, contextData?.products)}
                                                        mx={2}
                                                        alt={item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                                                        height={76}
                                                        width={76}
                                                    />
                                                </a>
                                            </Link>
                                        }
                                    </>
                                }
                            </>
                        }

                        <Box flex="1 1 0">
                            {item.type === TYPE_PRODUCT ?
                                <div style={getStyleForUpdate(item)} onClick={() => displayProductDetail(item)}>
                                    <H5 className="title" fontSize="14px" style={{
                                        textDecoration:
                                            itemHaveRestriction(item) ? 'line-through' : 'none'
                                    }}>
                                        {formatProductAndSkuName(item)}
                                    </H5>
                                </div>
                                :
                                <>
                                {item.deal.dealNotSelectable ?
                                        <H5 className="title" fontSize="14px" style={{
                                            textDecoration:
                                                itemHaveRestriction(item.deal) ? 'line-through' : 'none'
                                        }}>
                                            {item.deal.name}
                                        </H5>
                                        :
                                        <Link href={"/product/detailDealUpdate?uuid=" + item.uuid}>
                                            <a>
                                                <H5 className="title" fontSize="14px" style={{
                                                    textDecoration:
                                                        itemHaveRestriction(item.deal) ? 'line-through' : 'none'
                                                }}>
                                                    {item.deal.name}
                                                </H5>
                                            </a>
                                        </Link>
                                }
                                </>
                            }
                            {!itemHaveRestriction(item.type === TYPE_PRODUCT ? item : item.deal) &&
                                <>
                                    <Tiny color="grey.600">
                                        {item.type === TYPE_DEAL &&
                                            getPriceWithOptions(item, false).toFixed(2) + " " + currency + " x" + item.quantity
                                        }
                                        {item.type === TYPE_PRODUCT &&
                                            getPriceWithOptions(item, true).toFixed(2) + " " + currency + " x" + item.quantity
                                        }
                                    </Tiny>
                                    <Box fontWeight={600} fontSize="14px" color="primary.main" mt={0.5}>
                                        {item.type === TYPE_DEAL &&
                                            (getPriceWithOptions(item, false) * item.quantity).toFixed(2) + " " + currency
                                        }
                                        {item.type === TYPE_PRODUCT &&
                                            (getPriceWithOptions(item, true) * item.quantity).toFixed(2)  + " " + currency
                                        }
                                    </Box>
                                </>
                            }


                            {(itemHaveRestriction(item.type === TYPE_PRODUCT ? item : item.deal) ||
                                    itemRestrictionMax(item.type === TYPE_PRODUCT ? item : item.deal)) &&
                                (item.type === TYPE_PRODUCT ? item.restrictionsApplied : item.deal.restrictionsApplied)
                                    .map((restriction, key) => {
                                        return (
                                            <Tiny2 color="grey.600" key={key}>
                                                {restriction.local || restriction.type}
                                            </Tiny2>
                                        )
                                    })
                            }
                        </Box>

                        <BazarIconButton
                            ml={2.5}
                            size="small"
                            onClick={() => {
                                if (item.type === TYPE_DEAL) {
                                    deleteDealInCart(setGlobalDialog, getOrderInCreation, setOrderInCreation, item.uuid)
                                }
                                if (item.type === TYPE_PRODUCT) {
                                    deleteItemInCart(setGlobalDialog, getOrderInCreation, setOrderInCreation, item.uuid)
                                }
                            }}
                        >
                            <Close fontSize="small" />
                        </BazarIconButton>
                    </FlexBox>
                ))}
            </Box>

            {getItemNumberInCart(getOrderInCreation) > 0 && (
                <Box p={2.5}>

                    <Link href="/checkout">
                        <BazarButton
                            variant="contained"
                            color="primary"
                            sx={{
                                mb: '0.75rem',
                                height: '40px',
                            }}
                            fullWidth
                            onClick={toggleSidenav}
                        >
                            {localStrings.checkOutNow} ({computePriceDetail(getOrderInCreation()).total.toFixed(2) + " " + getBrandCurrency(contextData ? contextData.brand : null)})
                            {/*{localStrings.checkOutNow}*/}
                        </BazarButton>
                    </Link>

                    <Link href="/cart">
                        <BazarButton
                            color="primary"
                            variant="outlined"
                            sx={{ height: 40 }}
                            fullWidth
                            onClick={toggleSidenav}
                        >
                            {localStrings.viewCart}
                        </BazarButton>
                    </Link>
                </Box>
            )}
        </Box>
    )
}

MiniCart.defaultProps = {
    toggleSidenav: () => {},
}

export default MiniCart
