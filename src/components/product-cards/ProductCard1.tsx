import BazarCard from '@component/BazarCard'
import LazyImage from '@component/LazyImage'
import {H3} from '@component/Typography'
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
  //console.log("isProductUnavailable" + product.name + "/" + product.skus.length );
  // console.log("product " + JSON.stringify(product) );
  // console.log("selectedProductAndSku " + JSON.stringify(selectedProductAndSku) );
  if (product.skus.length === 1 && getUnavailability(product, currentEstablishment, selectedProductAndSku)) {
    return true;
  }
  if (product.skus.length > 1) {
    // console.log("product.skus.length > 1");
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
                                                     fullView
                                                   }) => {

  const width = useWindowSize()

  if (!product) {
    product = {
      name: title,
    }
  }

  useEffect(() => {
    let productAndSkusRes = buildProductAndSkus(product, getOrderInCreation(),
        null, null, currentEstablishment, currentService, brand);
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
  const {getOrderInCreation, setOrderInCreation, currentEstablishment,
    setGlobalDialog, setRedirectPageGlobal, checkDealProposal} = useAuth();

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

    // if (isProductAndSkuGetOption(selectedProductAndSku)) {
    //   if (product.skus.length > 0) {
    //     if (!product.skus.find(sku => !isSkuUnavailableInEstablishment(sku, currentEstablishment)))
    //     {
    //       return localStrings.unavailable;
    //     }
    //     return localStrings.selectOptions;
    //   }
    //   else {
    //     if (product.skus.length === 1 && isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment)) {
    //       return localStrings.unavailable;
    //     }
    //     if (product.skus.length > 1) {
    //       if (!product.skus.find(sku => !isSkuUnavailableInEstablishment(sku, currentEstablishment)))
    //       {
    //         return localStrings.unavailable;
    //       }
    //       return localStrings.selectOptions;
    //     }
    //
    //
    //   }
    //   // else {
    //     // if (getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0) {
    //     //   return localStrings.choose;
    //     // }
    //     return localStrings.selectOptions;
    //   // }
    // }
    // else {
    //   if (isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment)) {
    //     return localStrings.unavailable;
    //   }
    //   else {
    //     if (getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0) {
    //       return localStrings.choose;
    //     }
    //     return (<Add fontSize="small"/>)
    //   }
    // }

    // return (isProductAndSkuGetOption(selectedProductAndSku) || getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0) ?
    //     isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable : localStrings.selectOptions
    //     :
    //     isProductUnavailableInEstablishment(selectedProductAndSku, currentEstablishment) ? localStrings.unavailable :
    //         <Add fontSize="small"/>;
  }


  function getProductPresentationAndInteration() {
    return (
        <Box>
          {!fullView && width <= WIDTH_DISPLAY_MOBILE && product.tags && product.tags.map((tag, key) =>
        {/*<p>{JSON.stringify(selectedProductAndSku || {})}</p>*/}
        {/*{product.newProductExpireDate}*/}
              <Box key={key} ml='3px' mt='6px' mr='3px'>
                {tag.color ?
                    <Chip
                        sx={{backgroundColor: tag.color, color: 'white'}}
                        //className={classes.offerChip}
                        size="small"
                        label={tag.tag}
                    />
                    :
                    <Chip
                        //className={classes.offerChip}
                        color={"primary"}
                        size="small"
                        label={tag.tag}
                    />
                }
              </Box>
          )}
          <FlexBox sx={{flexWrap: 'wrap'}}>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              <Link href={`/product/detail/${id}`}>
                <a>
                  <H3
                      sx={{overflowWrap: "anywhere"}}
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
                sx={{flexWrap: 'wrap'}}
            >
              {selectedProductAndSku && selectedProductAndSku.sku && productAndSkus && productAndSkus.length === 1 &&
              !isProductAndSkuGetOption(selectedProductAndSku) &&
              getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0 ? (
                      <Fragment>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{padding: '3px', minWidth: '25px', ml: '5px', mr: '5px'}}
                            disabled={getQteInCart(selectedProductAndSku, getOrderInCreation()) == 0}
                            onClick={() => {
                              // alert("remove" + selectedProductAndSku?.sku.uuid)
                              //
                              // console.log("remove " + JSON.stringify(selectedProductAndSku, null,2))
                              // console.log("getOrderInCreation() " + JSON.stringify(getOrderInCreation(), null,2))
                              if (selectedProductAndSku?.sku.uuid) {
                                decreaseCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation, selectedProductAndSku?.sku.uuid)
                              }
                            }}
                        >
                          <Remove fontSize="small"/>
                        </Button>
                        <Box color="text.primary" fontWeight="600">
                          {getQteInCart(selectedProductAndSku, getOrderInCreation())}
                        </Box>
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
                                    getOrderInCreation(), setOrderInCreation, addToast, null, checkDealProposal, currentEstablishment);
                                //alert("uuid " + uuid);
                                // if (!selectedProductAndSku.sku.uuid) {
                                //   let selectedWithUuid = {...selectedProductAndSku, sku: {...selectedProductAndSku.sku, uuid:uuid}}
                                //   setSelectedProductSku(selectedWithUuid)
                                // }
                              } else {
                                setOpen(true);
                              }
                            }}
                        >
                          {getAddToCartElement()}

                        </Button>

                      </Fragment>
                  )
                  :
                  <Button
                      variant="outlined"
                      color="primary"
                      disabled={getUnavailability(product, currentEstablishment, selectedProductAndSku)}
                      sx={{padding: '3px', ml: '5px', mr: '5px'}}
                      onClick={() => {
                        //alert("add To cart")
                        if (!isProductAndSkuGetOption(selectedProductAndSku) && getQteInCart(selectedProductAndSku, getOrderInCreation()) > 0) {
                          //addToCartOrder(setGlobalDialog, selectedProductAndSku, getOrderInCreation(), setOrderInCreation, addToast);
                          addToCartOrder(setGlobalDialog, selectedProductAndSku,
                              getOrderInCreation(), setOrderInCreation, addToast, null, checkDealProposal, currentEstablishment);

                          // alert("uuid " + uuid);
                          // let newPAndSku = {
                          //   ...selectedProductAndSku,
                          //   sku: {
                          //     ...selectedProductAndSku.sku,
                          //     uuid: uuid,
                          //   }};
                          // console.log("newPAndSku " + JSON.stringify(newPAndSku, null, 2));
                          // setSelectedProductSku(newPAndSku)
                          //
                          // if (!selectedProductAndSku?.sku.uuid || getQteInCart(selectedProductAndSku, getOrderInCreation()) === 0) {
                          //   let selectedWithUuid = {...selectedProductAndSku, sku: {...selectedProductAndSku?.sku, uuid:uuid}}
                          //   setSelectedProductSku(selectedWithUuid)
                          // }
                        } else {
                          setOpen(true);
                        }
                      }}
                  >
                    {selectedProductAndSku &&
                    <>

                      {/*{JSON.stringify(selectedProductAndSku)}*/}
                      {getAddToCartElement()}
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
        </Box>
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
          {(!fullView && width <= WIDTH_DISPLAY_MOBILE) ?
              <Box
                  mr={.5}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
              >
                <Box sx={{maxWidth: "100px"}} mr={1}>
                  <Link href={buildProductDetailRef()}>
                    <a>
                      <Image
                          style={{objectFit: "cover"}}

                          src={imgUrl}
                          height={100}
                          width={100}
                          display="block"
                          alt={product.name}
                      />
                    </a>
                  </Link>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {getProductPresentationAndInteration()}
                </Box>

              </Box>


              :
              <>
                {getProductPresentationAndInteration()}
              </>
          }


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
                          addCallBack={(uuid) => {
                            let newPAndSku = {
                              ...selectedProductAndSku,
                              sku: {
                                ...selectedProductAndSku.sku,
                                uuid: uuid,
                              }
                            };
                            setSelectedProductSku(newPAndSku)
                            setOpen(false)

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
