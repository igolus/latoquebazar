import React, {useEffect, useState} from 'react';
import {Button, Grid} from "@material-ui/core";
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
import {setActiveLink} from "react-scroll/modules/mixins/scroller";

function DealSelector({ deal, contextData }) {


    const router = useRouter()
    const {addToast} = useToasts()
    const [currentLine, setCurrentLine] = useState(0)
    const [skuRefs, setSkuRefs] = useState([])
    const {setDealEdit, dealEdit, orderInCreation, setOrderInCreation, resetOrderInCreation} = useAuth();

    useEffect(() => {
        let skusInLine = deal.lines[currentLine].skus.map(sku => sku.extRef)
        setSkuRefs(skusInLine);
    }, [currentLine])


    useEffect( () => {
        if (dealEdit && dealEdit.productAndSkusLines) {
            let providedLineNumbers = dealEdit.productAndSkusLines.map(line => line.lineNumber);

            if (providedLineNumbers.length == deal.lines.length) {
                return;
            }
            //alert("providedLineNumbers " + providedLineNumbers)
            let lines = [];
            //alert("deal.lines " + deal.lines.length)
            for (let i=0;i<deal.lines.length;i++) {
                lines.push(i)
            }
            //alert("lines " + lines)
            let firstLine = lines.find(line => !providedLineNumbers.includes(line)) || 0;
            setCurrentLine(firstLine);
        }
    }, [dealEdit])

    useEffect(() => {
        setDealEdit({deal: cloneDeep(deal)})
    }, [])

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
        return dealEdit.productAndSkusLines &&
            dealEdit.productAndSkusLines.some(productAndSkusLine => productAndSkusLine.lineNumber == currentLine)
    }

    function addMenuToCart() {
        addDealToCart(dealEdit, orderInCreation, setOrderInCreation, addToast);
        router.push("/cart")
    }

    function cancelDeal() {
        resetOrderInCreation();
        router.push("/product/shop/all")
    }

    return (
        <div>
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
                    <div style={{ width: '100%' }}>
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
                                <Button variant="contained" color="primary" onClick={() => setCurrentLine(currentLine + 1)}>
                                    {localStrings.next}
                                </Button>
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