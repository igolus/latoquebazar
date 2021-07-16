import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import LazyImage from '@component/LazyImage'
import {H1, H3} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Grid} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import {CartItem} from '@reducer/cartReducer'
import {useRouter} from 'next/router'
import React, {useCallback, useState} from 'react'
import ImageViewer from 'react-simple-image-viewer'
import FlexBox from '../FlexBox'
import ReactMarkdown from 'react-markdown'
import localStrings from "../../localStrings";
import ProductSelector from './ProductSelector'
import useAuth from "@hook/useAuth";
import {addToCartOrder} from '../../util/cartUtil'

export interface ProductIntroProps {
  imgUrl?: string[]
  title: string
  price: number
  id?: string | number
  product: any
  options: any,
  currency: string
}

const ProductIntro: React.FC<ProductIntroProps> = ({
                                                     imgUrl = [],
                                                     title,
                                                     price = 200,
                                                     id,
                                                     product,
                                                     options,
                                                     currency
                                                   }) => {

  if (!product) {
    product = {
      name: title,
    }
  }
  else {
    imgUrl = (product.files || []).map(file => file.url);
  }

  const [productAndSku, setProductAndSku] = useState({...buildProductAndSkus(product)[0]});

  const [selectedImage, setSelectedImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const {setOrderInCreation, orderInCreation} = useAuth();
  const { state, dispatch } = useAppContext()
  const cartList: CartItem[] = state.cart.cartList
  const router = useRouter()
  const routerId = router.query.id as string
  const cartItem = cartList.find((item) => item.id === id || item.id === routerId)

  const handleImageClick = (ind: number) => () => {
    setSelectedImage(ind)
  }

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }

  const handleCartAmountChange = useCallback(
      (amount) => () => {
        dispatch({
          type: 'CHANGE_CART_AMOUNT',
          payload: {
            qty: amount,
            name: title,
            price,
            imgUrl: imgUrl[0],
            id: id || routerId,
          },
        })
      },
      []
  )

  function buildProductAndSkus() {
    let allSkusWithProduct = [];
    if (product && product.skus) {
      product.skus.forEach(sku => {
        //if (!sku.unavailableInEstablishmentIds || !sku.unavailableInEstablishmentIds.includes(currentEstablishment().id)) {
        allSkusWithProduct.push({
          product: product,
          sku: sku,
          options: []
        })
        //}
      })
    }

    console.log("allSkusWithProduct " + JSON.stringify(allSkusWithProduct, null, 2))
    console.log("allSkusWithProduct[0] " + JSON.stringify(allSkusWithProduct[0], null, 2))
    return allSkusWithProduct;
  }

  return (
      <Box width="100%">
        <Grid container spacing={3} justifyContent="space-around">
          <Grid item md={6} xs={12} alignItems="center">
            <Box>
              <FlexBox justifyContent="center" mb={6}>
                <LazyImage
                    src={imgUrl[selectedImage]}
                    onClick={() =>
                        openImageViewer(imgUrl.indexOf(imgUrl[selectedImage]))
                    }
                    alt={product.name}
                    height="300px"
                    width="auto"
                    loading="eager"
                    objectFit="contain"
                />
                {isViewerOpen && (
                    <ImageViewer
                        src={imgUrl}
                        currentIndex={currentImage}
                        onClose={closeImageViewer}
                        backgroundStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                        }}
                    />
                )}
              </FlexBox>


              <FlexBox overflow="auto">
                {imgUrl.map((url, ind) => (
                    <Box
                        height={64}
                        width={64}
                        minWidth={64}
                        bgcolor="white"
                        borderRadius="10px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px solid"
                        style={{ cursor: 'pointer' }}
                        ml={ind === 0 ? 'auto' : 0}
                        mr={ind === imgUrl.length - 1 ? 'auto' : '10px'}
                        borderColor={selectedImage === ind ? 'primary.main' : 'grey.400'}
                        onClick={handleImageClick(ind)}
                        key={ind}
                    >
                      <BazarAvatar src={url} variant="square" height={40} />
                    </Box>
                ))}
              </FlexBox>
            </Box>
          </Grid>

          <Grid item md={6} xs={12} alignItems="center">
            <H1 mb={2}>{product.name}</H1>

            {/*<FlexBox alignItems="center" mb={2}>*/}
            {/*  <Box>Brand:</Box>*/}
            {/*  <H6 ml={1}>Xiaomi</H6>*/}
            {/*</FlexBox>*/}

            {product.skus && product.skus.length > 1 &&
            // <div style={{ width: '100%' }}>
            <Box display="flex" justifyContent="left">
              {buildProductAndSkus(product).map((pandsku, key) =>
                  <Box key={key}>
                    {/*<BazarButton>grande</BazarButton>*/}
                    <BazarButton
                        onClick={() => setProductAndSku(pandsku)}
                        variant="contained"
                        color={productAndSku.sku.extRef === pandsku.sku.extRef ? "primary" : undefined}
                        sx={{ padding: "7px", mr: "7px", mb:"7px"}}>
                      {pandsku.sku.name}
                    </BazarButton>
                  </Box>
              )}
            </Box>
              // </div>
            }

            <Box mb={3}>
              <h2 color="primary.main" mb={0.5} lineHeight="1">
                {productAndSku.sku.price} {currency}
              </h2>
              <Box color="inherit">Stock Available</Box>
            </Box>

            <ReactMarkdown>{product.shortDescription}</ReactMarkdown>

            {/*{JSON.stringify(product)}*/}





            {!cartItem?.qty ? (
                <BazarButton
                    variant="contained"
                    color="primary"
                    sx={{
                      mb: '36px',
                      px: '1.75rem',
                      height: '40px',
                    }}
                    onClick={() => addToCartOrder(productAndSku, orderInCreation, setOrderInCreation)}
                >
                  {localStrings.addToCart}
                </BazarButton>
            ) : (
                <FlexBox alignItems="center" mb={4.5}>
                  <BazarButton
                      sx={{ p: '9px' }}
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={handleCartAmountChange(cartItem?.qty - 1)}
                  >
                    <Remove fontSize="small" />
                  </BazarButton>
                  <H3 fontWeight="600" mx={2.5}>
                    {cartItem?.qty.toString().padStart(2, '0')}
                  </H3>
                  <BazarButton
                      sx={{ p: '9px' }}
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={handleCartAmountChange(cartItem?.qty + 1)}
                  >
                    <Add fontSize="small" />
                  </BazarButton>
                </FlexBox>
            )}


            {/*{JSON.stringify(productAndSku)}*/}

            <ProductSelector options={options}
                             productAndSku={productAndSku}
                             setterSkuEdit={setProductAndSku}
                             currency={currency}/>

            {/*<FlexBox alignItems="center" mb={2}>*/}
            {/*  <Box>Sold By:</Box>*/}
            {/*  <Link href="/shop/fdfdsa">*/}
            {/*    <a>*/}
            {/*      <H6 ml={1}>Mobile Store</H6>*/}
            {/*    </a>*/}
            {/*  </Link>*/}
            {/*</FlexBox>*/}
          </Grid>
        </Grid>
      </Box>
  )
}

ProductIntro.defaultProps = {
  imgUrl: [
    '/assets/images/products/headphone.png',
    '/assets/images/products/hiclipart.com (16).png',
    '/assets/images/products/hiclipart.com (18).png',
  ],
  title: 'Mi Note 11 Pro',
  price: 1100,
}

export default ProductIntro
