import moment from "moment";
import {report} from "next/dist/telemetry/trace/report";
import cloneDeep from "clone-deep";
import {TYPE_DEAL, TYPE_PRODUCT} from "./constants";
import localStrings from "../localStrings";
const { uuid } = require('uuidv4');

export function getCartItems(orderInCreation) {
    if (!orderInCreation() || !orderInCreation().order) {
        return [];
    }
    let allItems = [];
    if (orderInCreation().order.items) {
        orderInCreation().order.items.forEach(item => allItems.push({...item, type: TYPE_PRODUCT}))

        //allItems.concat(orderInCreation().order.items.sort((i1,i2) => i1.creationTimestamp - i2.creationTimestamp));
    }
    //alert(orderInCreation().order.deals.length)
    if (orderInCreation().order.deals) {
        orderInCreation().order.deals.forEach(deal => allItems.push({...deal, type: TYPE_DEAL}))

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

export function decreaseDealCartQte(orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation().order.deals.find(deal => deal.uuid === uuid);

    if (!itemIoChange) {
        return;
    }
    let others = orderInCreation().order.deals.filter(deal => deal.uuid !== uuid);

    let items = [];
    if (orderInCreation().order.items) {
        items = [...orderInCreation().order.items]
    }

    if (itemIoChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: items,
                deals: [...others]
            }
        });
        return;
    }

    itemIoChange.quantity--;
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: items,
            deals: [...others, {...itemIoChange}]
        }
    });
}

export function increaseDealCartQte(orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation().order.deals.find(deal => deal.uuid === uuid);
    let others = orderInCreation().order.deals.filter(deal => deal.uuid !== uuid);

    let items = [];
    if (orderInCreation().order.items) {
        items = [...orderInCreation().order.items]
    }

    itemIoChange.quantity++;

    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: items,
            deals: [...others, {...itemIoChange}]
        }
    });
}


export function decreaseCartQte(orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation().order.items.find(itemOrder => itemOrder.uuid === uuid);
    let others = orderInCreation().order.items.filter(itemOrder => itemOrder.uuid !== uuid);

    let deals = [];
    if (orderInCreation().order.deals) {
        deals = [...orderInCreation().order.deals]
    }

    if (itemIoChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: [...others],
                deals: deals
            }
        });
        return;
    }

    itemIoChange.quantity--;
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: [...others, {...itemIoChange}],
            deals: deals
        }
    });
}

export function increaseCartQte(orderInCreation, setOrderInCreation, uuid) {
    let itemIoChange = orderInCreation().order.items.find(itemOrder => itemOrder.uuid === uuid);
    let others = orderInCreation().order.items.filter(itemOrder => itemOrder.uuid !== uuid);
    itemIoChange.quantity++;

    let deals = [];
    if (orderInCreation().order.deals) {
        deals = [...orderInCreation().order.deals]
    }

    setOrderInCreation({
        ...orderInCreation(),
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

    let itemToAdd = { ...productAndSku.sku}
    itemToAdd.quantity = 1
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

export function addDealToCart(deal, orderInCreation, setOrderInCreation, addToast) {
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

    if (orderInCreation() && orderInCreation().order && orderInCreation().order.items) {
        existing = orderInCreation().order.items.find(item => {
            return sameItem(item, itemToAdd, optionsInit);
        })
    }

    let deals = [];
    if (orderInCreation().order.deals) {
        deals = [...orderInCreation().order.deals]
    }

    if (existing) {
        let others = orderInCreation().order.items.filter(item => item.uuid !== existing.uuid);
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

    if (orderInCreation().order.items) {
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

    if (!orderInCreation || !orderInCreation() || !orderInCreation().order
        || !orderInCreation().order.items || !productAndSku.sku || !productAndSku.sku.extRef) {
        //alert("no orderInCreation")
        return 0;
    }

    let existing = orderInCreation().order.items.find(item => {
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

export function buildProductAndSkus(product, orderInCreation) {

    let allSkusWithProduct = [];
    if (product && product.skus) {
        product.skus.forEach(sku => {
            let copySku = {...sku}

            if (!sku.optionListExtIds || sku.optionListExtIds.length == 0) {
                if (orderInCreation && orderInCreation().order && orderInCreation().order.items) {
                    let existing = orderInCreation().order.items.find(item => {
                        return sameItem(item, sku, []);
                    })
                    if (existing) {
                        copySku.uuid = existing.uuid;
                    }
                }
            }
            //if (!sku.unavailableInEstablishmentIds || !sku.unavailableInEstablishmentIds.includes(currentEstablishment().id)) {
            allSkusWithProduct.push({
                product: product,
                sku: copySku,
                options: []
            })
            //}
        })
    }

    return allSkusWithProduct;
}

export function getItemNumberInCart(orderInCreation) {
    if (!orderInCreation() || !orderInCreation().order ) {
        return 0;
    }
    let tot = 0;
    getCartItems(orderInCreation).forEach(item => {
        tot += item.quantity;
    })
    //alert("tot " + tot)
    return tot.toString();
}