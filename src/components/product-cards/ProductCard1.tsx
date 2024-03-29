import BazarCard from '@component/BazarCard'
import LazyImage from '@component/LazyImage'
import {H3} from '@component/Typography'
import {Box, Button, Chip, Dialog, DialogContent, IconButton,} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import {CSSProperties, makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import Link from 'next/link'
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import FlexBox from '../FlexBox'
import ProductIntro, {formatPriceLocal} from '../products/ProductIntro'
import {ORDER_DELIVERY_MODE_DELIVERY, SEP, WIDTH_DISPLAY_MOBILE} from "../../util/constants";
import {
  addToCartOrder,
  buildProductAndSkus,
  decreaseCartQte,
  getQteInCart,
  isProductAndSkuGetOption
} from "../../util/cartUtil";
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import {cloneDeep} from "@apollo/client/utilities";
import useWindowSize from "@hook/useWindowSize";
import Image from "@component/BazarImage";
import {getDeliveryZone} from "@context/FirebaseAuthContext";
import {firstOrCurrentEstablishment} from "../../util/displayUtil";

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
  fullView: boolean
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

export function isSkuUnavailableInEstablishment(sku: any, currentEstablishment) {
  if (!sku || !currentEstablishment) {
    return true;
  }
  if (!currentEstablishment() || !sku?.unavailableInEstablishmentIds || sku?.unavailableInEstablishmentIds.length == 0) {
    return false;
  }

  return sku?.unavailableInEstablishmentIds.includes(currentEstablishment().id);
}


function getUnavailability(product, currentEstablishment, selectedProductAndSku) {
  if (product.skus.length > 1) {
    return !product.skus.find(sku => !isSkuUnavailableInEstablishment(sku, currentEstablishment))
  }
  return isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment);
}

export function isProductUnavailable(product, currentEstablishment, selectedProductAndSku) {
  if (product.skus.length === 1 && getUnavailability(product, currentEstablishment, selectedProductAndSku)) {
    return true;
  }
  if (product.skus.length > 1) {
    if (!product.skus.find(sku => !isSkuUnavailableInEstablishment(sku, currentEstablishment)))
    {
      return true;
    }
  }
  return false;
}

export function getProductSkuLength(product: any) {
  return (product?.skus || []).filter(sku => sku.visible && !sku.onlyInDeal).length
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
                                                     fullView,
                                                     language,
                                                     firstOrCurrentEstablishment
                                                   }) => {

  const width = useWindowSize()

  if (!product) {
    product = {
      name: title,
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      let zoneMap = await getDeliveryZone(currentEstablishment()?.brandId, currentEstablishment()?.id, getOrderInCreation())
      let productAndSkusRes = buildProductAndSkus(product, getOrderInCreation(),
          null, null, currentEstablishment, currentService, brand, zoneMap);
      setProductAndSkus(productAndSkusRes);
      let minPriceSkus = cloneDeep(productAndSkusRes).sort((a, b) => {
        return parseFloat(a.sku.price) - parseFloat(b.sku.price);
      })
      let selected = productAndSkusRes && productAndSkusRes.length > 0 ? minPriceSkus[0] : null;
      setSelectedProductSku(selected)
      let indexCheapest = productAndSkusRes.findIndex(pandsku => pandsku.sku.extRef === selected.sku.extRef)
      setSelectedSkuIndex(indexCheapest)
    }
    fetchData()
  }, [product])

  const {addToast} = useToasts();
  const [productAndSkus, setProductAndSkus] = useState([])
  const [selectedProductAndSku, setSelectedProductSku] = useState(null)
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0)
  const [productPopupOpen, setProductPopupOpen] = useState(false);
  const {getOrderInCreation, setOrderInCreation, currentEstablishment, currentBrand,
    setGlobalDialog, setRedirectPageGlobal, checkDealProposal, setSelectEstaOpen} = useAuth();

  const classes = useStyles({ hoverEffect })

  const toggleDialog = useCallback(() => {
    setProductPopupOpen((open) => !open)
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

  function getAddToCartElement() {
    //return localStrings.seeDetail;
    if (selectedProductAndSku?.product?.notAddableToCart) {
      return localStrings.seeDetail;
    }
    let length = getProductSkuLength(product)

    //.skus.length;
    if (length === 1 && getUnavailability(product, currentEstablishment, selectedProductAndSku)) {
      return localStrings.unavailable;
    }
    if (length > 1) {
      if (!product.skus.find(sku => !isSkuUnavailableInEstablishment(sku, currentEstablishment)))
      {
        return localStrings.unavailable;
      }
    }

    if (isProductAndSkuGetOption(selectedProductAndSku) || length > 1) {
      return localStrings.selectOptions;
    }

    if (length === 1 && getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0) {
      return localStrings.choose;
    }
    return (<Add fontSize="small"/>)
  }


  function getProductPresentationAndInteration() {
    return (

        <FlexBox>
          {(!fullView && width <= WIDTH_DISPLAY_MOBILE) &&
          <Box sx={{maxWidth: "100px"}} mr={3}>
            {/*<Link href={buildProductDetailRef()}>*/}
            {/*  <a>*/}
            <Button onClick={() => setProductPopupOpen(true)}>
                <Image
                    style={{objectFit: "cover"}}

                    src={imgUrl}
                    height={100}
                    width={100}
                    display="block"
                    alt={product.name}
                />
            </Button>
            {/*  </a>*/}
            {/*</Link>*/}
          </Box>
          }

          <Box sx={{flexGrow:1}} minWidth="0px" mr={1}>


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
                {formatPriceLocal(parseFloat(selectedProductAndSku.sku.price).toFixed(2),
                    currency, language)}
                {/*{parseFloat(selectedProductAndSku.sku.price).toFixed(2)} {currency}*/}
              </Box>
            </FlexBox>
            }

            {!fullView && width <= WIDTH_DISPLAY_MOBILE && product.tags && product.tags.map((tag, key) =>
                <Box key={key} ml='3px' mt='20px' mr='3px'>
                  {tag.color ?
                      <Chip
                          sx={{backgroundColor: tag.color, color: 'white'}}
                          size="small"
                          label={tag.tag}
                      />
                      :
                      <Chip
                          color={"primary"}
                          size="small"
                          label={tag.tag}
                      />
                  }
                </Box>
            )}
          </Box>


          <FlexBox
              className="add-cart"
              flexDirection="row"
              alignItems="center"
          >
            {selectedProductAndSku && selectedProductAndSku.sku && productAndSkus && productAndSkus.length === 1 &&
            !isProductAndSkuGetOption(selectedProductAndSku) &&
            getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0 ? (
                    <Fragment>
                      <Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{padding: '3px', minWidth: '25px', ml: '5px', mr: '5px'}}
                            disabled={getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0}
                            onClick={() => {
                              if (selectedProductAndSku?.sku.uuid) {
                                decreaseCartQte(setGlobalDialog, getOrderInCreation(),
                                    setOrderInCreation, selectedProductAndSku?.sku.uuid, checkDealProposal, currentEstablishment, currentBrand)
                              }
                            }}
                        >
                          <Remove fontSize="small"/>
                        </Button>
                      </Box>
                      <Box color="text.primary" fontWeight="600">
                        {getQteInCart(selectedProductAndSku, getOrderInCreation())}
                      </Box>
                      <Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={getUnavailability(product, currentEstablishment, selectedProductAndSku)}
                            sx={{padding: '3px', ml: '5px', mr: '5px'}}
                            onClick={() => {
                              //alert("add")
                              if (!isProductAndSkuGetOption(selectedProductAndSku) && getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0) {
                                //alert(selectedProductAndSku.sku.uuid)
                                //alert(JSON.stringify(selectedProductAndSku.sku));
                                addToCartOrder(setGlobalDialog, selectedProductAndSku,
                                    getOrderInCreation(), setOrderInCreation, addToast, null,
                                    checkDealProposal, currentEstablishment, currentBrand());
                                //alert("uuid " + uuid);
                                // if (!selectedProductAndSku.sku.uuid) {
                                //   let selectedWithUuid = {...selectedProductAndSku, sku: {...selectedProductAndSku.sku, uuid:uuid}}
                                //   setSelectedProductSku(selectedWithUuid)
                                // }
                              } else {
                                setProductPopupOpen(true);
                              }
                            }}
                        >
                          {getAddToCartElement()}

                        </Button>
                      </Box>

                    </Fragment>
                )
                :
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={getUnavailability(product, currentEstablishment, selectedProductAndSku)}
                    sx={{padding: '3px', ml: '5px', mr: '5px'}}
                    onClick={() => {
                      if (!firstOrCurrentEstablishment) {
                        setSelectEstaOpen(true);
                        return;
                      }

                      if (!isProductAndSkuGetOption(selectedProductAndSku) && getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0) {
                        //addToCartOrder(setGlobalDialog, selectedProductAndSku, getOrderInCreation(), setOrderInCreation, addToast);
                        addToCartOrder(setGlobalDialog, selectedProductAndSku,
                            getOrderInCreation(), setOrderInCreation, addToast, null,
                            checkDealProposal, currentEstablishment, currentBrand());
                      } else {
                        setProductPopupOpen(true);
                      }
                    }}
                >
                  {selectedProductAndSku &&
                  <>
                    {getAddToCartElement()}
                  </>
                  }
                </Button>
            }
          </FlexBox>
        </FlexBox>
    )
  }

  return (
      <BazarCard className={classes.root} hoverEffect={hoverEffect}>
        <div className={classes.imageHolder}>
          {/*<p>{JSON.stringify(selectedProductAndSku)}</p>*/}
          <Box
              display="flex"
              flexWrap="wrap"
              sx={{position: 'absolute', zIndex: 2, mr: '35px', mt: '4px'}}
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
          </Box>

          {(fullView || width > WIDTH_DISPLAY_MOBILE) &&
          <Link href={buildProductDetailRef()}>
            <a>
              <LazyImage
                  objectFit="cover"
                  priority={true}
                  src={url}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  alt={product.name}
              />
            </a>
          </Link>
          }
        </div>

        <div className={classes.details}>
          {getProductPresentationAndInteration()}
        </div>


        <Dialog
            BackdropProps={{
              classes: {
                root: classes.backDrop,
              },
            }}
            open={productPopupOpen}
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
                          addCallBack={(uuid) => {
                            let newPAndSku = {
                              ...selectedProductAndSku,
                              sku: {
                                ...selectedProductAndSku.sku,
                                uuid: uuid,
                              }
                            };
                            setSelectedProductSku(newPAndSku)
                            setProductPopupOpen(false)

                          }}
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
  )
}

ProductCard1.defaultProps = {
  imgUrl: '/assets/images/Icon_Sandwich.png',
  price: 450,
  rating: 0,
  //off: 20,
}

export default ProductCard1
