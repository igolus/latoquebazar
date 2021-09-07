import FlexBox from '@component/FlexBox'
import ProductCard1 from '@component/product-cards/ProductCard1'
import {Grid, Pagination} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {FilterProps} from "@component/products/ProductFilterCard";
import {getMininimalSkuPrice, getBrandCurrency} from "../../util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";
import DealCard1 from "@component/product-cards/DealCard1";
import {cloneDeep} from "@apollo/client/utilities";
import {PRICE_ASC, PRICE_DESC} from "@component/products/ProductList";

var elasticlunr = require('elasticlunr')
export interface ProductCard1ListProps {
    filter: FilterProps
    query: String
    category: string,
    contextData: any,
    modeFullScren: boolean
    restrictedskuRefs: any
    tagsSelected: any
    sortOption: string
}

export const ALL_CAT = "all";

const itemPerPage = 9;

const ProductCard1List: React.FC<ProductCard1ListProps> = ({filter,
                                                               query,
                                                               category,
                                                               contextData,
                                                               modeFullScren,
                                                               restrictedskuRefs,
                                                               tagsSelected,
                                                               sortOption,
}) => {

    var productMapper = (product) => {
        return {
            "id": product.id,
            "category": product.category ? product.category.category : "",
            "name": product.name
        }
    }

    const getProductsAndDeals = () => {
        return contextData.products.concat(contextData.deals)
        //return contextData.products;
    }

    const [allProducts, setAllProducts] = useState(contextData ? (getProductsAndDeals() || []) : []);
    //const [allDeals, setAllDeals] = useState(contextData ? (contextData.deals || []) : []);
    const [productDisplay, setProductDisplay] = React.useState([]);
    const [maxPage, setMaxPage] = React.useState(0);
    const [page, setPage] = React.useState(1);

    useEffect( () => {
        let filteredProduct = [];
        let productsLoaded = contextData ? (getProductsAndDeals() || []) : []
        //alert("productsLoaded " + productsLoaded.length)
        if (query) {
            var index = elasticlunr();
            index.addField('category');
            index.addField('name');
            index.setRef("id");
            for (let i = 0; i < productsLoaded.length; i++) {
                //alert("add p " + productsLoaded[i])
                index.addDoc(productMapper(productsLoaded[i]))
            }

            let search = index.search(query);
            let allRef = search.map(item => item.ref)
            filteredProduct = productsLoaded.filter(p => allRef.includes(p.id));
            //alert("size search  " + filteredProduct.length)
        }
        else {
            if (category == ALL_CAT) {
                filteredProduct = productsLoaded
            }
            else {
                filteredProduct = productsLoaded.filter(product =>
                    product.category && product.category.category== category);
            }
        }

        if (restrictedskuRefs) {
            //filteredProduct = filteredProduct.filter(p => p.skus.some(sku => restrictedskuRefs.includes(sku.extRef)));
            filteredProduct = filteredProduct.filter(p => p.skus && p.skus.some(sku => restrictedskuRefs.includes(sku.extRef)));
            filteredProduct = cloneDeep(filteredProduct);
            filteredProduct.forEach(product => {
                product.skus = product.skus.filter(sku => restrictedskuRefs.includes(sku.extRef))
            })
        }

        if (tagsSelected && tagsSelected.length > 0) {
            filteredProduct = filteredProduct.filter(product => {
                return product.tags.map(t => t.id).some(id => tagsSelected.map(t => t.id).includes(id));
            })
        }

        filteredProduct = filteredProduct.filter(p => !p.skus || p.skus.some(s => s.visible))

        if (sortOption && sortOption === PRICE_ASC) {
            filteredProduct.sort((p1, p2) => getMininimalSkuPrice(p1) - getMininimalSkuPrice(p2))
        }

        if (sortOption && sortOption === PRICE_DESC) {
            filteredProduct = filteredProduct.sort((p1, p2) => getMininimalSkuPrice(p2) - getMininimalSkuPrice(p1))
        }


        setAllProducts(
            filteredProduct);

       //console.log("filteredProduct " + JSON.stringify(filteredProduct, null, 2))
        setPage(0);
        // alert("MaxPag " + Math.floor(filteredProduct ? filteredProduct.length : 0 / itemPerPage) + 1)
        // alert("filteredProduct.length " + filteredProduct.length);

        let pSize = filteredProduct ? filteredProduct.length : 0


        let maxPage = Math.floor(pSize/ itemPerPage) + 1;
        if (pSize % itemPerPage == 0) {
            maxPage = pSize/itemPerPage;
        }
        //alert("maxPage " + maxPage)

        setMaxPage(maxPage);
        setProductDisplay(filteredProduct.slice(0,
            Math.min(filteredProduct.length + 1, itemPerPage)))

    }, [category, filter, contextData, restrictedskuRefs, tagsSelected, sortOption])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        if (!allProducts) {
            return;
        }
        setProductDisplay(allProducts.slice((value - 1)* itemPerPage,
            Math.min(allProducts.length, value * itemPerPage)))

        setPage(value);
    };


    function getLgSize(modeFullScren) {
         // let minProduct = Math.floor(12 / productDisplay.length);
         // return Math.max(modeFullScren? 3 : 4, minProduct);

         return modeFullScren? 3 : 4
    }

    function getSmSize(modeFullScren) {
        // let minProduct = Math.floor(12 / productDisplay.length);
        // return Math.max(modeFullScren? 4 : 6, minProduct);

        return modeFullScren? 4 : 6
    }

    return (
        <div>
            {/*<p>{JSON.stringify(productDisplay)}</p>*/}
            {/*<p>{JSON.stringify(allProducts)}</p>*/}
            {/*<p>{JSON.stringify(restrictedskuRefs)}</p>*/}
            <Grid container spacing={3} justifyContent="center" >
                {productDisplay.map((item, ind) => {
                        let url = "/assets/images/Icon_Sandwich.png";

                        if (item.files && item.files.length > 0) {
                            url = item.files[0].url;
                        }

                        let itemShop = {
                            id: item.id,
                            imgUrl: url,
                            title: item.name,
                            price: 200,
                            hoverEffect: true
                        }
                        return (
                            <Grid item
                                  lg={getLgSize(modeFullScren)}
                                  sm={getSmSize(modeFullScren)}
                                  xs={12} key={ind}>

                                {/*<h1>{item.name}</h1>*/}
                                {item.type === TYPE_PRODUCT && !restrictedskuRefs &&
                                <ProductCard1 {...itemShop} product={item}
                                              options={contextData.options}
                                              currency={getBrandCurrency(contextData.brand)}/>
                                }
                                {item.type === TYPE_DEAL &&
                                <DealCard1 {...itemShop} deal={item}
                                              options={contextData.options}
                                              currency={getBrandCurrency(contextData.brand)}/>
                                }
                                {/*<ProductCard1 {...item} />*/}
                            </Grid>
                        )
                    }

                )}
            </Grid>
            {maxPage > 1 &&
                <FlexBox
                    flexWrap="wrap"
                    flexDirection="row-reverse"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                >
                    {/*<Span color="grey.600">Showing 1-9 of 1.3k Products</Span>*/}
                    <Pagination count={maxPage} variant="outlined" color="primary" page={page} onChange={handleChange}/>
                </FlexBox>
            }
        </div>
    )
}

export default ProductCard1List
