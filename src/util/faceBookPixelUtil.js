function callReactPixel(brand, doWithReactPixel) {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
            let pixelId = brand?.config.facebookPixelId;
            if (pixelId) {
                ReactPixel.init(pixelId) // facebookPixelId
                doWithReactPixel(ReactPixel);
            }
        })
}

export const pixelAddDealToCart = (brand, deal) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    let price = 0;
    if (!deal.deal.lines) {
        return;
    }
    deal.deal.lines.forEach(line => {
        price += parseFloat(line.pricingValue || "0")
    })

    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('AddToCart', {
            content_type: 'deal',
            content_ids: [deal.deal.id || deal.deal.extRef],
            content_category: 'deal',
            value: price,
            currency: 'EUR',
            contents: [{
                id: deal.deal.id || deal.deal.extRef,
                quantity: 1,
            }]
        });
    });
}

export const pixelAddToCart = (brand, productAndSku) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('AddToCart', {
            content_type: 'product',
            content_ids: [productAndSku.sku.id || productAndSku.sku.extRef],
            content_name: productAndSku.sku.name,
            content_category: productAndSku.product.category.category,
            value: parseFloat(productAndSku.sku.price),
            currency: 'EUR',
            contents: [{
                id: productAndSku.sku.id || productAndSku.sku.extRef,
                quantity: 1,
            }]
        });
    });
}

export const pixelAddToCartData = (brand, id, name, qte, price) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('AddToCart', {
            content_type: 'product',
            content_ids: [id],
            content_name: name,
            value: parseFloat(price),
            currency: 'EUR',
            contents: [{
                id: id,
                quantity: qte,
            }]
        });
    });
}


export const pixelViewContent = (brand, productAndSku) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('ViewContent', {
            content_type: 'product',
            content_ids: [productAndSku?.sku?.id || productAndSku?.sku?.extRef],
            content_name: productAndSku?.sku?.name,
            content_category: productAndSku?.product?.category.category,
            value: parseFloat(productAndSku?.sku?.price),
            currency: 'EUR',
            contents: [{
                id: productAndSku.sku.id || productAndSku.sku.extRef,
                quantity: 1,
            }]
        });
    });
}

export const pixelCompleteRegistration = (brand) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('CompleteRegistration', {});
    });
}

export const pixelPurchaseContent = (brand, orderInCreation) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('Purchase', {
            content_type: 'product',
            value: parseFloat(orderInCreation.totalPrice),
            currency: 'EUR',
            contents: getItemsPixel(orderInCreation)
        });
    });
}

export const pixelInitiateCheckout = (brand, orderInCreation) => {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    callReactPixel(brand, ReactPixel => {
        let itemsPixel = getItemsPixel(orderInCreation);
        ReactPixel.track('InitiateCheckout', {
            content_type: 'product',
            value: parseFloat(orderInCreation.totalPrice),
            currency: 'EUR',
            contents: itemsPixel,
            num_items: itemsPixel.length,
        });
    });
}


function getItemsPixel(orderInCreation) {
    if (process.env.NODE_ENV !== 'production') {
        return [];
    }
    let items = [];

    let itemsStandard = orderInCreation?.order?.items || [];
    itemsStandard.forEach(item => {
        items.push({
            id: item.id || item.extRef,
            quantity: item.quantity,
        })
    })

    let itemsDeal = orderInCreation?.order?.deals || [];
    itemsDeal.forEach(deal => {
        items.push({
            id: deal.deal.id || deal.deal.extRef,
            quantity: deal.deal.quantity,
        })
    })
    return items;
}
