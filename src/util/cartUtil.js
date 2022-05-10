import moment from "moment";
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
    formatOrderConsumingMode,
    getBrandCurrency,
    getMinutesFromDate,
    getMinutesFromHour
} from "./displayUtil";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {itemRestrictionMax} from "@component/mini-cart/MiniCart";
import {executeQueryUtil} from "../apolloClient/gqlUtil";
import {getChargesQuery} from "../gql/chargesGql";
import {getCouponCodeDiscount} from "../gql/productDiscountGql";
import * as ga from '../../lib/ga'

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

export function decreaseDealCartQte(setGlobalDialog, orderInCreation, setOrderInCreation, uuid, contextData) {
    let itemToChange = orderInCreation.order.deals.find(deal => deal.uuid === uuid);

    if (!itemToChange) {
        return;
    }
    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);

    let others = orderInCreation.order.deals.filter(deal => deal.uuid !== uuid);
    let removed = orderInCreation.order.deals.find(deal => deal.uuid === uuid);

    let items = [];
    if (orderInCreation.order.items) {
        items = [...orderInCreation.order.items]
    }

    if (itemToChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation,
            order: {
                items: items,
                deals: [...others]
            }
        });
        itemToChange.quantity--;
        return;
    }

    itemToChange.quantity--;
    setOrderInCreation({
        ...orderInCreation,
        order: {
            items: items,
            deals: [...others, {...itemToChange}]
        }
    });

    ga.gaRemoveFromCart(
        removed.extRef,
        removed.name,
        1,
        removed.price,
    )
}

export function increaseDealCartQte(setGlobalDialog, orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation.order.deals.find(deal => deal.uuid === uuid);

    if (!itemIoChange) {
        return;
    }

    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);

    let others = orderInCreation.order.deals.filter(deal => deal.uuid !== uuid);
    let added = orderInCreation.order.deals.find(itemOrder => itemOrder.uuid === uuid);

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

    ga.gaAddToCart(
        added.extRef,
        added.name,
        1,
        added.price,
    )
}


export function decreaseCartQte(setGlobalDialog, orderInCreation, setOrderInCreation, uuid,
                                checkDealProposal, currentEstablishment) {
    //alert("uuid " + uuid)
    let discPointExists = isDiscPointExists(orderInCreation);
    let itemToChange = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);
    if (!itemToChange) {
        //alert("no itemToChange ")
        return;
    }

    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);

    let others = orderInCreation.order.items.filter(itemOrder => itemOrder.uuid !== uuid);
    let removed = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);

    let deals = [];
    if (orderInCreation.order.deals) {
        deals = [...orderInCreation.order.deals]
    }

    if (itemToChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation,
            order: {
                items: [...others],
                deals: deals
            }
        });
        itemToChange.quantity--;
        return;
    }

    itemToChange.quantity--;
    let newOrder = {
        ...orderInCreation,
        order: {
            items: [...others, {...itemToChange}],
            deals: deals
        }
    };
    setOrderInCreation(newOrder);

    ga.gaRemoveFromCart(
        removed.extRef,
        removed.name,
        1,
        removed.price,
    )

    if (checkDealProposal && currentEstablishment && !discPointExists) {
        checkDealProposal(newOrder, currentEstablishment);
    }
}

export async function increaseCartQte(setGlobalDialog, orderInCreation, setOrderInCreation,
                                      uuid, contextData, checkDealProposal, currentEstablishment) {
    let discPointExists = isDiscPointExists(orderInCreation);
    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);
    // alert("added " + JSON.stringify(added))
    let itemIoChange = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);
    let others = orderInCreation.order.items.filter(itemOrder => itemOrder.uuid !== uuid);
    let added = orderInCreation.order.items.find(itemOrder => itemOrder.uuid === uuid);

    itemIoChange.quantity++;

    let deals = [];
    if (orderInCreation.order.deals) {
        deals = [...orderInCreation.order.deals]
    }

    let newOrder = {
        ...orderInCreation,
        order: {
            items: [...others, {...itemIoChange}],
            deals: deals
        }
    };
    setOrderInCreation(newOrder);

    ga.gaAddToCart(
        added.extRef,
        added.name,
        1,
        added.price,
    )

    if (checkDealProposal && currentEstablishment && !discPointExists) {
        checkDealProposal(newOrder, currentEstablishment);
    }
}

function checkOrderInCreation (orderInCreation) {
    return orderInCreation() && orderInCreation().order
}



export function deleteItemInCart(setGlobalDialog, orderInCreation, setOrderInCreation, uuid) {
    if (!orderInCreation || !orderInCreation().order) {
        return
    }

    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);


    let removed = orderInCreation().order.items.find(itemOrder => itemOrder.uuid === uuid);
    console.log("removed " + JSON.stringify(removed, null, 2));
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

    ga.gaRemoveFromCart(
        removed.extRef,
        removed.name,
        1,
        removed.price,
    )


}

export function deleteDealInCart(setGlobalDialog, orderInCreation, setOrderInCreation, uuid) {
    //alert("uuid " + uuid);
    if (!orderInCreation || !orderInCreation().order) {
        return
    }

    //orderInCreation= removeDiscountPoints(orderInCreation, setGlobalDialog);


    let items = [];
    if (orderInCreation().order.items) {
        items = [...orderInCreation().order.items]
    }

    let others = orderInCreation().order.deals.filter(deal => deal.uuid !== uuid);
    let removed = orderInCreation().order.deals.filter(deal => deal.uuid === uuid);
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: items,
            deals: [...others]
        }
    });

    ga.gaRemoveFromCart(
        removed.extRef,
        removed.name,
        1,
        removed.price,
    )
}


export function deleteDiscountInCart(orderInCreation, setOrderInCreation, id) {
    //alert("uuid " + uuid);
    if (!orderInCreation || !orderInCreation.order) {
        return
    }



    let discounts = orderInCreation.discounts || [];
    let others = discounts.filter(discount => discount.id !== id);
    if (setOrderInCreation) {
        setOrderInCreation({
            ...orderInCreation,
            discounts: [...others]
        });
    }
    else {
        //revertDiscountedPrices(orderInCreation);
        orderInCreation.discounts = [...others];
    }
}

function sameItem(item, itemToAdd, optionsInit) {
    let sameProduct = item.extRef === itemToAdd.extRef;
    let optionsItem = (item.options || []).map(option => option.ref)
        .sort((o1, o2) => o2 < o1 ? 1 : 0);
    return sameProduct && JSON.stringify(optionsItem) === JSON.stringify(optionsInit);
}

export function selectToDealEditOrder(productAndSku, dealEdit, setDealEdit, lineNumber) {
    let price;
    if (!dealEdit) {
        return;
    }
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

export function addDealToCart(setGlobalDialog, deal, orderInCreation, setOrderInCreation, doNotUpdateOrder) {
    let newOrder;
    let dealToAdd = {...deal}

    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);


    console.log("dealToAdd -" + JSON.stringify(dealToAdd, null, 2))
    dealToAdd.creationTimestamp = moment().unix();
    let items = [];
    if (orderInCreation.order.items) {
        items = [...orderInCreation.order.items]
    }

    let existing = false;
    let productAndSkusLinesInit = (dealToAdd?.productAndSkusLines || []).sort((o1, o2) => o2.extRef < o2.extRef ? 1:0);

    if (orderInCreation && orderInCreation.order && orderInCreation.order.deals) {
        existing = orderInCreation.order.deals.find(deal => {
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
        let others = orderInCreation.order.deals.filter(deal => deal.uuid !== existing.uuid);
        existing.quantity ++;
        newOrder = {
            ...orderInCreation,
            order: {
                items: items,
                deals: [...others, existing],
            }
        };

        if (!doNotUpdateOrder) {
            setOrderInCreation(newOrder)
        }

        return newOrder;

        //if (addToast) {
        //addToast(localStrings.notif.dealAddedToCart, { appearance: 'success', autoDismiss: true});
        //}

        //return;
    }

    dealToAdd.quantity = 1;
    dealToAdd.uuid = uuid();
    if (orderInCreation.order.deals) {
        newOrder = {
            ...orderInCreation,
            order: {
                items: items,
                deals: [...orderInCreation.order.deals, dealToAdd],
            }
        };

    }
    else {
        newOrder = {
            ...orderInCreation,
            order: {
                items: items,
                deals: [dealToAdd]
            }
        };

    }
    // if (addToast) {
    //     //addToast(localStrings.notif.dealAddedToCart, { appearance: 'success', autoDismiss: true });
    // }
    console.log("productAndSku " + JSON.stringify(dealToAdd, null, 2))
    let price = 0;

    if (!dealToAdd.deal.lines) {
        return;
    }
    dealToAdd.deal.lines.forEach(line => {
        price += parseFloat(line.pricingValue || "0")
    })

    ga.gaAddToCart(
        dealToAdd.deal.id,
        dealToAdd.deal.name,
        1,
        price,
    )

    if (newOrder && !doNotUpdateOrder) {
        setOrderInCreation(newOrder)
    }

    return newOrder;
}


export function addDiscountToCart(discount, orderInCreation, setOrderInCreation) {
    if (!orderInCreation || !orderInCreation()) {
        return;
    }

    let existingOrder = orderInCreation();
    setOrderInCreation({
        ...orderInCreation(),
        discounts: [...existingOrder.discounts || [], {...discount}]
    })
}

export function isDiscPointExists(orderInCreation) {
    return (orderInCreation.discounts || []).find(disc => disc.loyaltyPointCost && disc.loyaltyPointCost > 0);
}

export function removeDiscountPoints(orderInCreation, setGlobalDialog) {
    if (!orderInCreation.discounts) {
        return orderInCreation;
    }
    let discPointExists = isDiscPointExists(orderInCreation);
    if (discPointExists) {
        setGlobalDialog(buildAlertDiscountPointRemovedComponent());
        return {
            ...orderInCreation,
            discounts: orderInCreation.discounts.filter(disc => !disc.loyaltyPointCost || disc.loyaltyPointCost === 0)
        }
    }
    return orderInCreation;

    // console.log("");
    // setOrderInCreation()
    // orderInCreation.discounts.filter(disc => disc.loyaltyPointCost)
    // await setOrderInCreation({
    //     ...orderInCreation,
    //     discounts: orderInCreation.discounts.filter(disc => !disc.loyaltyPointCost || disc.loyaltyPointCost === 0)
    // }, null, null, null, null)
    //
}

export function addToCartOrder(setGlobalDialog, productAndSku, orderInCreation,
                               setOrderInCreation, addToast, prefferedDealToApply, checkDealProposal, currentEstablishment) {
    if (!orderInCreation || !productAndSku.product) {
        return;
    }

    let discPointExists = isDiscPointExists(orderInCreation);
    orderInCreation = removeDiscountPoints(orderInCreation, setGlobalDialog);

    let itemToAdd = { ...productAndSku.sku}
    itemToAdd.quantity = 1
    itemToAdd.productName = productAndSku.product.name;
    itemToAdd.productExtName = productAndSku.product.extName;
    itemToAdd.productId = productAndSku.product.id;
    itemToAdd.creationTimestamp = moment().unix();
    itemToAdd.options =  productAndSku.options || []


    let optionsInit = (itemToAdd.options  || []).map(option => option.ref)
        .sort((o1, o2) => o2 < o1 ? 1:0)

    let existing;

    if (orderInCreation && orderInCreation?.order && orderInCreation.order.items) {
        existing = orderInCreation.order.items.find(item => {
            return sameItem(item, itemToAdd, optionsInit);
        })
    }

    let deals = [];
    if (orderInCreation?.order.deals) {
        deals = [...orderInCreation.order.deals]
    }

    if (existing) {
        let others = orderInCreation?.order.items.filter(item => item.uuid !== existing.uuid);
        existing.quantity ++;
        let newOrder = {
            ...orderInCreation,
            order: {
                items: [...others, existing],
                deals: deals
            }
        };
        setOrderInCreation(newOrder, null, null, null, prefferedDealToApply)
        if (addToast) {
            //addToast(localStrings.notif.productAddedToCart, { appearance: 'success', autoDismiss: true });
        }
        ga.gaAddToCart(
            productAndSku.sku.id,
            productAndSku.sku.name,
            1,
            productAndSku.sku.price,
        )
        if (checkDealProposal && currentEstablishment && !discPointExists) {
            checkDealProposal(newOrder, currentEstablishment);
        }
        return;
    }
    itemToAdd.uuid = uuid();
    let newOrder;
    if (orderInCreation?.order.items) {
        newOrder = {
            ...orderInCreation,
            order: {
                items: [...orderInCreation.order.items, itemToAdd],
                deals: deals
            }
        }

        setOrderInCreation(newOrder , null, null, null, prefferedDealToApply)
    }
    else {
        newOrder = {
            ...orderInCreation,
            order: {
                items: [itemToAdd],
                deals: deals
            }
        }

    }

    setOrderInCreation(newOrder, null, null, null, prefferedDealToApply)
    if (addToast) {
        //addToast(localStrings.notif.productAddedToCart, { appearance: 'success', autoDismiss: true });
    }

    console.log("productAndSku " + JSON.stringify(productAndSku, null, 2))
    ga.gaAddToCart(
        productAndSku.sku.id,
        productAndSku.sku.name,
        1,
        productAndSku.sku.price,
    )

    if (checkDealProposal && currentEstablishment && !discPointExists) {
        checkDealProposal(newOrder, currentEstablishment);
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
export const RESTRICTION_BOOKING_TIME = "bookingTime";
export const RESTRICTION_SAME_DAY = "sameDay";
export const RESTRICTION_DELIVERY_ZONE = "deliveryZone";
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

function buildAlertDiscountPointRemovedComponent() {
    let content = (
        <AlertHtmlLocal
            title={localStrings.discountPointRemoved}
            content={localStrings.discountPointRemovedDetail}
        >
        </AlertHtmlLocal>

    )

    return {
        content: content,
        actions: [
            // {
            //     title: localStrings.detail,
            //     action: () => setRedirectPageGlobal("/cart"),
            // }
        ]
    }
}

function builAlertNoValidComponAnymoreComponent(code) {
    let content = (
        <AlertHtmlLocal
            title={localStrings.couponNotValidAnymoreTitle}
            content={localStrings.formatString(localStrings.couponNotValidAnymore, code)}
        >
        </AlertHtmlLocal>

    )

    return {
        content: content,
        actions: [
            // {
            //     title: localStrings.detail,
            //     action: () => setRedirectPageGlobal("/cart"),
            // }
        ]
    }
}

function applyDiscountOnItemFixed(item, discount, remains) {
    let discountAppliedAmount = 0;
    if (!item.nonDiscountedPrice) {
        item.nonDiscountedPrice = item.price;
    }
    if (!item.discountApplied) {
        item.discountApplied = [];
    }

    const itemPrice = parseFloat(item.price);
    if (itemPrice <= remains) {
        let initialPrice = item.price;
        //discountAppliedAmount = parseFloat(item.price) * (discount.pricingValue / 100);
        item.price = 0;
        item.discountApplied.push(discount.id);
        return remains - initialPrice;
    }
    else {
        item.price = item.price - remains;
        return 0
    }
}

function applyDiscountOnItemPercentage(item, discount) {
    let discountAppliedAmount = 0;
    if (!item.nonDiscountedPrice) {
        item.nonDiscountedPrice = item.price;
    }
    if (!item.discountApplied) {
        item.discountApplied = [];
    }

    if (discount.pricingEffect === PRICING_EFFECT_PERCENTAGE && discount.pricingValue) {
        discountAppliedAmount = parseFloat(item.price) * (parseFloat(discount.pricingValue) / 100);
        item.price = (parseFloat(item.price) - discountAppliedAmount).toFixed(2);
        let options = item.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            option.nonDiscountedPrice = option.price;
            let discountAppliedOptionAmount = parseFloat(option.price) * (parseFloat(discount.pricingValue) / 100);
            option.price = (parseFloat(option.price) - discountAppliedOptionAmount).toFixed(2);
        }
        item.discountApplied.push(discount.id);
    }

    return discountAppliedAmount;
}


export function processOrderDiscountSync(orderInCreation) {
    if (!orderInCreation) {
        return;
    }

    let discounts = orderInCreation.discounts || [];
    console.log("orderInCreation.discounts " + JSON.stringify(discounts, null, 2))

    let items = orderInCreation.order?.items || [];
    let deals = orderInCreation.order?.deals || [];
    for (let j = 0; j < items.length; j++) {
        const item = items[j];
        item.discountApplied = [];
        if (item.nonDiscountedPrice) {
            item.price = parseFloat(item.nonDiscountedPrice).toFixed(2)
        }

    }

    for (let j = 0; j < deals.length; j++) {
        const deal = deals[j];
        const productAndSkusLines = deal.productAndSkusLines;
        for (let k = 0; k < productAndSkusLines.length; k++) {
            const productAndSkusLine = productAndSkusLines[k];
            if (productAndSkusLine.nonDiscountedPrice) {
                productAndSkusLine.price = parseFloat(productAndSkusLine.nonDiscountedPrice).toFixed(2)
            }
        }
    }


    for (let i = 0; i < discounts.length; i++) {
        const discount = discounts[i];
        let totalDisc = 0;
        for (let j = 0; j < items.length; j++) {
            const item = items[j];
            totalDisc += applyDiscountOnItemPercentage(item, discount);
        }

        for (let j = 0; j < deals.length; j++) {
            const deal = deals[j];
            const productAndSkusLines = deal.productAndSkusLines;
            for (let k = 0; k < productAndSkusLines.length; k++) {
                const productAndSkusLine = productAndSkusLines[k];
                totalDisc += applyDiscountOnItemPercentage(productAndSkusLine, discount);
            }
        }
        discount.pricingOff = totalDisc.toFixed(2);
    }
}

export function revertDiscountedPrices(orderInCreation) {

    let orderInCreationClone = cloneDeep(orderInCreation)
    let items = orderInCreationClone.order?.items || [];
    let deals = orderInCreationClone.order?.deals || [];
    let charges = orderInCreationClone.charges || [];
    //revert price
    for (let j = 0; j < items.length; j++) {
        const item = items[j];
        item.discountApplied = [];
        if (item.nonDiscountedPrice) {
            item.price = parseFloat(item.nonDiscountedPrice).toFixed(2)
        }
        let options = item.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.nonDiscountedPrice) {
                option.price = option.nonDiscountedPrice;
            }
        }
    }

    //revert price
    for (let i = 0; i < charges.length; i++) {
        const charge = charges[i];
        if (charge.nonDiscountedPrice) {
            charge.price = parseFloat(charge.nonDiscountedPrice).toFixed(2)
        }
    }


    //revert price
    for (let j = 0; j < deals.length; j++) {
        const deal = deals[j];
        const productAndSkusLines = deal.productAndSkusLines;
        for (let k = 0; k < productAndSkusLines.length; k++) {
            const productAndSkusLine = productAndSkusLines[k];
            if (productAndSkusLine.nonDiscountedPrice) {
                productAndSkusLine.price = parseFloat(productAndSkusLine.nonDiscountedPrice).toFixed(2)
            }
            // let options = item.options;
            // for (let i = 0; i < options.length; i++) {
            //     const option = options[i];
            //     if (option.nonDiscountedPrice) {
            //         option.price = option.nonDiscountedPrice;
            //     }
            // }
        }
    }
    return orderInCreationClone;
}

export function processOrderDiscount(orderInCreation, brand, currentService, currentEstablishment,
                                     userId, setGlobalDialog, setOrderInCreation, doNotCheckValidity) {
    if (!orderInCreation) {
        return;
    }

    let discounts = orderInCreation.discounts || [];
    console.log("orderInCreation.discounts " + JSON.stringify(discounts, null, 2))
    let totalPrice = computePriceDetail(orderInCreation);

    if (brand) {
        for (let i = 0; !doNotCheckValidity && i < discounts.length; i++) {
            const discount = discounts[i];
            if (discount.couponCodeValues && discount.couponCodeValues.length === 1) {
                //let res = await executeQueryUtil(getCouponCodeDiscount(brand.id, userId,
                //     discount.couponCodeValues[0], totalPrice.totalNonDiscounted || 0))
                // console.log("res coupon " + JSON.stringify(res, null, 2))
                discount.restrictionsApplied = [];
                computeItemRestriction(discount, currentEstablishment, currentService,
                    orderInCreation, getBrandCurrency(brand));
                if (discount.restrictionsApplied && discount.restrictionsApplied.length > 0) {
                    //const couponDiscountItem = res.data?.getCouponCodeDiscount;
                    //alert("not valid");
                    setGlobalDialog(builAlertNoValidComponAnymoreComponent(discount.name));
                    deleteDiscountInCart(orderInCreation, null, discount.id)
                }
            }
        }
    }


    orderInCreation = revertDiscountedPrices(orderInCreation);
    let items = orderInCreation.order?.items || [];
    let deals = orderInCreation.order?.deals || [];
    let charges = orderInCreation.charges || [];
    let discountAfterRevert = orderInCreation.discounts;
    for (let i = 0; discountAfterRevert && i < discountAfterRevert.length; i++) {
        const discount = discountAfterRevert[i];
        let totalDisc = 0;
        if (discount.pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
            const total = computePriceDetail(orderInCreation).total;
            if (!discount.initialPricingValue) {
                discount.initialPricingValue = discount.pricingValue;
            }
            const discountPercent = (parseFloat(discount.initialPricingValue || discount.pricingValue) / parseFloat(total)) * 100;
            discount.pricingEffect = PRICING_EFFECT_PERCENTAGE;
            discount.pricingValue = discountPercent.toString();
        }
        for (let j = 0; j < items.length; j++) {
            const item = items[j];
            totalDisc += applyDiscountOnItemPercentage(item, discount) * item.quantity;
        }

        for (let j = 0; j < deals.length; j++) {
            const deal = deals[j];
            const productAndSkusLines = deal.productAndSkusLines;
            for (let k = 0; k < productAndSkusLines.length; k++) {
                const productAndSkusLine = productAndSkusLines[k];
                totalDisc += applyDiscountOnItemPercentage(productAndSkusLine, discount) * deal.quantity;
            }
        }

        if (discount.loyaltyPointCost) {
            for (let j = 0; j < charges.length; j++) {
                const charge = charges[j];
                charge.nonDiscountedPrice = charge.price;
                let discountAppliedAmount = parseFloat(charge.price) * (parseFloat(discount.pricingValue) / 100);
                charge.price = (parseFloat(charge.price) - discountAppliedAmount);
                totalDisc += discountAppliedAmount;
            }
        }
        discount.pricingOff = totalDisc.toFixed(2);
    }

    return orderInCreation;
}

export async function processOrderCharge(currentEstablishment, currentService, orderInCreation,
                                         setGlobalDialog, setRedirectPageGlobal, currency, brandId, oldCharges) {
    if (!brandId || !orderInCreation) {
        return;
    }
    orderInCreation.charges = [];
    let res = await executeQueryUtil(getChargesQuery(brandId));
    let chargeItems = res?.data?.getChargesByBrandId || [];
    let priceDetail = computePriceDetail(orderInCreation)
    if (getItemNumberInCart(() => orderInCreation) == 0) {
        return
    }
    let newCharges = [];
    chargeItems.forEach(charge => {
        let chargeCopy = cloneDeep(charge);
        let unMatching = computeItemRestriction(chargeCopy, currentEstablishment, currentService, orderInCreation, currency, true);

        if (chargeCopy.restrictionsApplied.length > 0 && unMatching == 0) {

            if (chargeCopy.pricingEffect === PRICING_EFFECT_PERCENTAGE) {
                let percent = parseFloat(chargeCopy.pricingValue);
                chargeCopy.price = priceDetail.totalNoCharge * (percent / 100)
            }
            else if (chargeCopy.pricingEffect === PRICING_EFFECT_FIXED_PRICE) {
                chargeCopy.price = parseFloat(chargeCopy.pricingValue);
            }
            newCharges.push(chargeCopy)
            //orderInCreation.charges.push(chargeCopy);
        }
    })
    let newChargePrice = newCharges.reduce((partialSum, a) => partialSum + a, 0);
    let oldChargePrice = oldCharges.reduce((partialSum, a) => partialSum + a, 0);
    if (newChargePrice !== oldChargePrice) {
        let orderInCreationWithoutCharges = removeDiscountPoints(cloneDeep(orderInCreation), setGlobalDialog);
        orderInCreation.discounts = orderInCreationWithoutCharges.discounts;
    }
    orderInCreation.charges = newCharges;
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


export function getRestrictionToApply(item, currentEstablishment) {
    let restrictionToApply = (item.restrictionsList || []).find(restriction => restriction.establishmentId === currentEstablishment().id);
    if (!restrictionToApply) {
        restrictionToApply = (item.restrictionsList || []).find(restriction => restriction.establishmentId === null);
    }
    return restrictionToApply;
}

export function computeItemRestriction(item, currentEstablishment, currentService, orderInCreation, currency, invertMatch) {
    let countMatching = 10;

    if (!currentEstablishment()) {
        return;
    }

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
    let restrictionToApply = getRestrictionToApply(item, currentEstablishment);

    if (restrictionToApply && restrictionToApply?.deliveryZones
        && restrictionToApply?.deliveryZones.length > 0) {
        let zoneId = orderInCreation.deliveryAddress?.zoneId
        let condition = !restrictionToApply?.deliveryZones.includes(zoneId);
        if (invertMatch) {
            condition = !condition;
        }
        if (condition) {
            item.restrictionsApplied.push({
                type: RESTRICTION_DELIVERY_ZONE,
                description: RESTRICTION_DELIVERY_ZONE,
                local: localStrings.deliveryZone,
            })
            countMatching --;
        }
    }
    else {
        countMatching --;
    }


    if (currentService && restrictionToApply && restrictionToApply?.startBookingTime && restrictionToApply?.endBookingTime) {
        let minutesMin = getMinutesFromHour(restrictionToApply.startBookingTime)
        let minutesMax = getMinutesFromHour(restrictionToApply.endBookingTime)
        let momentNow = moment();
        let nowMinutes = momentNow.hours() * 60 + momentNow.minutes();

        let condition = nowMinutes < minutesMin || nowMinutes > minutesMax;
        if (invertMatch) {
            condition = !condition;
        }
        if (condition) {
            item.restrictionsApplied.push({
                type: RESTRICTION_BOOKING_TIME,
                description: RESTRICTION_BOOKING_TIME,
                local: localStrings.bookingTimeUnable,
            })
            countMatching --;
        }
    }
    else {
        countMatching --;
    }

    if (currentService && restrictionToApply && restrictionToApply?.bookingAndDeliverySameDay) {
        let momentNow = moment();
        let condition = !orderInCreation.bookingSlot ||
            momentNow.format("MMDDYYYY") !== orderInCreation.bookingSlot.startDate.format("MMDDYYYY");
        if (invertMatch) {
            condition = !condition;
        }
        if (condition) {
            item.restrictionsApplied.push({
                type: RESTRICTION_SAME_DAY,
                description: RESTRICTION_SAME_DAY,
                local: localStrings.bookingSameDay,
            })
            countMatching --;
        }
    }
    else {
        countMatching --;
    }

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
                } else if (restrictionStartMoment) {
                    local = localStrings.formatString(localStrings.dateMin,
                        restrictionStartMoment.locale("fr").calendar());
                } else if (restrictionEndMoment) {
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
    return countMatching;
}

export function buildProductAndSkus(product, orderInCreation, dealLinNumber, dealEdit, currentEstablishment, currentService, brand) {
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
            if (sku.visible && !sku.onlyInDeal) {
                allSkusWithProduct.push({
                    product: product,
                    sku: copySku,
                    options: options
                });
            }
        })
    }
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
    return tot.toString();
}