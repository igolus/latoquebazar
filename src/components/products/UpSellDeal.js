import React, {useEffect} from 'react';
import {ALL_CAT} from "@component/products/ProductCard1List";
import ProductDealCard1List from "@component/products/ProductDealCard1List";
import {getBrandCurrency, getPriceDeal, getSkusListsFromProducts} from "../../util/displayUtil";
import {H2} from "@component/Typography";
import localStrings from "../../localStrings";
import Box from "@material-ui/core/Box";
import {Button} from "@material-ui/core";
import cloneDeep from "clone-deep";
import {applyDealPrice} from "@component/products/DealSelector";
import {PRICING_EFFECT_PERCENTAGE} from "../../util/constants";

export function isDealValuable(candidateDeal, contextData) {
    if (!contextData) {
        return false;
    }
    let allSkus = getSkusListsFromProducts(contextData?.products || []).data;

    let skusToPropose = candidateDeal.candidate.deal.lines[candidateDeal.missingLineNumber].skus;
    let priceItemsWithoutDeal = candidateDeal.priceItemsWithoutDeal;
    let priceDeal = getPriceDeal(candidateDeal.candidate.deal);
    let skuExtRefToExclude = [];
    if (priceDeal) {
        for (let i = 0; i < skusToPropose.length; i++) {
            let skuToPropose = skusToPropose[i];
            let skuProduct = allSkus.find(sku=>sku.extRef === skuToPropose.extRef)
            let priceWithoutDeal = priceItemsWithoutDeal + parseFloat(skuProduct?.price || 0);
            //let priceWithoutDeal = priceItemsWithoutDeal + parseFloat(skuToPropose.price);
            if (priceWithoutDeal < priceDeal) {
                skuExtRefToExclude.push(skuToPropose.extRef)
            }
        }
    }
    else {
        for (let i = 0; i < skusToPropose.length; i++) {
            let skuToPropose = skusToPropose[i];
            let skuProduct = allSkus.find(sku=>sku.extRef === skuToPropose.extRef)
            let priceWithoutDeal = priceItemsWithoutDeal + parseFloat(skuProduct?.price || 0);
            //let priceWithoutDeal = priceItemsWithoutDeal + parseFloat(skuToPropose.price);
            let candidateClone = cloneDeep(candidateDeal.candidate);
            candidateClone.productAndSkusLines[candidateDeal.missingLineNumber] = skuToPropose;
            candidateClone.deal.lines[candidateDeal.missingLineNumber] = candidateDeal.missingLine;


            candidateClone = applyDealPrice(candidateClone);
            let priceDeal = getPriceDeal(candidateClone.deal);
            if (priceWithoutDeal < priceDeal) {
                skuExtRefToExclude.push(skuToPropose.extRef)
            }
        }
    }

    return skuExtRefToExclude.length !== skusToPropose.length
}

function UpSellDeal({candidateDeal, contextData, currency, selectCallBack, cancelCallBack, orderInCreation}) {
    let allSkus = getSkusListsFromProducts(contextData?.products || []).data;
    let boxRef = React.createRef()
    let skusToPropose = candidateDeal.candidate.deal.lines[candidateDeal.missingLineNumber].skus || [];
    let priceItemsWithoutDeal = candidateDeal.priceItemsWithoutDeal;
    let skusInLine = (skusToPropose).map(sku => sku.extRef);

    let priceDeal = getPriceDeal(candidateDeal.candidate.deal);
    let priceBySkuId = {};
    let skuExtRefToExclude = [];

    let pricingValuePercent;
    if (orderInCreation && orderInCreation.discounts && orderInCreation.discounts.length === 1) {
        let firstDic = orderInCreation.discounts[0];
        if (firstDic.pricingEffect === PRICING_EFFECT_PERCENTAGE) {
            pricingValuePercent = parseFloat(firstDic.pricingValue);
            priceDeal = priceDeal - priceDeal * (pricingValuePercent / 100)
        }

        console.log(firstDic)
    }

    // if (!priceDeal) {
    for (let i = 0; i < skusToPropose.length; i++) {
        let skuToPropose = skusToPropose[i];
        let skuProduct = allSkus.find(sku=>sku.extRef === skuToPropose.extRef)
        let priceWithoutDeal = priceItemsWithoutDeal + parseFloat(skuProduct?.price || 0);
        let candidateClone = cloneDeep(candidateDeal.candidate);
        candidateClone.productAndSkusLines[candidateDeal.missingLineNumber] = skuToPropose;
        candidateClone.deal.lines[candidateDeal.missingLineNumber] = candidateDeal.missingLine;


        candidateClone = applyDealPrice(candidateClone);
        let priceDealInSku = getPriceDeal(candidateClone.deal);
        if (pricingValuePercent) {
            priceDealInSku = priceDealInSku - priceDealInSku * (pricingValuePercent / 100)
        }

        if (priceWithoutDeal < priceDealInSku) {
            skuExtRefToExclude.push(skuToPropose.extRef)
        }
        priceBySkuId[skuToPropose.extRef] = priceDealInSku;
    }

    console.log("priceBySkuId " + JSON.stringify(priceBySkuId));

    skusInLine = skusInLine.filter(sku => !skuExtRefToExclude.includes(sku))

    let priceDiff = priceDeal && (priceDeal - candidateDeal.priceItemsWithoutDeal);
    //setSkuRefs(skusInLine);

    function skuSelected(selectedProductAndSku) {
        if (selectCallBack) {
            selectCallBack(selectedProductAndSku)
        }
        // setSelectedProductAndSku(selectedProductAndSku)
    }

    useEffect(() => {

            boxRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            //boxRef.current.scrollTo(0, 0);
        },
        [candidateDeal]
    )

    return (
        <div ref={boxRef}>
            <Box width="100%" >
                {/*<p>{JSON.stringify(skusInLine)}</p>*/}
                {/*<p>{JSON.stringify(priceBySkuId)}</p>*/}

                {priceDiff ?
                    <H2 mb={2}>
                        {localStrings.formatString(localStrings.specialOffer
                            , candidateDeal.candidate.deal.name, priceDiff.toFixed(2) + " " + getBrandCurrency(contextData.brand))}
                    </H2>
                    :
                    <H2 mb={2}>
                        {localStrings.formatString(localStrings.specialOfferNoSavePrice, candidateDeal.candidate.deal.name)}
                    </H2>
                }


                <ProductDealCard1List
                    xps={6}
                    priceItemsWithoutDeal={candidateDeal.priceItemsWithoutDeal}
                    priceDiff={priceDiff}
                    priceBySkuId={priceBySkuId}
                    deal={candidateDeal.candidate.deal}
                    lineNumber={candidateDeal.missingLineNumber}
                    restrictedskuRefs = {skusInLine}
                    modeFullScren={true}
                    //filter={filter} query={query}
                    category={ALL_CAT} contextData={contextData}
                    selectCallBack={(selectedProductAndSku) => skuSelected(selectedProductAndSku)}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Button
                        variant={"outlined"}
                        onClick={() => cancelCallBack && cancelCallBack()}
                    >
                        {localStrings.noThanks}

                    </Button>
                    {/*<p>*/}
                    {/*    <p>{JSON.stringify(candidateDeal)}</p>*/}
                    {/*</p>*/}
                </Box>
            </Box>
        </div>
    );
}

export default UpSellDeal;