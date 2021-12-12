import moment from "moment";
import {report} from "next/dist/telemetry/trace/report";
import cloneDeep from "clone-deep";
import {
    PRICING_EFFECT_FIXED_PRICE,
    PRICING_EFFECT_PERCENTAGE,
    PRICING_EFFECT_PRICE,
    TYPE_DEAL,
    TYPE_PRODUCT
} from "./constants";
import localStrings from "../localStrings";
import {
    computePriceDetail,
    displayDow,
    displayService,
    formatOrderConsumingMode,
    getBrandCurrency, getMinutesFromDate, getMinutesFromHour
} from "./displayUtil";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {itemRestrictionMax} from "@component/mini-cart/MiniCart";
import {getChargeQueryNoApollo} from "../gqlNoApollo/chargeGqlNoApollo";
import {executeQueryUtil, executeQueryUtilSync} from "../apolloClient/gqlUtil";
import {getChargesQuery} from "../gql/chargesGql";
import {setGlobal} from "next/dist/telemetry/trace";
const { uuid } = require('uuidv4');

export function getCartItems(orderInCreation, excludeRestriction) {

    if (!orderInCreation() || !orderInCreation().order) {
        return [];
    }
    let allItems = [];
    if (orderInCreation().order.items) {
        orderInCreation().order.items.forEach(item => {
            if (!excludeRestriction || (item.restrictionsApplied || []).length == 0)
            {
                allItems.push({...item, type: TYPE_PRODUCT})
            }
        })

        //allItems.concat(orderInCreation().order.items.sort((i1,i2) => i1.creationTimestamp - i2.creationTimestamp));
    }
    //alert(orderInCreation().order.deals.length)
    if (orderInCreation().order.deals) {
        orderInCreation().order.deals.forEach(deal => {
            if (!excludeRestriction || (deal.restrictionsApplied || []).length == 0) {
                allItems.push({...deal, type: TYPE_DEAL})
            }
        })
        //allItems.concat(orderInCreation().order.deals);
    }

    //alert(allItems.length)
    try {
        allItems.sort((i1, i2) => i1.creationTimestamp - i2.creationTimestamp);
    }
    catch (err) {
        console.log(err);
    }

    //let items = orderInCreation().order.items.sort((i1,i2) => i1.creationTimestamp - i2.creationTimestamp);
    // let orders = orderInCreation().order.orders;
    return allItems;
}

export function decreaseDealCartQte(orderInCreation, setOrderInCreation, uuid, contextData) {
    let itemIoChange = orderInCreation.order.deals.find(deal => deal.uuid === uuid);

    if (!itemIoChange) {
        return;
    }
    let others = orderInCreation.order.deals.filter(deal => deal.uuid !== uuid);

    let items = [];
    if (orderInCreation.order.items) {
        items = [...orderInCreation.order.items]
    }

    if (itemIoChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation,
            order: {
                items: items,
                deals: [...others]
            }
        });
        itemIoChange.quantity--;
        return;
    }

    itemIoChange.quantity--;
    setOrderInCreation({
        ...orderInCreation,
        order: {
            items: items,
            deals: [...others, {...itemIoChange}]
        }
    });
}

export function increaseDealCartQte(orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation.order.deals.find(deal => deal.uuid === uuid);
    let others = orderInCreation.order.deals.filter(deal => deal.uuid !== uuid);

    let items = [];
    if (orderInCreation.order.items) {
        items = [...orderInCreation.order.items]
    }

    itemIoChange.quantity++;

    setOrderInCreation({
        ...orderInCreation,
        order: {
            items: items,
            deals: [...others, {...itemIoChange}]
        }
    });
}


export function decreaseCartQte(orderInCreation, setOrderInCreation, uuid, contextData) {
    let itemIoChange = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);
    let others = orderInCreation.order.items.filter(itemOrder => itemOrder.uuid !== uuid);

    let deals = [];
    if (orderInCreation.order.deals) {
        deals = [...orderInCreation.order.deals]
    }

    if (itemIoChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation,
            order: {
                items: [...others],
                deals: deals
            }
        });
        itemIoChange.quantity--;
        return;
    }

    itemIoChange.quantity--;
    setOrderInCreation({
        ...orderInCreation,
        order: {
            items: [...others, {...itemIoChange}],
            deals: deals
        }
    });
}

export function increaseCartQte(orderInCreation, setOrderInCreation, uuid, contextData) {
    let itemIoChange = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);
    let others = orderInCreation.order.items.filter(itemOrder => itemOrder.uuid !== uuid);
    itemIoChange.quantity++;

    let deals = [];
    if (orderInCreation.order.deals) {
        deals = [...orderInCreation.order.deals]
    }

    setOrderInCreation({
        ...orderInCreation,
        order: {
            items: [...others, {...itemIoChange}],
            deals: deals
        }
    });
}

function checkOrderInCreation (orderInCreation) {
    return orderInCreation() && orderInCreation().order
}

export function deleteItemInCart(orderInCreation, setOrderInCreation, uuid) {
    if (!orderInCreation || !orderInCreation().order) {
        return
    }

    let deals = [];
    if (orderInCreation().order.deals) {
        deals = [...orderInCreation().order.deals]
    }

    let others = orderInCreation().order.items.filter(itemOrder => itemOrder.uuid !== uuid);
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: [...others],
            deals: deals
        }
    });
}

export function deleteDealInCart(orderInCreation, setOrderInCreation, uuid) {
    //alert("uuid " + uuid);
    if (!orderInCreation || !orderInCreation().order) {
        return
    }

    let items = [];
    if (orderInCreation().order.items) {
        items = [...orderInCreation().order.items]
    }

    let others = orderInCreation().order.deals.filter(deal => deal.uuid !== uuid);
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: items,
            deals: [...others]
        }
    });
}

function sameItem(item, itemToAdd, optionsInit) {
    let sameProduct = item.extRef === itemToAdd.extRef;
    let optionsItem = (item.options || []).map(option => option.ref)
        .sort((o1, o2) => o2 < o1 ? 1 : 0);
    return sameProduct && JSON.stringify(optionsItem) === JSON.stringify(optionsInit);
}

export function selectToDealEditOrder(productAndSku, dealEdit, setDealEdit, lineNumber) {
    let price;
    let pricingEffect = dealEdit.deal.lines[lineNumber].pricingEffect;
    let pricingValue = dealEdit.deal.lines[lineNumber].pricingValue;

    if (pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
        price = pricingValue;
    }
    else if (pricingEffect === PRICING_EFFECT_PRICE) {
        price = Math.max(parseFloat(productAndSku.sku.price) -  parseFloat(pricingValue), 0).toFixed(2);
    }
    else if (pricingEffect === PRICING_EFFECT_PERCENTAGE) {
        let factor = 1 - parseFloat(pricingValue) / 100
        price = (parseFloat(productAndSku.sku.price) * factor).toFixed(2);
    }


    let itemToAdd = { ...productAndSku.sku}
    itemToAdd.price = price;
    itemToAdd.quantity = 1;
    itemToAdd.productName = productAndSku.product.name;
    itemToAdd.productId = productAndSku.product.id;
    itemToAdd.creationTimestamp = moment().unix();
    itemToAdd.options =  productAndSku.options || [];
    itemToAdd.lineNumber = lineNumber;
    let dealEditClone = cloneDeep(dealEdit);
    if (!dealEditClone.productAndSkusLines) {
        dealEditClone.productAndSkusLines = [];
    }

    // alert(JSON.stringify(...dealEditClone.productAndSkusLines.filter(sku => sku.lineNumber != lineNumber)));
    // alert("TOTO");
    // alert(lineNumber);

    setDealEdit({
        ...dealEdit,
        productAndSkusLines: [
            ...dealEditClone.productAndSkusLines.filter(sku => sku.lineNumber !== lineNumber),
            itemToAdd,
        ]
    })
}

export function addDealToCart(deal, orderInCreation, setOrderInCreation, addToast, contextData) {
    // let dealToAdd = {
    //     deal: {...deal},
    //     creationTimestamp:moment().unix()
    // }
    let dealToAdd = {...deal}
    dealToAdd.creationTimestamp = moment().unix();
    let items = [];
    if (orderInCreation().order.items) {
        items = [...orderInCreation().order.items]
    }

    let existing = false;
    let productAndSkusLinesInit = dealToAdd.productAndSkusLines.sort((o1, o2) => o2.extRef < o2.extRef ? 1:0);

    if (orderInCreation() && orderInCreation().order && orderInCreation().order.deals) {
        existing = orderInCreation().order.deals.find(deal => {
            let productAndSkusLines =
                deal.productAndSkusLines.sort((o1, o2) => o2.extRef < o2.extRef ? 1:0)

            if (productAndSkusLines.length !== productAndSkusLinesInit.length) {
                return false;
            }

            let same = true;
            for (let i=0; i<productAndSkusLinesInit.length;i++) {
                let product = productAndSkusLinesInit[i];

                let optionsInit = (product.options  || []).map(option => option.ref)
                    .sort((o1, o2) => o2 < o1 ? 1:0)
                same &= sameItem(productAndSkusLines[i], product, optionsInit);
            }

            return same;
            //return sameItem(item, itemToAdd, optionsInit);
        })
    }

    if (existing) {
        let others = orderInCreation().order.deals.filter(deal => deal.uuid !== existing.uuid);
        existing.quantity ++;
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: items,
                deals: [...others, existing],
            }
        })
        if (addToast) {
            //addToast(localStrings.notif.dealAddedToCart, { appearance: 'success', autoDismiss: true});
        }

        return;
    }

    dealToAdd.quantity = 1;
    dealToAdd.uuid = uuid();
    if (orderInCreation().order.deals) {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: items,
                deals: [...orderInCreation().order.deals, dealToAdd],
            }
        })
    }
    else {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: items,
                deals: [dealToAdd]
            }
        })
    }
    if (addToast) {
        //addToast(localStrings.notif.dealAddedToCart, { appearance: 'success', autoDismiss: true });
    }
    //alert("addMenuToCart ")
}

export function addToCartOrder(productAndSku, orderInCreation, setOrderInCreation, addToast) {
    if (!orderInCreation || !orderInCreation()) {
        return;
    }
    // if (!checkOrderInCreation()) {
    //     return;
    // }

    let itemToAdd = { ...productAndSku.sku}
    itemToAdd.quantity = 1
    itemToAdd.productName = productAndSku.product.name;
    itemToAdd.productId = productAndSku.product.id;
    itemToAdd.creationTimestamp = moment().unix();
    itemToAdd.options =  productAndSku.options || []

    let optionsInit = (itemToAdd.options  || []).map(option => option.ref)
        .sort((o1, o2) => o2 < o1 ? 1:0)

    //check existing
    let existing;
    // alert("orderInCreation" + orderInCreation())
    // alert("orderInCreation" + orderInCreation())

    if (orderInCreation() && orderInCreation()?.order && orderInCreation().order.items) {
        existing = orderInCreation().order.items.find(item => {
            return sameItem(item, itemToAdd, optionsInit);
        })
    }

    let deals = [];
    if (orderInCreation()?.order.deals) {
        deals = [...orderInCreation().order.deals]
    }

    if (existing) {
        let others = orderInCreation()?.order.items.filter(item => item.uuid !== existing.uuid);
        existing.quantity ++;
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: [...others, existing],
                deals: deals
            }
        })
        if (addToast) {
            //addToast(localStrings.notif.productAddedToCart, { appearance: 'success', autoDismiss: true });
        }
        return;
    }
    itemToAdd.uuid = uuid();

    if (orderInCreation()?.order.items) {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: [...orderInCreation().order.items, itemToAdd],
                deals: deals
            }
        })
    }
    else {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: [itemToAdd],
                deals: deals
            }
        })
    }
    if (addToast) {
        //addToast(localStrings.notif.productAddedToCart, { appearance: 'success', autoDismiss: true });
    }
    return itemToAdd.uuid;
}

export function getQteInCart(productAndSku, orderInCreation) {

    if (!orderInCreation || !orderInCreation.order
        || !orderInCreation.order.items || !productAndSku.sku || !productAndSku.sku.extRef) {
        //alert("no orderInCreation")
        return 0;
    }

    let existing = orderInCreation.order.items.find(item => {
        return sameItem(item, productAndSku.sku, []);
    })
    //return 0;
    //alert("existing " + existing)
    if (existing) {
        return existing.quantity
    }
    return 0;
}

export function getPriceWithOptions(item, single) {

    if (item.restrictionsApplied &&
        item.restrictionsApplied.length > 0) {
        return 0;
    }

    if (!item.productAndSkusLines && !single) {
        return 0;
    }
    let tot = 0;
    //alert("single " + single)
    if (single) {
        tot += parseFloat(item.price);
        //alert("tot " + item.price)
        (item.options || []).forEach( option => tot+= parseFloat(option.price));
    }
    else {
        // item.deal.lines.forEach(line => {
        //     let totSku = parseFloat(line.pricingValue);
        //     tot += totSku;
        // })

        item.productAndSkusLines.forEach(productAndSkusLine => {
            let totSku = parseFloat(productAndSkusLine.price);
            (productAndSkusLine.options || []).forEach( option => totSku+= parseFloat(option.price));
            tot += totSku;
        })
    }

    return tot;
}

export function isProductAndSkuGetOption(productAndSku) {
    if (!productAndSku || !productAndSku.sku) {
        return false;
    }
    return productAndSku.sku && productAndSku.sku.optionListExtIds &&
        productAndSku.sku.optionListExtIds.length > 0;
}

export function buildProductAndSkusNoCheckOrderInCreation(product) {
    let allSkusWithProduct = [];
    if (product && product.skus) {
        product.skus.forEach(sku => {
            let copySku = {...sku}
            allSkusWithProduct.push({
                product: product,
                sku: copySku,
                options: []
            })
        })
    }

    return allSkusWithProduct;
}

export const RESTRICTION_DOW = "dow";
export const RESTRICTION_UNAVAILABLE = "unavailable";
export const RESTRICTION_DELIVERY = "delivery";
export const RESTRICTION_DISTANCE = "distance";
export const RESTRICTION_PRICE = "price";
export const RESTRICTION_DATE = "date";
export const RESTRICTION_HOUR = "hour";
export const RESTRICTION_MAX_ITEM = "maxitem";

function builAlertRestrictionComponent(setRedirectPageGlobal) {
    let content = (
        <AlertHtmlLocal
            title={localStrings.cartRestricted}
            content={localStrings.cartRestrictedDetail}
        >
        </AlertHtmlLocal>

    )

    return {
        content: content,
        actions: [
            {
                title: localStrings.detail,
                action: () => setRedirectPageGlobal("/cart"),
            }
        ]
    }
}

export async function processOrderCharge(currentEstablishment, currentService, orderInCreation, setGlobalDialog, setRedirectPageGlobal, currency, brandId) {
    if (!brandId || !orderInCreation) {
        return;
    }
    orderInCreation.charges = [];
    //alert("brandId " + brandId)
    let res = await executeQueryUtil(getChargesQuery(brandId));
    let chargeItems = res?.data?.getChargesByBrandId || [];
    let priceDetail = computePriceDetail(orderInCreation)
    //alert("processOrderCharge totalNoCharge " + priceDetail.totalNoCharge)
    if (priceDetail.totalNoCharge === 0) {
        return;
    }

    //alert("processOrderCharge3 " + chargeItems.length)
    chargeItems.forEach(charge => {
        let chargeCopy = cloneDeep(charge);
        //alert("computeItemRestriction charge")
        let unMatching = computeItemRestriction(chargeCopy, currentEstablishment, currentService, orderInCreation, currency, true);
        //alert("unMatching " + unMatching)
        //console.log("chargeCopy " + JSON.stringify(chargeCopy, null, 2))


        if (chargeCopy.restrictionsApplied.length > 0 && unMatching == 0) {
            // alert("chargeCopy.restrictionsApplied " + chargeCopy.restrictionsApplied.length)
            // alert("unMatching " + unMatching)

            if (chargeCopy.pricingEffect === PRICING_EFFECT_PERCENTAGE) {
                let percent = parseFloat(chargeCopy.pricingValue);
                chargeCopy.price = priceDetail.totalNoCharge * (percent / 100)
            }
            else if (chargeCopy.pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
                chargeCopy.price = parseFloat(chargeCopy.pricingValue);
            }
            //alert("pushing charge ")
            orderInCreation.charges.push(chargeCopy);
        }
    })

}

export function processOrderInCreation(currentEstablishment, currentService, orderInCreation,
                                       setGlobalDialog, setRedirectPageGlobal, currency) {

    if (orderInCreation?.order?.items ) {
        (orderInCreation?.order?.items).forEach(item => {
            const restrictionBefore = (item.restrictionsApplied || [])
                .map(res => res.type).sort((a, b) => a.localeCompare(b));

            computeItemRestriction(item, currentEstablishment, currentService, orderInCreation, currency);
            const restrictionAfter = (item.restrictionsApplied || [])
                .map(res => res.type).sort((a, b) => a.localeCompare(b));

            if (restrictionAfter.length > restrictionBefore.length && !itemRestrictionMax(item) &&
                JSON.stringify(restrictionBefore) !== JSON.stringify(restrictionAfter)) {
                setGlobalDialog(builAlertRestrictionComponent(setRedirectPageGlobal));
            }
        })
    }

    if (orderInCreation?.order?.deals) {
        (orderInCreation?.order?.deals).forEach(item => {


            let deal = item.deal;

            //alert("processOrderInCreation deal " + JSON.stringify(deal.restrictionsList || {}));
            const restrictionBefore = (deal.restrictionsApplied || [])
                .map(res => res.type).sort((a, b) => a.localeCompare(b));

            computeItemRestriction(deal, currentEstablishment, currentService, orderInCreation, currency);
            const restrictionAfter = (deal.restrictionsApplied || [])
                .map(res => res.type).sort((a, b) => a.localeCompare(b));

            if (restrictionAfter.length > restrictionBefore.length && !itemRestrictionMax(deal) &&
                JSON.stringify(restrictionBefore) !== JSON.stringify(restrictionAfter)) {
                setGlobalDialog(builAlertRestrictionComponent(setRedirectPageGlobal));
            }
        })
    }

}


export function computeItemRestriction(item, currentEstablishment, currentService, orderInCreation, currency, invertMatch) {
    let countMatching = 7;

    if (!currentEstablishment()) {
        return;
    }

    // if (currentEstablishment() && (item?.unavailableInEstablishmentIds || []).includes(currentEstablishment().id)) {
    //     item.restrictionsApplied.push({
    //         type: RESTRICTION_UNAVAILABLE,
    //         description: "unavailable",
    //         local: localStrings.unavailable,
    //     })
    // }

    item.restrictionsApplied = [];

    if (currentEstablishment() && (item?.unavailableInEstablishmentIds || []).includes(currentEstablishment().id)) {
        item.restrictionsApplied.push({
            type: RESTRICTION_UNAVAILABLE,
            description: "unavailable",
            local: localStrings.unavailable,
        })
    }

    if (!item.restrictionsList || item.restrictionsList.length === 0 ) {
        return;
    }
    let restrictionToApply = item.restrictionsList.find(restriction => restriction.establishmentId === currentEstablishment().id);
    if (!restrictionToApply) {
        restrictionToApply = item.restrictionsList.find(restriction => restriction.establishmentId === null);
    }
    // if (!restrictionToApply) {
    //     return;
    // }

    //condition day of week
    if (currentService && restrictionToApply && restrictionToApply?.dow && restrictionToApply?.dow.length > 0) {
        //alert("restrictionToApply.dow");
        const norestrictionInCurrentDay = (restrictionToApply.dow || []).find(item => item?.day === currentService.dow?.day &&
            item?.service === currentService.dow?.service);
        const localDay = displayDow(currentService.dow);

        let condition = restrictionToApply.dow && restrictionToApply.dow.length > 0 && !norestrictionInCurrentDay;
        if (invertMatch) {
            condition = !condition;
        }
        if (condition) {
            item.restrictionsApplied.push({
                type: RESTRICTION_DOW,
                description: restrictionToApply.description,
                local: localStrings.formatString(localStrings.unavailableDay, localDay),
            })
            countMatching --;
        }
    }
    else {
        countMatching --;
    }



    if (restrictionToApply?.serviceTypes && restrictionToApply?.serviceTypes.length > 0) {
        if (orderInCreation) {
            //check service type
            // alert("check serviceType " + orderInCreation.deliveryMode)
            // alert("restrictionToApply?.serviceTypes " + JSON.stringify(restrictionToApply?.serviceTypes))
            let condition = orderInCreation.deliveryMode && !restrictionToApply?.serviceTypes.includes(orderInCreation.deliveryMode);
            if (invertMatch) {
                condition = !condition;
            }
            if (condition) {
                //alert("add restriction serviceTypes")
                item.restrictionsApplied.push({
                    type: RESTRICTION_DELIVERY,
                    description: RESTRICTION_DELIVERY,
                    local: localStrings.formatString(localStrings.deliveryUnable,
                        formatOrderConsumingMode(orderInCreation, localStrings)),
                })
                countMatching--;
            }
        }
    }
    else {
        countMatching--;
    }
    // alert("restrictionsApplied distanceInfo")
    // alert("restrictionToApply.minDeliveryDistance" + restrictionToApply.minDeliveryDistance)
    // alert("restrictionToApply.maxDeliveryDistance" + restrictionToApply.maxDeliveryDistance)
    // alert("orderInCreation.deliveryAddress" + orderInCreation.deliveryAddress)
    //alert("orderInCreation?.deliveryAddress?.distance" + orderInCreation?.deliveryAddress?.distance)
    if (restrictionToApply && (restrictionToApply.maxDeliveryDistance || restrictionToApply.minDeliveryDistance)) {
        if (orderInCreation.deliveryAddress && orderInCreation.deliveryAddress.distance) {
            // alert("maxDeliveryDistance" + restrictionToApply.maxDeliveryDistance * 1000);
            // alert("minDeliveryDistance" + restrictionToApply.minDeliveryDistance * 1000);
            const distMeter = orderInCreation?.deliveryAddress?.distance
            // alert("condition" + distMeter);

            let condition = (restrictionToApply.maxDeliveryDistance && distMeter >= restrictionToApply.maxDeliveryDistance * 1000) ||
                (restrictionToApply.minDeliveryDistance && distMeter <= restrictionToApply.minDeliveryDistance * 1000);
            if (invertMatch) {
                condition = !condition
            }

            if (condition)
            {
                let local = "";
                if (restrictionToApply.maxDeliveryDistance && restrictionToApply.minDeliveryDistance) {
                    local =  localStrings.formatString(localStrings.deliveryDistanceMinMax,
                        restrictionToApply.minDeliveryDistance, restrictionToApply.maxDeliveryDistance);
                }
                else if (!restrictionToApply.maxDeliveryDistance) {
                    local =  localStrings.formatString(localStrings.deliveryDistanceMin,
                        restrictionToApply.minDeliveryDistance);
                }
                else if (!restrictionToApply.minDeliveryDistance) {
                    local =  localStrings.formatString(localStrings.deliveryDistanceMax,
                        restrictionToApply.maxDeliveryDistance);
                }
                //alert("restrictionsApplied distanceInfo add");
                item.restrictionsApplied.push({
                    type: RESTRICTION_DISTANCE,
                    description: RESTRICTION_DISTANCE,
                    local: local,
                })
                countMatching --;
            }
        }
    }
    else {
        countMatching --;
    }

    //alert("restrictionToApply " + JSON.stringify(restrictionToApply || {}));
    //console.log("restrictionToApply " + JSON.stringify(restrictionToApply || {}));
    if (restrictionToApply && (restrictionToApply.minOrderAmount || restrictionToApply.maxOrderAmount)) {
        //alert("restriction price ");
        let totalPrice = computePriceDetail(orderInCreation).total;
        //alert("totalPrice " + totalPrice);
        let conditionMatch = (restrictionToApply.maxOrderAmount && totalPrice >= restrictionToApply.maxOrderAmount) ||
            (restrictionToApply.minOrderAmount && totalPrice <= restrictionToApply.minOrderAmount);
        if (invertMatch) {
            conditionMatch = !conditionMatch;
        }

        if (conditionMatch)
        {
            let local = "";
            if (restrictionToApply.maxOrderAmount && restrictionToApply.minOrderAmount) {
                local =  localStrings.formatString(localStrings.priceMinMax,
                    restrictionToApply.minOrderAmount, restrictionToApply.maxOrderAmount, currency);
            }
            else if (!restrictionToApply.maxOrderAmount) {
                local =  localStrings.formatString(localStrings.priceMin,
                    restrictionToApply.minOrderAmount, currency);
            }
            else if (!restrictionToApply.minOrderAmount) {
                local =  localStrings.formatString(localStrings.priceMax,
                    restrictionToApply.maxOrderAmount, currency);
            }
            //alert("restrictionPrice price add");
            item.restrictionsApplied.push({
                type: RESTRICTION_PRICE,
                description: RESTRICTION_PRICE,
                local: local,
            })
            countMatching --;
        }
    }
    else {
        countMatching --;
    }

    //check date
    if (restrictionToApply && (restrictionToApply.startDate || restrictionToApply.endDate)) {
        if (currentService && currentService.dateStart) {
            const restrictionStartMoment = restrictionToApply.startDate && moment(restrictionToApply.startDate)
            const restrictionEndMoment = restrictionToApply.endDate && moment(restrictionToApply.endDate)
            const startServiveMoment = moment(currentService.dateStart)

            let condition = (restrictionStartMoment && startServiveMoment.isBefore(restrictionStartMoment)) ||
                (restrictionEndMoment && startServiveMoment.isAfter(restrictionEndMoment));
            if (invertMatch) {
                condition = !condition;
            }
            if (condition) {
                let local = "";
                if (restrictionEndMoment && restrictionStartMoment) {
                    local = localStrings.formatString(localStrings.dateMinMax,
                        restrictionStartMoment.locale("fr").calendar(),
                        restrictionEndMoment.locale("fr").calendar());
                } else if (restrictionEndMoment) {
                    local = localStrings.formatString(localStrings.dateMin,
                        restrictionStartMoment.locale("fr").calendar());
                } else if (restrictionStartMoment) {
                    local = localStrings.formatString(localStrings.dateMax,
                        restrictionEndMoment.locale("fr").calendar());
                }
                //alert("restrictionDate add");
                item.restrictionsApplied.push({
                    type: RESTRICTION_DATE,
                    description: RESTRICTION_DATE,
                    local: local,
                })
                countMatching--;
            }
        }
    }
    else {
        countMatching --;
    }


    //checktime
    if (restrictionToApply && (restrictionToApply.startTime || restrictionToApply.endTime)) {
        if (orderInCreation && orderInCreation.bookingSlot) {

            let minutesSlot = getMinutesFromDate(orderInCreation.bookingSlot.startDate);
            let minutesStart = restrictionToApply.startTime && getMinutesFromHour(restrictionToApply.startTime);
            let minutesEnd = restrictionToApply.endTime && getMinutesFromHour(restrictionToApply.endTime);
            //alert("restrictionHour hour");

            let condition = (minutesStart && minutesSlot < minutesStart) ||
                (minutesEnd && minutesSlot > minutesEnd);
            if (invertMatch) {
                condition = !condition;
            }

            if (condition) {
                let local = "";
                if (minutesEnd && minutesStart) {
                    local = localStrings.formatString(localStrings.hourMinMax,
                        restrictionToApply.startTime,
                        restrictionToApply.endTime);
                } else if (minutesEnd) {
                    local = localStrings.formatString(localStrings.hourMin,
                        restrictionToApply.startTime);
                } else if (minutesStart) {
                    local = localStrings.formatString(localStrings.hourMax,
                        restrictionToApply.endTime);
                }
                //alert("restrictionHour add");
                item.restrictionsApplied.push({
                    type: RESTRICTION_HOUR,
                    description: RESTRICTION_HOUR,
                    local: local,
                })
                countMatching--;
            }
        }
    }
    else {
        countMatching--;
    }


    //alert("restrictionToApply.maxPerOrder" + restrictionToApply.maxPerOrder)
    if (restrictionToApply && restrictionToApply.maxPerOrder) {
        let conditionMax = restrictionToApply.maxPerOrder && parseInt(item.quantity) >= restrictionToApply.maxPerOrder;
        if (invertMatch) {
            conditionMax =! conditionMax;
        }
        if (conditionMax) {
            item.restrictionsApplied.push({
                type: RESTRICTION_MAX_ITEM,
                description: RESTRICTION_MAX_ITEM,
                local: localStrings.maxItems,
            })
            countMatching --;

        }
    }
    else {
        countMatching --;
    }



    //alert("countMatching " + countMatching);
    //countMatching is 0 when all defined conditions matches

    return countMatching;

}

export function buildProductAndSkus(product, orderInCreation, dealLinNumber, dealEdit, currentEstablishment, currentService, brand,
                                    setGlobalDialog, setRedirectPageGlobal
) {
    let allSkusWithProduct = [];


    if (product && product.skus) {
        product.skus.forEach(sku => {
            let copySku = {...sku}

            if (!sku.optionListExtIds || sku.optionListExtIds.length == 0 ) {
                if (orderInCreation && orderInCreation?.order && orderInCreation.order.items) {
                    let existing = orderInCreation.order.items.find(item => {
                        return sameItem(item, sku, []);
                    })
                    if (existing) {
                        copySku.uuid = existing.uuid;
                    }
                }
            }

            let options = [];
            if (dealLinNumber != null && dealEdit && dealEdit.productAndSkusLines) {
                let item = dealEdit.productAndSkusLines.find(line => line.lineNumber === dealLinNumber);
                options = item ? item.options || [] : [];
            }
            computeItemRestriction(copySku, currentEstablishment, currentService, orderInCreation,
                getBrandCurrency(brand))
            //if (!sku.unavailableInEstablishmentIds || !sku.unavailableInEstablishmentIds.includes(currentEstablishment().id)) {
            if (sku.visible) {
                allSkusWithProduct.push({
                    product: product,
                    sku: copySku,
                    options: options
                });
            }




            //}
        })
    }

    processOrderCharge(currentEstablishment, orderInCreation, setGlobalDialog, setRedirectPageGlobal,
        getBrandCurrency(brand), brand?.id)
    //alert("allSkusWithProduct" + JSON.stringify(allSkusWithProduct))
    return allSkusWithProduct;
}

export function getItemNumberInCart(orderInCreation, excludeRestriction) {
    if (!orderInCreation() || !orderInCreation().order ) {
        return 0;
    }
    let tot = 0;
    getCartItems(orderInCreation, excludeRestriction).forEach(item => {
        tot += item.quantity;
    })
    //alert("tot " + tot)
    return tot.toString();
}