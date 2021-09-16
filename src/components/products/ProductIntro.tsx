import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import LazyImage from '@component/LazyImage'
import {H1, H3} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Chip, Grid} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import {CartItem} from '@reducer/cartReducer'
import {useRouter} from 'next/router'
import React, {useCallback, useEffect, useState} from 'react'
import ImageViewer from 'react-simple-image-viewer'
import FlexBox from '../FlexBox'
import ReactMarkdown from 'react-markdown'
import localStrings from "../../localStrings";
import ProductSelector from './ProductSelector'
import useAuth from "@hook/useAuth";
import {addToCartOrder, buildProductAndSkus} from '../../util/cartUtil'
import {useToasts} from "react-toast-notifications";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {formatDuration} from "../../util/displayUtil";

export interface ProductIntroProps {
    imgUrl?: string[]
    title: string
    price: number
    id?: string | number
    product: any
    options: any,
    currency: string,
    skuIndex: any,
    addCallBack: any
    disableAdd: boolean,
    addToCartOrderCallBack: any,
    addButtonText: string
    routeToCart: boolean,
    lineNumber: number
}

const ProductIntro: React.FC<ProductIntroProps> = ({
                                                       imgUrl = [],
                                                       title,
                                                       price = 200,
                                                       id,
                                                       product,
                                                       options,
                                                       currency,
                                                       skuIndex,
                                                       addCallBack,
                                                       disableAdd,
                                                       addToCartOrderCallBack,
                                                       addButtonText,
                                                       routeToCart,
                                                       lineNumber
                                                   }) => {

    if (!product) {
        product = {
            name: title,
        }
    }
    else {
        imgUrl = (product.files || []).map(file => file.url);
    }

    const {setOrderInCreation, getOrderInCreation, dealEdit, currentEstablishment} = useAuth();

    useEffect(() => {
        // if (!orderInCreation()) {
        //   return
        // }
        if (skuIndex) {
            setProductAndSku({...buildProductAndSkus(product, getOrderInCreation, lineNumber, dealEdit)[skuIndex]});
        }
        else {
            setProductAndSku({...buildProductAndSkus(product, getOrderInCreation, lineNumber, dealEdit)[0]});
        }
        //return {...buildProductAndSkus(product, orderInCreation)[0]};

    }, [currentEstablishment()])

    // function getInitialSku() {
    //   // if (!orderInCreation()) {
    //   //   return []
    //   // }
    //   if (skuIndex) {
    //     return {...buildProductAndSkus(product, orderInCreation)[skuIndex]}
    //   }
    //   return {...buildProductAndSkus(product, orderInCreation)[0]};
    // }

    const [productAndSku, setProductAndSku] = useState(null);
    const [valid, setValid] = useState(false);
    const {addToast} = useToasts()
    const [selectedImage, setSelectedImage] = useState(0)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

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


    function isAvailableSku() {
        // if (currentEstablishment()) {
        //     alert(productAndSku?.sku?.unavailableInEstablishmentIds)
        //     alert((productAndSku?.sku?.unavailableInEstablishmentIds || []).includes(currentEstablishment().id))
        // }

        return !(currentEstablishment() &&
            productAndSku?.sku?.unavailableInEstablishmentIds || []).includes(currentEstablishment().id);
    }

    return (
        <Box width="100%">

            {/*<p>{valid}</p>*/}
            {/*  <p>{JSON.stringify(product)}</p>*/}
            {/*  <p>{JSON.stringify(productAndSku?.sku?.unavailableInEstablishmentIds || {})}</p>*/}
            {/*  <p>{JSON.stringify(productAndSku || {})}</p>*/}
            {/*  <p>{currentEstablishment() ? currentEstablishment().id : 0}</p>*/}

            {productAndSku &&
            <Grid container spacing={3} justifyContent="space-around">

                {/*{!valid &&*/}

                {/*}*/}


                <Grid item md={6} xs={12} alignItems="center">
                    <Box>
                        <FlexBox justifyContent="center" mb={6}>
                            <LazyImage
                                src={imgUrl[selectedImage] || "/assets/images/Icon_Sandwich.png"}
                                onClick={() => {
                                    if (imgUrl[selectedImage]) {
                                        openImageViewer(imgUrl.indexOf(imgUrl[selectedImage]))
                                    }
                                }}
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
                                    style={{cursor: 'pointer'}}
                                    ml={ind === 0 ? 'auto' : 0}
                                    mr={ind === imgUrl.length - 1 ? 'auto' : '10px'}
                                    borderColor={selectedImage === ind ? 'primary.main' : 'grey.400'}
                                    onClick={handleImageClick(ind)}
                                    key={ind}
                                >
                                    <BazarAvatar src={url} variant="square" height={40}/>
                                </Box>
                            ))}
                        </FlexBox>
                    </Box>
                </Grid>

                <Grid item md={6} xs={12} alignItems="center">



                    <H1 mb={2}>{product.name}</H1>
                    {!valid &&
                    <Box mb={2}>
                        <AlertHtmlLocal severity={"warning"}
                                        title={localStrings.warningMessage.optionMandatory}
                                        content={""}
                        />

                    </Box>
                    }

                    {/*<FlexBox alignItems="center" mb={2}>*/}
                    {/*  <Box>Brand:</Box>*/}
                    {/*  <H6 ml={1}>Xiaomi</H6>*/}
                    {/*</FlexBox>*/}

                    {product.skus && product.skus.length > 1 &&
                    // <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="left">
                        {buildProductAndSkus(product, getOrderInCreation).map((pandsku, key) =>
                            <Box key={key}>
                                {/*<BazarButton>grande</BazarButton>*/}
                                <BazarButton
                                    onClick={() => setProductAndSku(pandsku)}
                                    variant="contained"
                                    color={productAndSku && productAndSku.sku && productAndSku.sku.extRef === pandsku.sku.extRef ? "primary" : undefined}
                                    sx={{padding: "7px", mr: "7px", mb: "7px"}}>
                                    {pandsku.sku.name}
                                </BazarButton>
                            </Box>
                        )}
                    </Box>
                        // </div>
                    }

                    <Box
                        display="flex"
                        flexWrap="wrap"
                        //sx={{ position: 'absolute', zIndex:999}}
                    >
                        {product.tags && product.tags.map((tag, key) =>
                            <Box key={key} ml='3px' mt='6px' mr='3px'>
                                <Chip
                                    //className={classes.offerChip}
                                    color="primary"
                                    size="small"
                                    label={tag.tag}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <h2 color="primary.main" mb={0.5} lineHeight="1">
                            {productAndSku.sku.price} {currency}
                        </h2>
                    </Box>

                    <ReactMarkdown>{product.shortDescription}</ReactMarkdown>

                    {options && options.length > 0 && isAvailableSku() &&
                    <ProductSelector options={options}
                                     productAndSku={productAndSku}
                                     productAndSku={productAndSku}
                                     setterSkuEdit={setProductAndSku}
                                     skuEdit={productAndSku}
                                     setterValid={setValid}
                                     valid={valid}
                                     currency={currency}
                                     lineNumber={lineNumber}
                    />
                    }

                    {/*<p>{JSON.stringify(productAndSku || {})}</p>*/}
                    {!disableAdd &&
                    <BazarButton
                        disabled={!valid || !isAvailableSku()}
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: '15px',
                            mb: '36px',
                            px: '1.75rem',
                            height: '40px',
                        }}
                        onClick={() => {
                            if (addToCartOrderCallBack) {
                                addToCartOrderCallBack(productAndSku);
                                if (routeToCart) {
                                    router.push("/cart");
                                }
                            } else {
                                addToCartOrder(productAndSku, getOrderInCreation, setOrderInCreation, addToast);
                                if (addCallBack) {
                                    addCallBack();
                                }
                                if (routeToCart) {
                                    router.push("/cart");
                                }
                            }
                        }}
                    >
                        {addButtonText || (isAvailableSku() ? localStrings.addToCart : localStrings.unavailable)}
                    </BazarButton>
                    }

                </Grid>
            </Grid>
            }
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
