export const getReactPixel = (brand) => {
    if (currentEstablishment()) {
        return currentEstablishment();
    }
    return contextData?.establishments[0];
}

function callReactPixel(brand, doWithReactPixel) {
    import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
            ReactPixel.init(brand?.config.facebookPixelId) // facebookPixelId
            doWithReactPixel(ReactPixel);
            //ReactPixel.pageView()
        })
}

export const pixelAddToCart = (brand, productAndSku) => {
    callReactPixel(brand, ReactPixel => {
        ReactPixel.track('AddToCart', {
            content_type: 'product',
            content_ids: [productAndSku.sku.id || productAndSku.sku.extRef],
            content_name: productAndSku.sku.name,
            content_category: productAndSku.product.category.category,
            value: parseFloat(productAndSku.sku.price),
            currency: 'EUR'
        });
    });
}
