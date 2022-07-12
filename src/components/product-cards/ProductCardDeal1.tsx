import BazarCard from '@component/BazarCard'
import LazyImage from '@component/LazyImage'
import {H3} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Button, Chip, Dialog, DialogContent, IconButton,} from '@material-ui/core'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import {CSSProperties, makeStyles} from '@material-ui/styles'
import {CartItem} from '@reducer/cartReducer'
import {MuiThemeProps} from '@theme/theme'
import React, {useCallback, useEffect, useState} from 'react'
import FlexBox from '../FlexBox'
import {
  PRICING_EFFECT_FIXED_PRICE,
  PRICING_EFFECT_PERCENTAGE,
  PRICING_EFFECT_PRICE,
  WIDTH_DISPLAY_MOBILE
} from "../../util/constants";
import {
  buildProductAndSkusNoCheckOrderInCreation,
  isProductAndSkuGetOption,
  selectToDealEditOrder
} from "../../util/cartUtil";
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ProductIntro from "@component/products/ProductIntro";
import {Close} from "@material-ui/icons";
import {isProductUnavailable, isProductUnavailableInEstablishment} from "@component/product-cards/ProductCard1";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import useWindowSize from "@hook/useWindowSize";
import Link from "next/link";
import Image from "@component/BazarImage";
import cloneDeep from "clone-deep";

export interface ProductCardDeal1Props {
  className?: string
  style?: CSSProperties
  rating?: number
  hoverEffect?: boolean
  imgUrl: string
  title: string
  price: number
  off?: number
  id: string | number
  product: any
  faceBookShare: boolean
  options: any,
  currency: string,
  lineNumber: number,
  deal: any
  contextData: any
  selectCallBack: any
  priceDiff: number,
  priceBySkuId: any,
  priceItemsWithoutDeal: number
  fullView: boolean
}

const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
  root: {
    border: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    margin: 'auto',
    overflow: 'hidden',
    transition: 'all 250ms ease-in-out',
    // borderColor: 'black',
    // border: 'black',

    //backgroundColor: 'red',
    borderRadius: '8px',

    '&:hover': {
      '& $imageHolder': {
        '& .extra-icons': {
          display: 'flex',
        },
      },
    },

    '@media only screen and (max-width: 768px)': {
      '& $imageHolder': {
        '& .extra-icons': {
          display: 'flex',
        },
      },
    },
  },
  imageHolder: {
    position: 'relative',
    display: 'inlin-block',
    textAlign: 'center',
    borderColor: 'balck',

    '& .extra-icons': {
      display: 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '7px',
      right: '15px',
      cursor: 'pointer',
      zIndex: 2,
    },

    // [theme.breakpoints.down('sm')]: {
    //   display: 'block',
    // },
  },
  offerChip: {
    offerChip: {
      //position: 'absolute',
      opacity:0.8,
      fontSize: '15px',
      fontWeight: 600,
      paddingLeft: 3,
      paddingRight: 3,
      zIndex: 999,
    },
  },
  details: {
    padding: '1rem',

    // '& .title, & .categories': {
    //   whiteSpace: 'nowrap',
    //   overflow: 'hidden',
    //   textOverflow: 'ellipsis',
    // },

    '& .icon-holder': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },

    '& .favorite-icon': {
      cursor: 'pointer',
    },
  },
  dialogContent: {
    paddingBottom: '1.25rem',
  },
}))

const ProductCardDeal1: React.FC<ProductCardDeal1Props> = ({
                                                             id,
                                                             imgUrl,
                                                             title,
                                                             price= 200,
                                                             off = 0,
                                                             rating,
                                                             hoverEffect,
                                                             faceBookShare,
                                                             product,
                                                             options,
                                                             currency,
                                                             lineNumber,
                                                             deal,
                                                             contextData,
                                                             selectCallBack,
                                                             priceDiff,
                                                             priceBySkuId,
                                                             priceItemsWithoutDeal,
                                                             fullView
                                                           }) => {

  const width = useWindowSize()

  if (!product) {
    product = {
      name: title,

    }
  }

  useEffect(() => {
    let productAndSkusRes = buildProductAndSkusNoCheckOrderInCreation(product);
    setProductAndSkus(productAndSkusRes);
    setSelectedProductSku(productAndSkusRes && productAndSkusRes.length > 0 ? productAndSkusRes[0] : null)
    //setSelectedProductSku(product && product.skus ? buildProductAndSkus1[0] : null)
    setSelectedSkuIndex(0)
  }, [product])

  const [productAndSkus, setProductAndSkus] = useState([])
  const [selectedProductAndSku, setSelectedProductSku] = useState(null)
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0)
  const [open, setOpen] = useState(false);
  const {dealEdit, setDealEdit, currentEstablishment} = useAuth();

  const classes = useStyles({ hoverEffect })
  const { state, dispatch } = useAppContext()
  const cartItem: CartItem | undefined = state.cart.cartList.find(
      (item) => item.id === id
  )

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open)
  }, [])


  let url = "/assets/images/Icon_Sandwich.png";
  if (product && product.files && product.files.length > 0) {
    url = product.files[0].url;
  }
  else if (imgUrl) {
    url = imgUrl;
  }
  function isProductSelected() {
    return selectedProductAndSku && dealEdit && dealEdit?.productAndSkusLines &&
        dealEdit?.productAndSkusLines[lineNumber]?.productId === selectedProductAndSku?.product?.id
    // return selectedProductAndSku && dealEdit && dealEdit.productAndSkusLines &&
    //     dealEdit.productAndSkusLines.some(productAndSkusLine => productAndSkusLine.extRef == selectedProductAndSku.sku.extRef)
  }

  function getLines() {
    if (!deal?.lines && !deal?.deal?.lines) {
      return [];
    }
    return deal.lines || deal.deal.lines;
  }

  function addToDeal (productAndSku) {

    let pricingEffect = getLines()[lineNumber].pricingEffect;
    let pricingValue = getLines()[lineNumber].pricingValue;

    if (pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
      productAndSku.sku.price = pricingValue;
    }
    else if (pricingEffect === PRICING_EFFECT_PRICE) {
      productAndSku.sku.price = Math.max(parseFloat(productAndSku.sku.price) -  parseFloat(pricingValue), 0).toFixed(2);
    }
    else if (pricingEffect === PRICING_EFFECT_PERCENTAGE) {
      let factor = 1 - parseFloat(pricingValue) / 100
      productAndSku.sku.price = (parseFloat(productAndSku.sku.price) * factor).toFixed(2);
    }
    selectCallBack ?
        selectCallBack({
          ...productAndSkus.find(item => item.sku.extRef == selectedProductAndSku.sku.extRef),
          options: productAndSku.options
        })
        :
        selectToDealEditOrder({
          ...selectedProductAndSku,
          options: productAndSku.options
        }, dealEdit, setDealEdit, lineNumber)
    setSelectedProductSku(productAndSku)
    //alert()
    console.log("productAndSku " + JSON.stringify(productAndSku, null, 2))
    setOpen(false)
  }

  const defaultProps = {
    // bgcolor: 'background.paper',
    // m: 1,
    color: "primary.800",
    border: isProductSelected() ? 3 : 0,
  };

  function getPercentDisplay() {

    let percentSave = ((1 - ((priceBySkuId[selectedProductAndSku.sku.extRef] - priceItemsWithoutDeal) /
        parseFloat(selectedProductAndSku.sku.price))) * 100).toFixed(0);

    if (percentSave === "100") {
      return localStrings.thisIspresent;
    }
    return localStrings.formatString(localStrings.saveWithOffer,
        percentSave
    )


  }

  function selectedFromImg() {
    if (isProductUnavailable(product, currentEstablishment, selectedProductAndSku)) {
      return;
    }
    if (!isProductAndSkuGetOption(selectedProductAndSku)) {
      selectCallBack ?
          selectCallBack(selectedProductAndSku)
          :
          selectToDealEditOrder(selectedProductAndSku, dealEdit, setDealEdit, lineNumber)
    } else {
      setOpen(true);
    }
  }

  function getCheapestProductPrice() {
    let skusClone = cloneDeep(product.skus);
    skusClone.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
    return parseFloat(skusClone[0].price).toFixed(2);
  }

  function getProductPresentationAndInteration() {
    return (
        <Box>
          <FlexBox>
            {(!fullView && width <= WIDTH_DISPLAY_MOBILE) &&
                <Box sx={{maxWidth: "100px"}} mr={1}>
                  <Image
                      style={{objectFit: "cover"}}
                      onClick={() => {
                        selectedFromImg();
                      }}
                      src={url}
                      height={100}
                      width={100}
                      display="block"
                      alt={product.name}
                  />
                </Box>
            }


            <Box sx={{flexGrow:1}} minWidth="0px" mr={1}>
              <H3
                  className="title"
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  color="text.secondary"
                  mb={1}
                  title={product.name}
              >
                {product.name}
              </H3>

              {deal.upsellDeal && product.skus && product.skus.length > 0 &&
                  <>
                    {/*<p>{JSON.stringify(product)}</p>*/}
                    <FlexBox alignItems="center" mt={0.5}>
                      <Box pr={1} fontWeight="600" color="primary.main">
                        {getCheapestProductPrice()} {currency}
                        {/*{"17"} {currency}*/}
                      </Box>
                    </FlexBox>
                  </>
              }

            </Box>
            <Box
                className="add-cart"
                flexDirection="row"
                alignItems="center"
                //justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
                //width="65px"
            >
              <Button
                  disabled={
                      (!isProductAndSkuGetOption(selectedProductAndSku) || isProductUnavailable(product, currentEstablishment, selectedProductAndSku)) &&
                      isProductSelected() && productAndSkus && productAndSkus.length === 1}
                  color="primary"
                  //variant={(isProductAndSkuGetOption(selectedProductAndSku) || productAndSkus.length > 1) ? "outlined" : "text"}
                  variant={"outlined"}
                  sx={{padding: '3px', ml: '5px', mr: '5px', mt: !fullView && width <= WIDTH_DISPLAY_MOBILE ? "50px" : "0"}}
                  onClick={() => {
                    if (!isProductAndSkuGetOption(selectedProductAndSku) && productAndSkus && productAndSkus.length == 1) {
                      selectCallBack ?
                          selectCallBack(selectedProductAndSku)
                          :
                          selectToDealEditOrder(selectedProductAndSku, dealEdit, setDealEdit, lineNumber)

                      //selectToDealEditOrder(selectedProductAndSku, dealEdit, setDealEdit, lineNumber)
                    }
                    // else if (productAndSkus && productAndSkus.length > 1){
                    else if (productAndSkus) {
                      setOpen(true)
                    }
                  }}
              >
                {isProductAndSkuGetOption(selectedProductAndSku) && productAndSkus && productAndSkus.length == 1 &&
                    localStrings.selectOptions
                }
                {(!isProductAndSkuGetOption(selectedProductAndSku) || productAndSkus && productAndSkus.length > 1) && isProductSelected() &&
                    <>
                      {productAndSkus && productAndSkus.length > 1 ?
                          <>
                            {localStrings.selectOptions}
                          </>
                          :
                          <>
                            {!isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) &&
                                <CheckBoxIcon/>
                            }
                          </>
                      }
                    </>
                }
                {(!isProductAndSkuGetOption(selectedProductAndSku) || productAndSkus && productAndSkus.length > 1) && !isProductSelected() &&
                    <>
                      {productAndSkus && productAndSkus.length > 1 ?
                          <>
                            {localStrings.selectOptions}
                          </>
                          :
                          <>
                            {!isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) &&
                                localStrings.choose
                              // <CheckBoxOutlineBlankIcon />
                            }
                          </>

                      }
                    </>
                }
              </Button>
            </Box>
          </FlexBox>

          {!fullView && width <= WIDTH_DISPLAY_MOBILE && !deal.upsellDeal &&
              <Box>
                {product.tags && product.tags.map((tag, key) =>
                    <Box key={key} ml='3px' mt='6px' mr='3px'>
                      {tag.color ?
                          <Chip
                              sx={{backgroundColor: tag.color, color: 'white'}}
                              className={classes.offerChip}
                              size="small"
                              label={tag.tag}
                          />
                          :
                          <Chip
                              className={classes.offerChip}
                              color={"primary"}
                              size="small"
                              label={tag.tag}
                          />
                      }
                    </Box>
                )}

                {/*<p>{deal?.upsellDeal}</p>*/}
                {priceDiff>=0 && selectedProductAndSku && !deal?.upsellDeal &&
                    <Box ml='3px' mt='6px' mr='3px'>
                      <Chip
                          className={classes.offerChip}
                          color="primary"
                          size="small"
                          icon={<LocalOfferIcon/>}
                          label={getPercentDisplay()}
                      />
                    </Box>
                }
              </Box>
          }
        </Box>
    )
  }

  return (
      <Box {...defaultProps}>
        {/*<p>{JSON.stringify(options)}</p>*/}
        <BazarCard className={classes.root} hoverEffect={hoverEffect}>
          <div className={classes.imageHolder}>

            <Box
                display="flex"
                flexWrap="wrap"
                sx={{position: 'absolute', zIndex: 999, mr: '35px', mt: '4px'}}
            >
              {(fullView || width > WIDTH_DISPLAY_MOBILE) && product.tags && product.tags.map((tag, key) =>
                  <Box key={key} ml='3px' mt='6px' mr='3px'>
                    {tag.color ?
                        <Chip
                            sx={{backgroundColor: tag.color, color: 'white'}}
                            className={classes.offerChip}
                            size="small"
                            label={tag.tag}
                        />
                        :
                        <Chip
                            className={classes.offerChip}
                            color={"primary"}
                            size="small"
                            label={tag.tag}
                        />
                    }
                  </Box>
              )}

              {/*{isProductUnavailable(product, currentEstablishment, selectedProductAndSku) &&*/}
              {/*<Box ml='3px' mt='6px' mr='3px'>*/}
              {/*  <Chip*/}
              {/*      className={classes.offerChip}*/}
              {/*      color="primary"*/}
              {/*      size="small"*/}
              {/*      label={localStrings.unavailable}*/}
              {/*  />*/}
              {/*</Box>*/}
              {/*}*/}
              {(fullView || width > WIDTH_DISPLAY_MOBILE) && priceDiff>=0 && selectedProductAndSku && !deal?.upsellDeal &&
                  <Box ml='3px' mt='6px' mr='3px'>
                    <Chip
                        className={classes.offerChip}
                        color="primary"
                        size="small"
                        icon={<LocalOfferIcon/>}
                        label={getPercentDisplay()}
                        // label={
                        //   localStrings.formatString(localStrings.saveWithOffer,
                        //       ((1 - (priceDiff / parseFloat(selectedProductAndSku.sku.price))) * 100).toFixed(0)
                        //   )}
                    />
                  </Box>
              }

            </Box>

            <div className="extra-icons">
              <IconButton sx={{p: '6px'}} onClick={toggleDialog}>
                <RemoveRedEye color="secondary" fontSize="small"/>
              </IconButton>
            </div>

            {(fullView || width > WIDTH_DISPLAY_MOBILE) &&
                <div className={classes.imageHolder}>
                  <LazyImage
                      onClick={() => {
                        selectedFromImg();
                      }}
                      objectFit="cover"
                      src={url}
                      width="100%"
                      height="100%"
                      layout="responsive"
                      alt={product.name}
                  />
                </div>
            }
            {/*  </a>*/}
            {/*</Link>*/}
          </div>

          <div className={classes.details}>
            {getProductPresentationAndInteration()}
          </div>

          <Dialog open={open} maxWidth={false} onClose={toggleDialog}>
            <DialogContent className={classes.dialogContent}>
              {/*<p>ProductIntro</p>*/}
              {/*<p>{JSON.stringify(product)}</p>*/}
              <ProductIntro imgUrl={[imgUrl]} title={title} price={price}
                            disableFacebook={true}
                            faceBookShare={faceBookShare}
                            skuIndex={selectedSkuIndex}
                            product={product}
                            firstEsta={contextData.establishments[0]}
                            brand={contextData.brand}
                            options={options}
                            currency={currency}
                            disableAdd={!isProductAndSkuGetOption(selectedProductAndSku)
                                && productAndSkus && productAndSkus.length === 1}
                            changeSelectionCallBack={selected => setSelectedProductSku(selected)}
                            addToCartOrderCallBack={addToDeal}
                            addButtonText={localStrings.select}
                            lineNumber={lineNumber}
              />
              <IconButton
                  sx={{position: 'absolute', top: '0', right: '0'}}
                  onClick={toggleDialog}
              >
                <Close className="close" fontSize="small" color="primary"/>
              </IconButton>
            </DialogContent>
          </Dialog>
        </BazarCard>
      </Box>
  )
}

ProductCardDeal1.defaultProps = {
  id: '324321',
  title: 'ASUS ROG Strix G15',
  imgUrl: '/assets/images/Icon_Sandwich.png',
  price: 450,
  rating: 0,
  //off: 20,
}

export default ProductCardDeal1
