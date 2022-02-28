import React, {useState} from 'react';
import {ALL_CAT} from "@component/products/ProductCard1List";
import ProductDealCard1List from "@component/products/ProductDealCard1List";
import {getProductSkuLength} from "@component/product-cards/ProductCard1";
import {formatProductAndSkuName, getBrandCurrency, getPriceDeal} from "../../util/displayUtil";
import {H1, H2} from "@component/Typography";
import localStrings from "../../localStrings";
import Box from "@material-ui/core/Box";
import {Button} from "@material-ui/core";
import cloneDeep from "clone-deep";
import {applyDealPrice} from "@component/products/DealSelector";


function UpSellDeal({candidateDeal, contextData, currency, selectCallBack, cancelCallBack}) {

    let skusToPropose = candidateDeal.canditate.deal.lines[candidateDeal.missingLineNumber].skus;
    let skusInLine = skusToPropose.map(sku => sku.extRef)
    let priceDeal = getPriceDeal(candidateDeal.canditate.deal);
    let priceBySkuId = {};
    if (!priceDeal) {
        for (let i = 0; i < skusToPropose.length; i++) {
            let skuToPropose = skusToPropose[i];
            let candidateClone = cloneDeep(candidateDeal.canditate);
            candidateClone.productAndSkusLines[candidateDeal.missingLineNumber] = skuToPropose;
            candidateClone.deal.lines[candidateDeal.missingLineNumber] = candidateDeal.missingLine;
            candidateClone = applyDealPrice(candidateClone);
            let priceDeal = getPriceDeal(candidateClone.deal);
            priceBySkuId[skuToPropose.extRef] = priceDeal;
        }

        console.log("priceBySkuId " + JSON.stringify(priceBySkuId));

        // const notSetproductAndSkusLines = candidateDeal.canditate.productAndSkusLines.find(pandsku => pandsku.notSet)
        // console.log("No price deal " + notSetproductAndSkusLines)
    }

    let priceDiff = priceDeal && (priceDeal - candidateDeal.priceItemsWithoutDeal);
    //setSkuRefs(skusInLine);

    function skuSelected(selectedProductAndSku) {
        if (selectCallBack) {
            selectCallBack(selectedProductAndSku)
        }
        // setSelectedProductAndSku(selectedProductAndSku)
    }

    return (
        <Box width="100%">
            {/*<p>{JSON.stringify(skusInLine)}</p>*/}
            {/*<p>{JSON.stringify(priceBySkuId)}</p>*/}

            {priceDiff ?
                <H2 mb={2}>
                    {localStrings.formatString(localStrings.specialOffer
                        , candidateDeal.canditate.deal.name, priceDiff.toFixed(2) + " " + getBrandCurrency(contextData.brand))}
                </H2>
                :
                <H2 mb={2}>
                    {localStrings.formatString(localStrings.specialOfferNoSavePrice, candidateDeal.canditate.deal.name)}
                </H2>
            }


            <ProductDealCard1List
                xps={6}
                priceItemsWithoutDeal={candidateDeal.priceItemsWithoutDeal}
                priceDiff={priceDiff}
                priceBySkuId={priceBySkuId}
                deal={candidateDeal.canditate.deal}
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
    );
}

export default UpSellDeal;