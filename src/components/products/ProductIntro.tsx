import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import LazyImage from '@component/LazyImage'
import {H1} from '@component/Typography'
import {Box, Chip, Dialog, Grid, Tooltip} from '@material-ui/core'
import {useRouter} from 'next/router'
import React, {useCallback, useEffect, useState} from 'react'
import ImageViewer from 'react-simple-image-viewer'
import FlexBox from '../FlexBox'
import ReactMarkdown from 'react-markdown'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import {addToCartOrder, buildProductAndSkus, computeItemRestriction, updateCartOrder} from '../../util/cartUtil'
import {useToasts} from "react-toast-notifications";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {
    formatPrice,
    formatProductAndSkuName, getBrandCurrency,
    getFirstRestrictionDescription,
    getFirstRestrictionItem
} from "../../util/displayUtil";
import {FacebookIcon, FacebookShareButton} from "react-share";
import ProductSelector from './ProductSelector'
import {itemRestrictionMax} from "@component/mini-cart/MiniCart";
import MdRender from "@component/MdRender";
import {getProductSkuLength, isSkuUnavailableInEstablishment} from "@component/product-cards/ProductCard1";
import CircularProgress from '@material-ui/core/CircularProgress';
import {grey} from '../../theme/themeColors'
import useWindowSize from "@hook/useWindowSize";
import {WIDTH_DISPLAY_MOBILE} from "../../util/constants";
import {pixelViewContent} from "../../util/faceBookPixelUtil";
import {getDeliveryZone} from "@context/FirebaseAuthContext";

export interface ProductIntroProps {
    imgUrl?: string[]
    title: string
    price: number
    id?: string | number
    product: any
    faceBookShare: boolean
    options: any,
    brand: any,
    firstEsta: any,
    currency: string,
    skuIndex: any,
    addCallBack: any
    disableAdd: boolean,
    addToCartOrderCallBack: any,
    addButtonText: string
    routeToCart: boolean,
    lineNumber: number,
    currentService: any,
    disableFacebook: boolean,
    changeSelectionCallBack: any
    initialItem: any
}

const ProductIntro: React.FC<ProductIntroProps> = ({
                                                       imgUrl = [],
                                                       title,
                                                       price = 200,
                                                       id,
                                                       product,
                                                       faceBookShare,
                                                       options,
                                                       brand,
                                                       firstEsta,
                                                       currency,
                                                       skuIndex,
                                                       addCallBack,
                                                       disableAdd,
                                                       addToCartOrderCallBack,
                                                       addButtonText,
                                                       routeToCart,
                                                       lineNumber,
                                                       currentService,
                                                       disableFacebook,
                                                       changeSelectionCallBack,
                                                       initialItem
                                                   }) => {

    const width = useWindowSize()

    if (!product) {
        product = {
            name: title,
        }
    }
    else {
        imgUrl = (product.files || []).map(file => file.url);
    }

    const {setOrderInCreation, getOrderInCreation, dealEdit, currentEstablishment, currentBrand,
        setGlobalDialog, setRedirectPageGlobal, checkDealProposal} = useAuth();


    function firstOrCurrentEstablishment() {
        if (currentEstablishment()) {
            return currentEstablishment();
        }
        return firstEsta;
    }


    const [productAndSku, setProductAndSku] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (firstOrCurrentEstablishment() && brand) {
                let productAndSkuBuilt;

                if (skuIndex) {
                    productAndSkuBuilt = {
                        ...buildProductAndSkus(product, getOrderInCreation,
                            lineNumber, dealEdit, firstOrCurrentEstablishment, currentService, brand)[skuIndex]
                    };
                    if (initialItem) {
                        productAndSkuBuilt.options = [...initialItem.options]
                    }
                    setProductAndSku({
                        ...productAndSkuBuilt
                    });
                } else {

                    productAndSkuBuilt = {
                        ...buildProductAndSkus(product, getOrderInCreation,
                            lineNumber, dealEdit, firstOrCurrentEstablishment, currentService, brand)[0]
                    };
                    if (initialItem) {
                        productAndSkuBuilt.options = [...initialItem.options]
                    }
                    setProductAndSku({
                        ...productAndSkuBuilt,
                        setGlobalDialog, setRedirectPageGlobal
                    });
                }

                getDeliveryZone(currentEstablishment()?.brandId,
                    currentEstablishment()?.id, getOrderInCreation()).then(zoneMap => {
                    let copySku = {...productAndSkuBuilt.sku}
                    computeItemRestriction(copySku, currentEstablishment, currentService, getOrderInCreation(),
                        getBrandCurrency(brand), false, zoneMap);

                    setProductAndSku({
                        ...productAndSkuBuilt,
                        sku: copySku,
                        setGlobalDialog, setRedirectPageGlobal
                    });

                })
                //return {...buildProductAndSkus(product, getOrderInCreation, lineNumber, dealEdit, currentEstablishment, currentService)[0]};
            }
        }
        fetchData();

    }, [firstOrCurrentEstablishment(), brand])


    // useEffect(() => {
    //         const fetchData = async () => {
    //             let zoneMap = await getDeliveryZone(firstOrCurrentEstablishment()?.brandId,
    //                 firstOrCurrentEstablishment()?.id, getOrderInCreation())
    //             const first = buildProductAndSkus(product, null,
    //                 null, null, () => firstEsta, null, brand, zoneMap)[0]
    //             setProductAndSku({...first})
    //         }
    //         fetchData();
    //         }
    //     , [])
    // const initialProductAndSku = {
    //     ...buildProductAndSkus(product, null,
    //         null, null, () => firstEsta, null, brand)[0]
    // }

    const [valid, setValid] = useState(true);
    const [invalidIds, setInvalidIds] = useState([]);
    const {addToast} = useToasts()
    const [selectedImage, setSelectedImage] = useState(0)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const router = useRouter()

    useEffect(() => {
        pixelViewContent(brand, productAndSku);
    }, [productAndSku])

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


    function getFirstRestriction() {
        return getFirstRestrictionItem(productAndSku?.sku)
    }


    function getUrl() {
        try {
            let href = window.location.href;
            return href;
        }
        catch (err) {
            return null;
        }
    }

    function getButtonText(addButtonText) {
        if (invalidIds.length === 0) {
            if (initialItem) {
                return localStrings.updateCart;
            }
            return addButtonText || localStrings.addToCart;
        }
        let firstMissingId = invalidIds[0];
        let missingOption = options.find(option => option.id === firstMissingId);
        return localStrings.formatString(localStrings.selectOptionsDetail, missingOption?.name);
    }

    function getAddButton() {
        return <BazarButton
            disabled={
                // !valid ||
                getFirstRestriction() ||
                itemRestrictionMax(productAndSku?.sku) ||
                isSkuUnavailableInEstablishment(productAndSku?.sku, currentEstablishment)
            }
            variant={isSkuUnavailableInEstablishment(productAndSku?.sku, currentEstablishment) ? "outlined" : "contained"}
            color="primary"
            sx={{
                mt: '15px',
                mb: '36px',
                px: '1.75rem',
                height: '40px',
            }}
            onClick={() => {
                if (invalidIds.length > 0) {
                    return;
                }
                if (addToCartOrderCallBack) {
                    addToCartOrderCallBack(productAndSku);
                    if (routeToCart) {
                        router.push("/cart");
                    }
                } else {
                    if (initialItem) {
                        updateCartOrder(setGlobalDialog, productAndSku, initialItem,
                            getOrderInCreation(), setOrderInCreation, addToast, null, checkDealProposal, currentEstablishment)
                        if (addCallBack) {
                            addCallBack("nouuid");
                        }
                    } else {
                        //let uuid = addToCartOrder(setGlobalDialog, productAndSku, getOrderInCreation(), setOrderInCreation, addToast);
                        let uuid = addToCartOrder(setGlobalDialog,
                            productAndSku,
                            getOrderInCreation(), setOrderInCreation, addToast, null,
                            checkDealProposal, currentEstablishment, currentBrand());

                        if (addCallBack) {
                            addCallBack(uuid);
                        }
                        if (routeToCart) {
                            router.push("/cart");
                        }
                    }
                }
            }}
        >
            {isSkuUnavailableInEstablishment(productAndSku?.sku, currentEstablishment) ?
                localStrings.unavailable
                :
                //(addButtonText || (getFirstRestriction() || getButtonText()))
                (getFirstRestriction() || getButtonText(addButtonText))
            }
        </BazarButton>;
    }

    function getInitialItem() {
        if (lineNumber != null) {
            return productAndSku;
        }
        return initialItem;
    }

    return (
        <>
            <Dialog open={isViewerOpen}>
                <ImageViewer
                    src={imgUrl}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                    backgroundStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                />
            </Dialog>

            {/*<p>{JSON.stringify(invalidIds)}</p>*/}
            <Box width="100%">
                {productAndSku ?
                    <Grid container spacing={1} justifyContent="space-around">
                        <Grid item md={6} xs={12} alignItems="center">
                            <Box>
                                <FlexBox justifyContent="center" mb={2}>
                                    <LazyImage
                                        src={imgUrl[selectedImage] || "/assets/images/Icon_Sandwich.png"}
                                        onClick={() => {
                                            if (imgUrl[selectedImage]) {
                                                openImageViewer(imgUrl.indexOf(imgUrl[selectedImage]))
                                            }
                                        }}
                                        alt={product.name}
                                        height="300px"
                                        width="300px"
                                        loading="eager"
                                        objectFit="cover"
                                    />
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
                                {/*{width <= WIDTH_DISPLAY_MOBILE && productAndSku?.sku?.optionListExtIds && productAndSku?.sku?.optionListExtIds.length > 0 &&*/}

                                {/*    <FlexBox justifyContent="center" mb={1} mt={1}>*/}

                                {/*        /!*<Box ml={2} mt={"16px"}>*!/*/}
                                {/*        <a href="#selector">*/}
                                {/*        <BazarButton*/}
                                {/*            variant="outlined"*/}
                                {/*            color="primary"*/}
                                {/*        >*/}
                                {/*            {localStrings.selectOptions}*/}
                                {/*        </BazarButton>*/}
                                {/*        </a>*/}
                                {/*        /!*</Box>*!/*/}
                                {/*    </FlexBox>*/}
                                {/*}*/}
                            </Box>
                        </Grid>

                        <Grid item md={6} xs={12} alignItems="center">
                            <H1 mb={2}>
                                {
                                    formatProductAndSkuName({
                                        ...productAndSku.sku,
                                        productName: product.name
                                    })
                                }
                            </H1>
                            {!valid && !getFirstRestriction() &&
                                <Box mb={2} sx={{maxWidth:"285px"}}>
                                    <AlertHtmlLocal severity={"warning"}
                                                    title={localStrings.warningMessage.optionMandatory}
                                                    content={""}
                                    />
                                </Box>
                            }
                            {getFirstRestrictionDescription(productAndSku?.sku) &&
                                <AlertHtmlLocal severity="info"
                                                title={localStrings.restrictionApplies}
                                >
                                    <ReactMarkdown>{getFirstRestrictionDescription(productAndSku?.sku)}</ReactMarkdown>
                                </AlertHtmlLocal>
                            }

                            {product.skus && getProductSkuLength(product) > 1 &&
                                <Box display="flex" justifyContent="left" flexWrap="wrap">
                                    {buildProductAndSkus(product, getOrderInCreation, null, null,
                                        currentEstablishment, currentService, brand)
                                        .map((pandsku, key) =>
                                            <>
                                                {!getFirstRestrictionItem(productAndSku?.sku) &&
                                                    <Box key={key}>
                                                        {/*<BazarButton>grande</BazarButton>*/}
                                                        <BazarButton
                                                            //disabled={isSkuUnavailableInEstablishment(pandsku?.sku, currentEstablishment)}
                                                            onClick={() => {
                                                                if (changeSelectionCallBack) {
                                                                    changeSelectionCallBack(pandsku)
                                                                }
                                                                setProductAndSku(pandsku)
                                                            }}
                                                            variant="contained"
                                                            color={productAndSku && productAndSku.sku && productAndSku.sku.extRef === pandsku.sku.extRef ? "primary" : undefined}
                                                            sx={{padding: "7px", mr: "7px", mb: "7px"}}>
                                                            {pandsku.sku.name}
                                                        </BazarButton>
                                                    </Box>
                                                }
                                            </>
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
                                    {formatPrice(productAndSku.sku?.price)} {currency}
                                </h2>
                            </Box>
                            <MdRender content={product.shortDescription}/>

                            {options && options.length > 0 && !getFirstRestriction() &&

                                <ProductSelector options={options}
                                                 productAndSku={productAndSku}
                                                 setterSkuEdit={setProductAndSku}
                                                 skuEdit={productAndSku}
                                                 setterValid={setValid}
                                                 setterInvalidIds={setInvalidIds}
                                                 valid={valid}
                                                 currency={currency}
                                                 lineNumber={lineNumber}
                                                 initialItem={getInitialItem()}
                                />
                            }

                            {/*<p>{JSON.stringify(productAndSku || {})}</p>*/}
                            {!disableAdd &&
                                <div style={{
                                    width: '100%',
                                    position: 'sticky',
                                    bottom: '-20px',
                                    backgroundColor: grey["100"],
                                }}>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Box>
                                            {invalidIds.length == 0 ?
                                                getAddButton()
                                                :
                                                <a href={"#selector" + invalidIds[0]}>
                                                    {getAddButton()}
                                                </a>
                                            }

                                            {/*<p>{JSON.stringify(productAndSku?.sku)}</p>*/}
                                        </Box>


                                        {faceBookShare && !disableFacebook && getUrl() &&
                                            <Box ml={2} mt={"16px"}>
                                                <Tooltip title={localStrings.shareOnFacebook}>
                                                    <FacebookShareButton url={getUrl()}>
                                                        <FacebookIcon size={38} round={false}/>
                                                    </FacebookShareButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    </Box>
                                </div>
                            }
                        </Grid>
                    </Grid>
                    :
                    <CircularProgress />
                }
            </Box>
        </>
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
