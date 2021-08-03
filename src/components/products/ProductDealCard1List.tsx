import FlexBox from '@component/FlexBox'
import {Grid, Pagination} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {FilterProps} from "@component/products/ProductFilterCard";
import {getBrandCurrency} from "../../util/displayUtil";
import {cloneDeep} from "@apollo/client/utilities";
import ProductCardDeal1 from "@component/product-cards/ProductCardDeal1";
import useAuth from "@hook/useAuth";

var elasticlunr = require('elasticlunr')
export interface ProductCard1ListProps {
    filter: FilterProps
    query: String
    category: string,
    contextData: any,
    modeFullScren: boolean
    restrictedskuRefs: any
    lineNumber: number,
    deal: any
}

export const ALL_CAT = "all";

const itemPerPage = 9;

const ProductCard1List: React.FC<ProductCard1ListProps> = ({filter,
                                                               query,
                                                               category,
                                                               contextData,
                                                               modeFullScren,
                                                               restrictedskuRefs,
                                                               lineNumber,
                                                                deal
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
    const {dealEdit} = useAuth();

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
            filteredProduct = filteredProduct.filter(p => p.skus && p.skus.some(sku => restrictedskuRefs.includes(sku.extRef)));
            filteredProduct = cloneDeep(filteredProduct);
            filteredProduct.forEach(product => {
                product.skus = product.skus.filter(sku => restrictedskuRefs.includes(sku.extRef))
            })
        }

        setAllProducts(
            filteredProduct);

        setPage(0);
        setMaxPage(Math.floor(filteredProduct.length / itemPerPage) + 1);
        setProductDisplay(filteredProduct.slice(0,
            Math.min(filteredProduct.length, itemPerPage)))

    }, [category, filter, contextData, restrictedskuRefs])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        if (!allProducts) {
            return;
        }
        setProductDisplay(allProducts.slice((value - 1)* itemPerPage,
            Math.min(allProducts.length-1, value * itemPerPage)))

        setPage(value);
    };


    function getLgSize(modeFullScren) {
         return modeFullScren? 3 : 4
    }

    function getSmSize(modeFullScren) {
        return modeFullScren? 4 : 6
    }

    return (
        <div>

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

                                <ProductCardDeal1 product={item}
                                              deal={deal}
                                              options={contextData.options}
                                              lineNumber={lineNumber}
                                              currency={getBrandCurrency(contextData.brand)}/>
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
