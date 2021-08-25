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


const useStyles = makeStyles(() => ({
    backDrop: {
        backdropFilter: "blur(5px)",
        backgroundColor:'rgba(0,0,30,0.4)'
    },
    dialogContent: {
        paddingBottom: '1.25rem',
    },
}))

function DealSelector({ deal, contextData }) {

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
        addDealToCart(dealEdit, getOrderInCreation, setOrderInCreation, addToast);
        setDealEdit(null);
        //router.push("/cart")
    }

    function cancelDeal() {
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
                    {/*<ProductIntro imgUrl={[imgUrl]} title={title} price={price}*/}
                    {/*              skuIndex={selectedSkuIndex}*/}
                    {/*              product={product}*/}
                    {/*              options={options}*/}
                    {/*              currency={currency}*/}
                    {/*              addCallBack={() => setOpen(false)}*/}
                    {/*/>*/}
                    {/*<IconButton*/}
                    {/*    sx={{ position: 'absolute', top: '0', right: '0' }}*/}
                    {/*    onClick={toggleDialog}*/}
                    {/*>*/}
                    {/*    <Close className="close" fontSize="small" color="primary" />*/}
                    {/*</IconButton>*/}
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