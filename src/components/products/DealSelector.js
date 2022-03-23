import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import {ALL_CAT} from "@component/products/ProductCard1List";
import Stepper from "@component/stepper/Stepper";
import {Box} from "@material-ui/system";
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import cloneDeep from "clone-deep";
import {useRouter} from "next/router";
import {addDealToCart} from "../../util/cartUtil";
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
        if (!productAndSkusLine.price && line.pricingEffect !== PRICING_EFFECT_FIXED_PRICE) {
            line.pricingValue = "";
            continue;
        }
        let priceLineF = parseFloat(line.pricingValue);
        let priceProduct = parseFloat(productAndSkusLine.price);
        if (line.pricingEffect === PRICING_EFFECT_UNCHANGED) {
            line.pricingValue = priceProduct;
            continue;
        }
        else if (line.pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
            productAndSkusLine.price = priceLineF;
            line.pricingValue = parseFloat(priceLineF);
        }
        else if (line.pricingEffect === PRICING_EFFECT_PRICE) {
            productAndSkusLine.price = Math.max(priceProduct -  priceLineF, 0).toFixed(2);
            line.pricingValue = parseFloat(productAndSkusLine.price);
        }
        else if (line.pricingEffect === PRICING_EFFECT_PERCENTAGE) {
            let factor = 1 - priceLineF / 100
            let priceComputed = (priceProduct * factor).toFixed(2);
            productAndSkusLine.price = priceComputed;
            line.pricingValue = (priceProduct * factor);
        }
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
    const width = useWindowSize()
    const classes = useStyles();
    const router = useRouter()
    const {addToast} = useToasts()
    const [currentLine, setCurrentLine] = useState(0)
    const [confirmDealDialogOpen, setConfirmDealDialogOpen] = useState(false)
    const [skuRefs, setSkuRefs] = useState([])
    const {setDealEdit, dealEdit, getOrderInCreation, setOrderInCreation, resetOrderInCreation} = useAuth();

    useEffect(() => {
        if (deal && deal.lines && deal.lines.length > 0 && deal.lines[currentLine] && deal.lines[currentLine].skus) {
            let skusInLine = deal.lines[currentLine].skus.map(sku => sku.extRef)
            setSkuRefs(skusInLine);
        }

    }, [currentLine])

    useEffect(() => {
        if (deal) {
            setDealEdit({deal: cloneDeep(deal)})
        }
    }, [])

    useEffect( () => {
        if (dealEdit && dealEdit.productAndSkusLines && deal.lines.length > 0 &&
            deal.lines.length === dealEdit.productAndSkusLines.length) {
            setConfirmDealDialogOpen(true);
        }
    }, [dealEdit])



    function getStepperList() {
        return deal && deal.lines && deal.lines.map((line, index) => {
                return(
                    {
                        index: index,
                        title: line.name,
                        disabled: false
                    })
            }
        );
    }

    const handleStepChange = (step) => {
        setCurrentLine(step)
    }

    function isProductSelectedInLine() {
        return dealEdit && dealEdit.productAndSkusLines &&
            dealEdit.productAndSkusLines.some(productAndSkusLine => productAndSkusLine.lineNumber == currentLine)
    }

    function addMenuToCart() {
        addDealToCart(setGlobalDialog, dealEdit, getOrderInCreation, setOrderInCreation);
        setDealEdit(null);
        router.push("/cart")
    }

    function cancelDeal() {
        setDealEdit(null);
        resetOrderInCreation();
        router.push("/product/shop/all")
    }

    return (
        <div>
            {/*<p>{deal && deal.lines? deal.lines.length : 0}</p>*/}
            {/*<p>{dealEdit && dealEdit.productAndSkusLines ? dealEdit.productAndSkusLines.length: 0}</p>*/}


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
                            addMenuToCart();
                        }}
                    >
                        {localStrings.addMenuToCart}
                    </Button>
                </DialogActions>
            </Dialog>

            {/*<h1>{currentLine}</h1>*/}
            {/*<p>{JSON.stringify(dealEdit)}</p>*/}
            {/*<p>{JSON.stringify(skuRefs)}</p>*/}
            {/*<p>{dealEdit ? JSON.stringify(dealEdit.productAndSkusLines) : ""}</p>*/}
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

                            <Box p={1} >
                                {dealEdit && dealEdit.productAndSkusLines && dealEdit.productAndSkusLines.length === deal.lines.length &&
                                <Button variant="contained" color="primary" onClick={addMenuToCart}>
                                    {localStrings.addMenuToCart}
                                </Button>
                                }
                                {dealEdit && dealEdit.productAndSkusLines && dealEdit.productAndSkusLines.length !== deal.lines.length &&
                                isProductSelectedInLine() &&
                                <BazarButton variant="contained" color="primary" onClick={() => setCurrentLine(currentLine + 1)}>
                                    {localStrings.next}
                                </BazarButton>
                                }
                            </Box>
                        </Box>
                    </div>
                </Grid>
            </Box>
        </div>
    )
}

export default DealSelector