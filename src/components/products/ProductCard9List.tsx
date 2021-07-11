import FlexBox from '@component/FlexBox'
import ProductCard9 from '@component/product-cards/ProductCard9'
import productDatabase from '@data/product-database'
import { Pagination } from '@material-ui/core'
import React, {useState} from 'react'
import { Span } from '../Typography'
import {FilterProps} from "@component/products/ProductFilterCard";

export interface ProductCard9ListProps {
    filter: FilterProps,
    query: String
}

const ProductCard9List: React.FC<ProductCard9ListProps> = ({filter, query}) => {
    //const initialProduct =

    const [products, setProducts] = useState([]);

    function changePagination() {
        //alert("page change")
    }

    return (
    <div>
        <p>ProductCard9List</p>
      {productDatabase.slice(95, 104)
          .filter(product => filter.selectedCategory == null || product.category == filter.selectedCategory)
          .map((item, ind) => (
        <ProductCard9 key={ind} {...item} />
      ))}

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
      >
        <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
        <Pagination count={10} variant="outlined" color="primary" onChange={changePagination}/>
      </FlexBox>
    </div>
  )
}

export default ProductCard9List
