import BazarCard from '@component/BazarCard'
import BazarRating from '@component/BazarRating'
import LazyImage from '@component/LazyImage'
import { H3 } from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Remove from '@material-ui/icons/Remove'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import { CSSProperties, makeStyles } from '@material-ui/styles'
import { CartItem } from '@reducer/cartReducer'
import { MuiThemeProps } from '@theme/theme'
import Link from 'next/link'
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import FlexBox from '../FlexBox'
import ProductIntro from '../products/ProductIntro'
import BazarButton from "@component/BazarButton";

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
  options: any,
  currency: string
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
    position: 'absolute',
    fontSize: '10px',
    fontWeight: 600,
    paddingLeft: 3,
    paddingRight: 3,
    top: '10px',
    left: '10px',
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

const ProductCard1: React.FC<ProductCard1Props> = ({
                                                     id,
                                                     imgUrl,
                                                     title,
                                                     price= 200,
                                                     off = 0,
                                                     rating,
                                                     hoverEffect,
                                                     product,
                                                     options,
                                                     currency
                                                   }) => {

  if (!product) {
    product = {
      name: title,

    }
  }

  useEffect(() => {
    setSelectedSku(product && product.skus ? product.skus[0] : null)
  }, [product])


  const [selectedSku, setSelectedSku] = useState(product && product.skus ? product.skus[0] : null)
  const [open, setOpen] = useState(false)

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

  const handleCartAmountChange = useCallback(
      (amount) => () => {
        dispatch({
          type: 'CHANGE_CART_AMOUNT',
          payload: {
            name: title,
            qty: amount,
            price,
            imgUrl,
            id,
          },
        })
      },
      []
  )

  return (
      <BazarCard className={classes.root} hoverEffect={hoverEffect}>
        <div className={classes.imageHolder}>
          {/*{!!off && (*/}
          {/*  <Chip*/}
          {/*    className={classes.offerChip}*/}
          {/*    color="primary"*/}
          {/*    size="small"*/}
          {/*    label={`${off}% off`}*/}
          {/*  />*/}
          {/*)}*/}

          <div className="extra-icons">
            <IconButton sx={{ p: '6px' }} onClick={toggleDialog}>
              <RemoveRedEye color="secondary" fontSize="small" />
            </IconButton>
          </div>

          <Link href={`/product/detail/${id}`}>
            <a>
              <LazyImage
                  src={url}
                  width="100%"
                  height="auto"
                  layout="responsive"
                  alt={product.name}
              />
            </a>
          </Link>
        </div>

        <div className={classes.details}>
          {product.skus && product.skus.length > 1 &&
          <div style={{ width: '100%' }}>
            <Box display="flex" justifyContent="center" m={1}>
              {product.skus.map((sku, key) =>
                  <Box key={key}>
                    {/*<BazarButton>grande</BazarButton>*/}
                    <BazarButton
                        onClick={() => setSelectedSku(sku)}
                        variant="contained"
                        color={selectedSku.extRef === sku.extRef ? "primary" : undefined}
                        sx={{ padding: "3px", mr: "3px" }}>
                      {sku.name}
                    </BazarButton>
                  </Box>
              )}
            </Box>
          </div>
          }

          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              <Link href={`/product/${id}`}>
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

              {/*<BazarRating value={rating || 0} color="warn" readOnly />*/}

              {selectedSku && selectedSku.price &&
              <FlexBox alignItems="center" mt={0.5}>
                <Box pr={1} fontWeight="600" color="primary.main">
                  {selectedSku.price} {currency}
                </Box>
                {/*{!!off && (*/}
                {/*  <Box color="grey.600" fontWeight="600">*/}
                {/*    <del>{price?.toFixed(2)}</del>*/}
                {/*  </Box>*/}
                {/*)}*/}
              </FlexBox>
              }
            </Box>


            {/*<FlexBox*/}
            {/*    className="add-cart"*/}
            {/*    flexDirection="column-reverse"*/}
            {/*    alignItems="center"*/}
            {/*    justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}*/}
            {/*    width="30px"*/}
            {/*>*/}
            {/*  <Box pr={1} fontWeight="600" color="primary.main">*/}
            {/*    <Chip*/}
            {/*        //disabled={step.disabled}*/}
            {/*        label={`grande`}*/}
            {/*        //onClick={handleStepClick(step, ind)}*/}
            {/*        sx={{*/}
            {/*          //backgroundColor: ind <= selected ? 'primary.main' : 'primary.light',*/}
            {/*          backgroundColor: 'primary.main',*/}
            {/*          color: 'primary.contrastText',*/}
            {/*          p: '0.5rem 1rem',*/}
            {/*          fontSize: '14px',*/}
            {/*          fontWeight: '600',*/}
            {/*          my: '4px',*/}
            {/*          '&:hover:not(:disabled)': {*/}
            {/*            backgroundColor: 'primary.main',*/}
            {/*            color: 'primary.contrastText',*/}
            {/*          },*/}
            {/*        }}*/}
            {/*    />*/}
            {/*  </Box>*/}

            {/*  <Box pr={1} fontWeight="600" color="primary.main">*/}
            {/*  <Chip*/}
            {/*      //disabled={step.disabled}*/}
            {/*      label={`petite`}*/}
            {/*      //onClick={handleStepClick(step, ind)}*/}
            {/*      sx={{*/}
            {/*        //backgroundColor: ind <= selected ? 'primary.main' : 'primary.light',*/}
            {/*        backgroundColor: 'primary.main',*/}
            {/*        color: 'primary.contrastText',*/}
            {/*        p: '0.5rem 1rem',*/}
            {/*        fontSize: '14px',*/}
            {/*        fontWeight: '600',*/}
            {/*        my: '4px',*/}
            {/*        '&:hover:not(:disabled)': {*/}
            {/*          backgroundColor: 'primary.main',*/}
            {/*          color: 'primary.contrastText',*/}
            {/*        },*/}
            {/*      }}*/}
            {/*  />*/}
            {/*</Box>*/}
            {/*</FlexBox>*/}

            <FlexBox
                className="add-cart"
                flexDirection="row"
                alignItems="center"
                justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
                width="65px"
            >
              <Button
                  variant="outlined"
                  color="primary"
                  sx={{ padding: '3px', minWidth: '25px', ml:'5px', mr:'5px'}}
                  onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}
              >
                <Add fontSize="small" />
              </Button>

              {!!cartItem?.qty && (
                  <Fragment>
                    <Box color="text.primary" fontWeight="600">
                      {cartItem?.qty}
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ padding: '3px', minWidth: '25px', ml:'5px', mr:'5px'}}
                        onClick={handleCartAmountChange(cartItem?.qty - 1)}
                    >
                      <Remove fontSize="small" />
                    </Button>
                  </Fragment>
              )}
            </FlexBox>
          </FlexBox>
        </div>

        <Dialog open={open} maxWidth={false} onClose={toggleDialog}>
          <DialogContent className={classes.dialogContent}>
            <ProductIntro imgUrl={[imgUrl]} title={title} price={price}
                          product={product} options={options} currency={currency}/>
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
  id: '324321',
  title: 'ASUS ROG Strix G15',
  imgUrl: '/assets/images/products/macbook.png',
  price: 450,
  rating: 0,
  //off: 20,
}

export default ProductCard1
