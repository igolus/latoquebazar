import moment from "moment";

export function getCartItems(orderInCreation) {
    if (!orderInCreation() || !orderInCreation().order) {
        return [];
    }
    return orderInCreation().order.items.sort((i1,i2) => i1.creationTimestamp - i2.creationTimestamp)
}

export function decreaseCartQte(orderInCreation, setOrderInCreation, extRef) {
    let itemIoChange = orderInCreation().order.items.find(itemOrder => itemOrder.extRef === extRef);
    let others = orderInCreation().order.items.filter(itemOrder => itemOrder.extRef !== extRef);
    if (itemIoChange.quantity == 1) {
        setOrderInCreation({
            ...orderInCreation(),
            order: {
                items: [...others]
            }
        });
        return;
    }

    itemIoChange.quantity--;
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: [...others, {...itemIoChange}]
        }
    });
}

export function increaseCartQte(orderInCreation, setOrderInCreation, extRef) {
    let itemIoChange = orderInCreation().order.items.find(itemOrder => itemOrder.extRef === extRef);
    let others = orderInCreation().order.items.filter(itemOrder => itemOrder.extRef !== extRef);
    itemIoChange.quantity++;
    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: [...others, {...itemIoChange}]
        }
    });
}


export function addToCartOrder(productAndSku, orderInCreation, setOrderInCreation) {

    let itemToAdd = { ...productAndSku.sku}
    itemToAdd.quantity = 1
    itemToAdd.productName = productAndSku.product.name;
    itemToAdd.productId = productAndSku.product.id;
    itemToAdd.creationTimestamp = moment().unix();
    itemToAdd.options =  productAndSku.options || []

    setOrderInCreation({
        ...orderInCreation(),
        order: {
            items: [...orderInCreation().order.items, itemToAdd]
        }
    })
}


export function getPriceWithOptions(item, single) {
    let tot = (parseFloat(item.price));
    (item.options || []).forEach( option => tot+= parseFloat(option.price));
    if (single) {
        return tot.toFixed(2);
    }
    return (tot * item.quantity).toFixed(2);
}