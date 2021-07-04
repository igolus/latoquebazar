import FlexBox from '@component/FlexBox'
import ProductCard1 from '@component/product-cards/ProductCard1'
import { Span } from '@component/Typography'
import productDatabase from '@data/product-database'
import { Grid, Pagination } from '@material-ui/core'
import React from 'react'

export interface ProductCard1ListProps {}

const ProductCard1List: React.FC<ProductCard1ListProps> = () => {
    const itemProducts = productDatabase.slice(0, 201);
    const itemPerPage = 10;
    const maxPage = Math.floor(itemProducts.length / itemPerPage);

    //const [indexProduct, setIndexProduct] = React.useState(0);
    const [productDisplay, setProductDisplay] = React.useState(itemProducts.slice(0,
        Math.min(itemProducts.length-1, itemPerPage)));
    const [page, setPage] = React.useState(1);
    //



    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        // alert("page " + value);
        // alert((page - 1)* itemPerPage)
        // alert(itemProducts.length-1)
        // alert(Math.min(itemProducts.length-1, value * itemPerPage))
        setProductDisplay(itemProducts.slice((value - 1)* itemPerPage,
            Math.min(itemProducts.length-1, value * itemPerPage)))

        setPage(value);
    };



    return (
    <div>
      <Grid container spacing={3}>
        {productDisplay.map((item, ind) => (
          <Grid item lg={4} sm={6} xs={12} key={ind}>
            <ProductCard1 {...item} />
          </Grid>
        ))}
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
