import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import {ALL_CAT} from "@component/products/ProductCard1List";
import Stepper from "@component/stepper/Stepper";
import {Box} from "@material-ui/system";
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import cloneDeep from "clone-deep";
import {useRouter} from "next/router";
import {addDealToCart, updateDealInCart} from "../../util/cartUtil";
import ProductDealCard1List from "@component/products/ProductDealCard1List";
import {useToasts} from "react-toast-notifications";
import {makeStyles} from "@material-ui/styles";
import MiniCartDeal from "@component/mini-cart/MiniCartDeal";
import BazarButton from "@component/BazarButton";
import theme from '@theme/theme'
import useWindowSize from "@hook/useWindowSize";
import {
    PRICING_EFFECT_FIXED_PRICE,
    PRICING_EFFECT_PERCENTAGE,
    PRICING_EFFECT_PRICE,
    PRICING_EFFECT_UNCHANGED,
    WIDTH_DISPLAY_MOBILE
} from "../../util/constants";

export function applyDealPrice(deal) {
    if (deal.deal.lines.length !== deal.productAndSkusLines.length) {
        return null;
    }
    let dealWithPriceUpdated = {...deal}

    let lines = dealWithPriceUpdated.deal.lines;
    let productAndSkusLines = dealWithPriceUpdated.productAndSkusLines;
    if (!lines) {
        return;
    }
    for (let i=0; i<lines.length;i++) {
        let line = lines[i]
        line.quantity = 1;
        let productAndSkusLine = productAndSkusLines[i];
        let priceLineF = parseFloat(line.pricingValue);
        // if (line.pricingEffect === PRICING_EFFECT_PERCENTAGE && line.pricingValue === "100") {
        //     line.pricingValue = 0;
        //     continue;
        // }

        // if (!productAndSkusLine.price && line.pricingEffect !== PRICING_EFFECT_FIXED_PRICE) {
        //     line.pricingValue = "";
        //     continue;
        // }

        let priceProduct = parseFloat(productAndSkusLine.price || 0);
        // if (!line.initialPrice) {
        //     line.initialPrice = parseFloat(productAndSkusLine.price);
        // }

        if (line.pricingEffect === PRICING_EFFECT_UNCHANGED) {
            line.pricingValueAfterDisc = priceProduct;
            continue;
        }
        else if (line.pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
            productAndSkusLine.price = priceLineF;
            line.pricingValueAfterDisc = parseFloat(priceLineF);
        }
        else if (line.pricingEffect === PRICING_EFFECT_PRICE) {
            productAndSkusLine.price = Math.max(priceProduct -  priceLineF, 0).toFixed(2);
            line.pricingValueAfterDisc = parseFloat(productAndSkusLine.price);
        }
        else if (line.pricingEffect === PRICING_EFFECT_PERCENTAGE) {
            let factor = 1 - priceLineF / 100
            let priceComputed = (priceProduct * factor).toFixed(2);
            productAndSkusLine.price = priceComputed;
            line.pricingValueAfterDisc = priceComputed;
        }
        line.pricingValueAfterDisc = parseFloat(line.pricingValueAfterDisc);
        productAndSkusLine.nonDiscountedPrice = productAndSkusLine.price.toString();

    }
    console.log("dealWithPriceUpdated " + JSON.stringify(dealWithPriceUpdated, null,2))
    return dealWithPriceUpdated;
}


const useStyles = makeStyles((palette) => ({
    backDrop: {
        backdropFilter: "blur(5px)",
        backgroundColor:'rgba(0,0,30,0.4)'
    },
    dialogContent: {
        paddingBottom: '1.25rem',
    }
}))

function DealSelector({ deal, contextData }) {

    // let params = {};
    // let openMiniCartDealAtStart;
    // try {
    //     params = new URLSearchParams(window.location.search)
    //     openMiniCartDealAtStart = params.get("openMiniCartDealAtStart")
    // }
    // catch (err) {
    //
    // }

    // useEffect(() => {
    //   if (openMiniCartDealAtStart) {
    //       setConfirmDealDialogOpen(true);
    //   }
    // }, [openMiniCartDealAtStart])
    const width = useWindowSize()
    const classes = useStyles();
    const router = useRouter()
    const {addToast} = useToasts()
    const [currentLine, setCurrentLine] = useState(0)
    //const [confirmDealDialogOpen, setConfirmDealDialogOpen] = useState(false)
    const [confirmDealDialogOpen, setConfirmDealDialogOpen] = useState(false)
    const [updateMode, setUpdateMode] = useState(false)
    const [skuRefs, setSkuRefs] = useState([])
    const {setDealEdit, dealEdit, getOrderInCreation, setOrderInCreation, resetOrderInCreation, setGlobalDialog} = useAuth();

    useEffect(() => {
        if (deal && getLines().length > 0 && getLines()[currentLine] && getLines()[currentLine].skus) {
            let skusInLine = getLines()[currentLine].skus.map(sku => sku.extRef)
            setSkuRefs(skusInLine);
        }

    }, [currentLine])

    useEffect(() => {
        if (deal.deal) {
            setDealEdit(cloneDeep(deal));
            setUpdateMode(true);
        }
        else if (deal) {
            setDealEdit({deal: cloneDeep(deal)})
        }
    }, [])

    useEffect( () => {
        if (dealEdit && dealEdit.productAndSkusLines && getLines().length > 0 &&
            getLines().length === dealEdit.productAndSkusLines.length) {
            setConfirmDealDialogOpen(true);
        }
    }, [dealEdit])



    function getStepperList() {
        if (deal && deal.lines) {
            return deal.lines.map((line, index) => {
                    return(
                        {
                            index: index,
                            title: line.name,
                            disabled: false
                        })
                }
            );
        }
        if (deal && deal.deal && deal.deal.lines) {
            return deal.deal.lines.map((line, index) => {
                    return(
                        {
                            index: index,
                            title: line.name,
                            disabled: false
                        })
                }
            );
        }

    }

    const handleStepChange = (step) => {
        setCurrentLine(step)
    }

    function isProductSelectedInLine() {
        return dealEdit && dealEdit.productAndSkusLines &&
            dealEdit.productAndSkusLines.some(productAndSkusLine => productAndSkusLine.lineNumber == currentLine)
    }

    function addUpdateMenuToCart() {
        if (updateMode) {
            updateDealInCart(setGlobalDialog, dealEdit, getOrderInCreation(), setOrderInCreation);
        }
        else {
            addDealToCart(setGlobalDialog, dealEdit, getOrderInCreation(), setOrderInCreation);
        }
        router.push("/cart")
        setDealEdit(null);
    }

    function cancelDeal() {
        setDealEdit(null);
        //resetOrderInCreation();
        router.push("/product/shop/all")
    }

    function getLines() {
        if (!deal?.lines && !deal?.deal?.lines) {
            return [];
        }
        return deal.lines || deal.deal.lines;
    }

    return (
        <div>
            <Dialog
                BackdropProps={{
                    classes: {
                        root: classes.backDrop,
                    },
                }}
                open={confirmDealDialogOpen}
                maxWidth={false}
                onClose={() => setConfirmDealDialogOpen(false)}>

                <DialogTitle>{localStrings.contentDeal}</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <MiniCartDeal contextData={contextData}
                                  updateMode={updateMode}
                                  setterLine={setCurrentLine}
                                  closeCallBack={() => setConfirmDealDialogOpen(false)}/>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setConfirmDealDialogOpen(false);
                            cancelDeal();
                        }}
                    >
                        {localStrings.cancel}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setConfirmDealDialogOpen(false);
                            addUpdateMenuToCart();
                        }}
                    >
                        {updateMode ? localStrings.updateCart : localStrings.addMenuToCart}
                    </Button>
                </DialogActions>
            </Dialog>
            <Box mb={3}>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Stepper
                            //activeStep={currentLine}
                            stepperList={getStepperList()}
                            selectedStep={currentLine + 1}
                            onChange={handleStepChange}
                        />
                    </Grid>

                    <Grid item lg={12} xs={12}>
                        <ProductDealCard1List
                            deal={deal}
                            lineNumber={currentLine}
                            restrictedskuRefs = {skuRefs}
                            modeFullScren={true}
                            //filter={filter} query={query}
                            category={ALL_CAT} contextData={contextData}/>
                    </Grid>
                    <div style={{
                        width: '100%',
                        position: 'sticky',
                        bottom: width <= WIDTH_DISPLAY_MOBILE ? '60px' : '0px',
                        backgroundColor: theme.palette.background.default
                        //backgroundColor: "blue"
                    }} >
                        <Box display="flex" justifyContent="flex-end" m={1} p={1} >
                            <Box p={1} >
                                <Button variant="contained" color="primary" onClick={cancelDeal}>
                                    {localStrings.cancel}
                                </Button>
                            </Box>

                            {!updateMode &&
                                <Box p={1}>
                                    {dealEdit && dealEdit.productAndSkusLines && dealEdit.productAndSkusLines.length === getLines().length &&
                                        <Button variant="contained" color="primary" onClick={addUpdateMenuToCart}>
                                            {localStrings.addMenuToCart}
                                        </Button>
                                    }
                                    {dealEdit && dealEdit.productAndSkusLines && dealEdit.productAndSkusLines.length !== getLines().length &&
                                        isProductSelectedInLine() &&
                                        <BazarButton variant="contained" color="primary"
                                                     onClick={() => setCurrentLine(currentLine + 1)}>
                                            {localStrings.next}
                                        </BazarButton>
                                    }
                                </Box>
                            }
                        </Box>
                    </div>
                </Grid>
            </Box>
        </div>
    )
}

export default DealSelector