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
  PRICING_EFFECT_FIXED_PRICE, PRICING_EFFECT_PERCENTAGE, PRICING_EFFECT_PERCENTAGE_OFF, PRICING_EFFECT_PRICE,
  PRICING_EFFECT_PRICE_OFF,
  PRICING_EFFECT_UNCHANGED,
  SEP
} from "../../util/constants";
import {
  buildProductAndSkus,
  buildProductAndSkusNoCheckOrderInCreation,
  isProductAndSkuGetOption,
  selectToDealEditOrder
} from "../../util/cartUtil";
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ProductIntro from "@component/products/ProductIntro";
import {Close} from "@material-ui/icons";

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

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
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
                                                   }) => {

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
  const {dealEdit, setDealEdit} = useAuth();

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
    return selectedProductAndSku && dealEdit && dealEdit.productAndSkusLines &&
      dealEdit.productAndSkusLines.some(productAndSkusLine => productAndSkusLine.extRef == selectedProductAndSku.sku.extRef)
  }

  function addToDeal (productAndSku) {

    let pricingEffect = deal.lines[lineNumber].pricingEffect;
    let pricingValue = deal.lines[lineNumber].pricingValue;

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

    selectToDealEditOrder(productAndSku, dealEdit, setDealEdit, lineNumber)
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

  return (
      <Box {...defaultProps}>
        {/*<p>{JSON.stringify(options)}</p>*/}
        <BazarCard  className={classes.root} hoverEffect={hoverEffect}>
        <div className={classes.imageHolder}>

          <Box
              display="flex"
              flexWrap="wrap"
              sx={{ position: 'absolute', zIndex:999, mr: '35px', mt:'4px'}}
          >
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

          {/*<Link href={buildProductDetailRef()} >*/}
          {/*  <a>*/}


              <LazyImage
                  onClick={() => {
                    if (!isProductAndSkuGetOption(selectedProductAndSku)) {
                      selectToDealEditOrder(selectedProductAndSku, dealEdit, setDealEdit, lineNumber)
                    }
                    else {
                      setOpen(true);
                    }
                  }}
                  src={url}
                  width="100%"
                  height="auto"
                  layout="responsive"
                  alt={product.name}


              />
          {/*  </a>*/}
          {/*</Link>*/}
        </div>

        <div className={classes.details}>
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              {/*<Link href={`/product/${id}`}>*/}
              {/*  <a>*/}
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

            </Box>

            <FlexBox
                className="add-cart"
                flexDirection="row"
                alignItems="center"
                justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
                //width="65px"
            >
              <Button
                  //variant="outlined"
                  disabled={!isProductAndSkuGetOption(selectedProductAndSku) && isProductSelected()}
                  color="primary"
                  sx={{ padding: '3px', ml:'5px', mr:'5px'}}
                  onClick={() => {
                    if (!isProductAndSkuGetOption(selectedProductAndSku)) {
                      selectToDealEditOrder(selectedProductAndSku, dealEdit, setDealEdit, lineNumber)
                    }
                    else {
                      setOpen(true);
                    }
                  }}
              >
                {isProductAndSkuGetOption(selectedProductAndSku) &&
                  localStrings.selectOptions
                }
                {!isProductAndSkuGetOption(selectedProductAndSku) && isProductSelected() &&
                  <CheckBoxIcon />
                }
                {!isProductAndSkuGetOption(selectedProductAndSku) && !isProductSelected() &&
                  <CheckBoxOutlineBlankIcon />
                }

              </Button>

            </FlexBox>
          </FlexBox>
        </div>

        <Dialog open={open} maxWidth={false} onClose={toggleDialog}>
          <DialogContent className={classes.dialogContent}>

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
                          disableAdd={!isProductAndSkuGetOption(selectedProductAndSku)}
                          //addCallBack={() => setOpen(false)}
                          addToCartOrderCallBack={addToDeal}
                          addButtonText={localStrings.select}
                          lineNumber={lineNumber}
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
