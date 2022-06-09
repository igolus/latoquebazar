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
            content_ids: [productAndSku.sku.id],
            content_name: productAndSku.sku.name,
            content_category: 'Shoes',
            value: 0.50,
            currency: 'USD'
        });
    });
}
