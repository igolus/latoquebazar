import BazarCard from '@component/BazarCard'
import LazyImage from '@component/LazyImage'
import {H3} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Button, Chip, Dialog, DialogContent, IconButton,} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import {CSSProperties, makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import Link from 'next/link'
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import FlexBox from '../FlexBox'
import ProductIntro from '../products/ProductIntro'
import BazarButton from "@component/BazarButton";
import {ORDER_DELIVERY_MODE_DELIVERY, SEP} from "../../util/constants";
import {
  addToCartOrder,
  buildProductAndSkus,
  decreaseCartQte,
  getQteInCart,
  isProductAndSkuGetOption, RESTRICTION_DELIVERY
} from "../../util/cartUtil";
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import {getBrandCurrency, getFirstRestrictionItem} from "../../util/displayUtil";
import {cloneDeep} from "@apollo/client/utilities";

export interface ProductCard1Props {
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
  brand: any,
  faceBookShare: boolean
  options: any,
  currency: string
  currentService: any
}

const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    margin: 'auto',
    overflow: 'hidden',
    transition: 'all 250ms ease-in-out',
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

    '& .extra-icons': {
      display: 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '7px',
      right: '15px',
      cursor: 'pointer',
      zIndex: 2,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  offerChip: {
    //position: 'absolute',
    opacity:0.8,
    fontSize: '15px',
    fontWeight: 600,
    paddingLeft: 3,
    paddingRight: 3,

    //zIndex: 998,
  },
  details: {
    padding: '1rem',

    '& .title, & .categories': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

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
    backgroundColor: palette.background.default
    //maxWidth: "750px"
  },
  backDrop: {
    backdropFilter: "blur(5px)",
    backgroundColor:'rgba(0,0,30,0.4)'
  },
}))

export function isProductUnavailableInDelivery(selectedProductAndSku: any) {
  if (!selectedProductAndSku?.sku?.restrictionsList || selectedProductAndSku?.sku?.restrictionsList.length == 0) {
    return false;
  }
  let firstRestriction = selectedProductAndSku?.sku?.restrictionsList[0];
  if ((firstRestriction?.serviceTypes || []).length === 0) {
    return false;
  }
  return !(firstRestriction?.serviceTypes || []).includes(ORDER_DELIVERY_MODE_DELIVERY)
}

export function isProductUnavailableInEstablishment(selectedProductAndSku: any, currentEstablishment) {
  if (!currentEstablishment() || !selectedProductAndSku?.sku?.unavailableInEstablishmentIds || selectedProductAndSku?.sku?.unavailableInEstablishmentIds.length == 0) {
    return false;
  }

  return selectedProductAndSku?.sku?.unavailableInEstablishmentIds.includes(currentEstablishment().id);
}



const ProductCard1: React.FC<ProductCard1Props> = ({
                                                     id,
                                                     imgUrl,
                                                     title,
                                                     price= 200,
                                                     off = 0,
                                                     rating,
                                                     hoverEffect,
                                                     product,
                                                     brand,
                                                     faceBookShare,
                                                     options,
                                                     currency,
                                                     currentService,
                                                   }) => {

  if (!product) {
    product = {
      name: title,

    }
  }

  useEffect(() => {
    let productAndSkusRes = buildProductAndSkus(product, getOrderInCreation(),
        null, null, currentEstablishment, currentService, brand, setGlobalDialog, setRedirectPageGlobal);
    setProductAndSkus(productAndSkusRes);
    let minPriceSkus = cloneDeep(productAndSkusRes).sort((a,b) => {
      return parseFloat(a.sku.price) -  parseFloat(b.sku.price);
    })
    // alert("minPriceSkus " + JSON.stringify(minPriceSkus, null, 2))
    // console.log("minPriceSkus " + JSON.stringify(minPriceSkus, null, 2) )

    let selected = productAndSkusRes && productAndSkusRes.length > 0 ? minPriceSkus[0] : null;

    //alert("selected " + JSON.stringify(selected || {}));
    setSelectedProductSku(selected)
    let indexCheapest = productAndSkusRes.findIndex( pandsku => pandsku.sku.extRef === selected.sku.extRef)
    // alert("indexCheapest " + indexCheapest)
    //setSelectedProductSku(product && product.skus ? buildProductAndSkus1[0] : null)
    setSelectedSkuIndex(indexCheapest)
  }, [product])

  const {addToast} = useToasts();
  const [productAndSkus, setProductAndSkus] = useState([])
  const [selectedProductAndSku, setSelectedProductSku] = useState(null)
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0)
  const [open, setOpen] = useState(false);
  const {getOrderInCreation, setOrderInCreation, currentEstablishment, setGlobalDialog, setRedirectPageGlobal} = useAuth();

  const classes = useStyles({ hoverEffect })


  // const { state, dispatch } = useAppContext()
  // const cartItem: CartItem | undefined = state.cart.cartList.find(
  //     (item) => item.id === id
  // )

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open)
  }, [])


  let url = "/assets/images/Icon_Sandwich.png";
  if (product && product?.files && product?.files?.length > 0) {
    url = product.files[0].url;
  }
  else if (imgUrl) {
    url = imgUrl;
  }

  function buildProductDetailRef() {
    if (!product.skus || product.skus?.length == 1) {
      return `/product/detail/${id}`;
    }
    return `/product/detail/${id}` + SEP + selectedSkuIndex;

  }

  function isAvailableSku() {
    if (!currentEstablishment()) {
      return false
    }
    return !(selectedProductAndSku?.sku?.unavailableInEstablishmentIds || []).includes(currentEstablishment().id);
  }

  function newProductExpired(newProductExpireDate: string) {
    return moment(newProductExpireDate, 'YYYY-MM-DD').isBefore()
  }

  return (
      <BazarCard className={classes.root} hoverEffect={hoverEffect}>
        {/*<p>{JSON.stringify(currentEstablishment())}</p>*/}
        {/*<p>{JSON.stringify(selectedProductAndSku || {})}</p>*/}
        {/*{product.newProductExpireDate}*/}
        <div className={classes.imageHolder}>
          {/*<p>{JSON.stringify(selectedProductAndSku)}</p>*/}
          <Box
              display="flex"
              flexWrap="wrap"
              sx={{ position: 'absolute', zIndex:2, mr: '35px', mt:'4px'}}
          >

            {product.newProduct && product.newProductExpireDate && !newProductExpired(product.newProductExpireDate) &&
                <Box ml='3px' mt='6px' mr='3px'>
                  <Chip
                      className={classes.offerChip}
                      color="secondary"
                      size="small"
                      label={localStrings.new}
                  />
                </Box>
            }

            {/*{product.newProduct && product.newProductExpireDate && !newProductExpired(product.newProductExpireDate) &&*/}
            {/*<Box ml='3px' mt='6px' mr='3px'>*/}
            {/*  <Chip*/}
            {/*      className={classes.offerChip}*/}
            {/*      color="secondary"*/}
            {/*      size="small"*/}
            {/*      label={localStrings.new}*/}
            {/*  />*/}
            {/*</Box>*/}
            {/*}*/}

            {/*<p>{JSON.stringify(selectedProductAndSku?.sku || {})}</p>*/}

            {isProductUnavailableInDelivery(selectedProductAndSku) &&
              <Box ml='3px' mt='6px' mr='3px'>
                <Chip
                    className={classes.offerChip}
                    color="primary"
                    size="small"
                    label={localStrings.unavailableInDelivery}
                />
              </Box>

            }

            {/*{selectedProductAndSku?.sku?.restrictionsApplied &&*/}
            {/*selectedProductAndSku?.sku?.restrictionsApplied*/}
            {/*    .filter(item => item.type === RESTRICTION_DELIVERY)*/}
            {/*    .map((restriction, key) =>*/}
            {/*    <Box key={key} ml='3px' mt='6px' mr='3px'>*/}
            {/*      <Chip*/}
            {/*          className={classes.offerChip}*/}
            {/*          color="primary"*/}
            {/*          size="small"*/}
            {/*          label={restriction.local}*/}
            {/*      />*/}
            {/*    </Box>*/}
            {/*)}*/}

            {product.tags && product.tags.map((tag, key) =>
                <Box key={key} ml='3px' mt='6px' mr='3px'>
                  <Chip
                      className={classes.offerChip}
                      color="primary"
                      size="small"
                      label={tag.tag}
                  />
                </Box>
            )}
          </Box>

          <div className="extra-icons">
            <IconButton sx={{ p: '6px' }} onClick={toggleDialog}>
              <RemoveRedEye color="secondary" fontSize="small" />
            </IconButton>
          </div>

          <Link href={buildProductDetailRef()} >
            <a>
              <LazyImage
                  objectFit="cover"
                  src={url}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  alt={product.name}
              />
            </a>
          </Link>
        </div>

        <div className={classes.details}>
          {/*{productAndSkus && productAndSkus.length > 1 &&*/}
          {/*<div style={{ width: '100%' }}>*/}
          {/*  <Box display="flex" justifyContent="center" m={1}>*/}
          {/*    {productAndSkus.map((productAndSkuItem, key) =>*/}
          {/*        <Box key={key}>*/}
          {/*          /!*<BazarButton>grande</BazarButton>*!/*/}
          {/*          <BazarButton*/}
          {/*              onClick={() => {*/}
          {/*                setSelectedProductSku(productAndSkuItem)*/}
          {/*                setSelectedSkuIndex(key)*/}
          {/*              }}*/}
          {/*              variant="contained"*/}
          {/*              color={selectedProductAndSku?.sku.extRef === productAndSkuItem.sku.extRef ? "primary" : undefined}*/}
          {/*              sx={{ padding: "3px", mr: "8px", ml: "8px"}}>*/}
          {/*            {productAndSkuItem.sku.name}*/}
          {/*          </BazarButton>*/}
          {/*        </Box>*/}
          {/*    )}*/}
          {/*  </Box>*/}
          {/*</div>*/}
          {/*}*/}

          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              <Link href={`/product/detail/${id}`}>
                <a>
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


                </a>
              </Link>

              {selectedProductAndSku && selectedProductAndSku?.sku.price &&
              <FlexBox alignItems="center" mt={0.5}>
                <Box pr={1} fontWeight="600" color="primary.main">
                  {parseFloat(selectedProductAndSku.sku.price).toFixed(2)} {currency}
                </Box>
              </FlexBox>
              }
            </Box>


            <FlexBox
                className="add-cart"
                flexDirection="row"
                alignItems="center"
                //justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
                //width="65px"
            >
              {/*<Button*/}
              {/*    variant="outlined"*/}
              {/*    color="primary"*/}
              {/*    sx={{ padding: '3px', ml:'5px', mr:'5px'}}*/}
              {/*    onClick={() => {*/}
              {/*      if (!isProductAndSkuGetOption(selectedProductAndSku)) {*/}
              {/*        addToCartOrder(selectedProductAndSku, orderInCreation, setOrderInCreation, addToast)*/}
              {/*      }*/}
              {/*      else {*/}
              {/*        setOpen(true);*/}
              {/*      }*/}
              {/*    }}*/}
              {/*>*/}
              {/*  {isProductAndSkuGetOption(selectedProductAndSku) ?*/}
              {/*      localStrings.selectOptions*/}
              {/*      :*/}
              {/*      <Add fontSize="small" />*/}
              {/*  }*/}

              {/*</Button>*/}

              {selectedProductAndSku && selectedProductAndSku.sku && productAndSkus && productAndSkus.length === 1 &&
              !isProductAndSkuGetOption(selectedProductAndSku) &&
              getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0 ? (
                  <Fragment>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ padding: '3px', minWidth: '25px', ml:'5px', mr:'5px'}}
                        disabled={getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0}
                        onClick={() => {
                          if (selectedProductAndSku?.sku.uuid) {
                            decreaseCartQte(getOrderInCreation(), setOrderInCreation, selectedProductAndSku?.sku.uuid)
                          }
                        }}
                    >
                      <Remove fontSize="small" />
                    </Button>
                    <Box color="text.primary" fontWeight="600">
                      {getQteInCart(selectedProductAndSku, getOrderInCreation())}
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment)}
                        sx={{ padding: '3px', ml:'5px', mr:'5px'}}
                        onClick={() => {
                          //alert("add")
                          if (!isProductAndSkuGetOption(selectedProductAndSku)) {
                            //alert(selectedProductAndSku.sku.uuid)
                            //alert(JSON.stringify(selectedProductAndSku.sku));
                            addToCartOrder(selectedProductAndSku, getOrderInCreation, setOrderInCreation, addToast);
                            //alert("uuid " + uuid);
                            // if (!selectedProductAndSku.sku.uuid) {
                            //   let selectedWithUuid = {...selectedProductAndSku, sku: {...selectedProductAndSku.sku, uuid:uuid}}
                            //   setSelectedProductSku(selectedWithUuid)
                            // }
                          }
                          else {
                            setOpen(true);
                          }
                        }}
                    >
                      {(isProductAndSkuGetOption(selectedProductAndSku) || productAndSkus && productAndSkus.length > 1) ?
                          isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable : localStrings.selectOptions
                          :
                          isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable : <Add fontSize="small" />
                      }

                    </Button>

                  </Fragment>
              )
              :
                  <Button
                      variant="outlined"
                      color="primary"
                      disabled={isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment)}
                      sx={{ padding: '3px', ml:'5px', mr:'5px'}}
                      onClick={() => {
                        //alert("add To cart")
                        if (!isProductAndSkuGetOption(selectedProductAndSku) && productAndSkus && productAndSkus.length === 1) {
                          let uuid = addToCartOrder(selectedProductAndSku, getOrderInCreation, setOrderInCreation, addToast);
                          //alert("uuid " + uuid);
                          if (!selectedProductAndSku?.sku.uuid || getQteInCart(selectedProductAndSku, getOrderInCreation()) === 0) {
                            let selectedWithUuid = {...selectedProductAndSku, sku: {...selectedProductAndSku?.sku, uuid:uuid}}
                            setSelectedProductSku(selectedWithUuid)
                          }
                        }
                        else {
                          setOpen(true);
                        }
                      }}
                  >
                    {selectedProductAndSku &&
                      <>
                        {/*{JSON.stringify(selectedProductAndSku)}*/}
                        {(isProductAndSkuGetOption(selectedProductAndSku) || productAndSkus && productAndSkus.length > 1) ?
                            isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable : localStrings.selectOptions
                            :
                            isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable : <Add fontSize="small" />
                        }
                      </>
                    }
                    {/*{selectedProductAndSku && isProductAndSkuGetOption(selectedProductAndSku) ?*/}
                    {/*    (getFirstRestrictionItem() || localStrings.selectOptions)*/}
                    {/*    :*/}
                    {/*    getFirstRestrictionItem() || <Add fontSize="small" />*/}
                    {/*}*/}

                  </Button>
              }
            </FlexBox>
          </FlexBox>
        </div>

        <Dialog
            BackdropProps={{
              classes: {
                root: classes.backDrop,
              },
            }}
            open={open}
            maxWidth={false}
            onClose={toggleDialog}>
          <DialogContent className={classes.dialogContent}>
            <ProductIntro imgUrl={[imgUrl]} title={title} price={price}
                          disableFacebook={true}
                          brand={brand}
                          faceBookShare={faceBookShare}
                          skuIndex={selectedSkuIndex}
                          product={product}
                          options={options}
                          currency={currency}
                          addCallBack={() => setOpen(false)}
            />
            <IconButton
                sx={{ position: 'absolute', top: '0', right: '0' }}
                onClick={toggleDialog}
            >
              <Close className="close" fontSize="small" color="primary" />
            </IconButton>
          </DialogContent>
        </Dialog>
      </BazarCard>
  )
}

ProductCard1.defaultProps = {
  imgUrl: '/assets/images/Icon_Sandwich.png',
  price: 450,
  rating: 0,
  //off: 20,
}

export default ProductCard1
