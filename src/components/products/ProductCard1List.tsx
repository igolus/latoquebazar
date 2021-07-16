import FlexBox from '@component/FlexBox'
import ProductCard1 from '@component/product-cards/ProductCard1'
import { Span } from '@component/Typography'
import { Grid, Pagination } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {FilterProps} from "@component/products/ProductFilterCard";
import {getBrandCurrency} from "../../util/displayUtil";

var elasticlunr = require('elasticlunr')
export interface ProductCard1ListProps {
    filter: FilterProps
    query: String
    category: string,
    contextData: any,
}

export const ALL_CAT = "all";

const itemPerPage = 9;

const ProductCard1List: React.FC<ProductCard1ListProps> = ({filter, query, category, contextData}) => {

    var productMapper = (product) => {
        return {
            "id": product.id,
            "category": product.category ? product.category.category : "",
            "name": product.name
        }
    }


    const [allProducts, setAllProducts] = useState(contextData ? (contextData.products || []) : []);
    const [productDisplay, setProductDisplay] = React.useState([]);
    const [maxPage, setMaxPage] = React.useState(0);
    const [page, setPage] = React.useState(1);

    useEffect( () => {
        let filteredProduct = [];
        let productsLoaded = contextData ? (contextData.products || []) : []

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
            //filteredProduct = productsLoaded
            filteredProduct = productsLoaded.filter(product =>
                product.category == null ||
                category == ALL_CAT ||
                product.category && product.category.category== category);
        }

        setAllProducts(
            filteredProduct);

        setPage(0);
        setMaxPage(Math.floor(filteredProduct.length / itemPerPage) + 1);
        setProductDisplay(filteredProduct.slice(0,
            Math.min(filteredProduct.length, itemPerPage)))

    }, [category, filter, contextData])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        if (!allProducts) {
            return;
        }
        setProductDisplay(allProducts.slice((value - 1)* itemPerPage,
            Math.min(allProducts.length-1, value * itemPerPage)))

        setPage(value);
    };

    return (
        <div>
            {/*<p>{JSON.stringify(products)}</p>*/}
            <Grid container spacing={3}>
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
                            <Grid item lg={4} sm={6} xs={12} key={ind}>
                                <ProductCard1 {...itemShop} product={item}
                                              options={contextData.options} currency={getBrandCurrency(contextData.brand)}/>
                                {/*<ProductCard1 {...item} />*/}
                            </Grid>
                        )
                    }

                )}
            </Grid>

            <FlexBox
                flexWrap="wrap"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
            >
                <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
                <Pagination count={maxPage} variant="outlined" color="primary" page={page} onChange={handleChange}/>
            </FlexBox>
        </div>
    )
}

export default ProductCard1List
