import {Container} from '@material-ui/core'
import React from 'react'
import Navbar from "@component/navbar/Navbar";
import AppLayout from "@component/layout/AppLayout";

const SalesPageSite = () => {
  // const productPerPage = 28
  // const [productList, setProductList] = useState<any[]>([])
  // const [page, setPage] = useState(1)
  //
  // const handlePageChange = (_e: any, page: number) => {
  //   console.log(page)
  //   setPage(page)
  // }
  //
  // const renderProductCount = () => {
  //   // starting index = 0
  //   let startNumber = (page - 1) * productPerPage
  //   let endNumber = page * productPerPage
  //   let totalProduct = productDatabase.length
  //
  //   if (endNumber > totalProduct) endNumber = totalProduct
  //
  //   return `Showing ${startNumber - 1}-${endNumber} of ${totalProduct} products`
  // }

  // useEffect(() => {
  //   setProductList(
  //     productDatabase.slice(page * productPerPage, (page + 1) * productPerPage)
  //   )
  // }, [page])

  return (
    <AppLayout navbar={<Navbar />}>
      <Container sx={{ mt: '2rem' }}>
        <h1>SALES</h1>
      {/*  <Grid container spacing={3} minHeight={500}>*/}
      {/*    {productList.map((item, ind) => (*/}
      {/*      <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>*/}
      {/*        <ProductCard1 {...item} />*/}
      {/*      </Grid>*/}
      {/*    ))}*/}
      {/*  </Grid>*/}

      {/*  <FlexBox*/}
      {/*    flexWrap="wrap"*/}
      {/*    justifyContent="space-between"*/}
      {/*    alignItems="center"*/}
      {/*    my="4rem"*/}
      {/*  >*/}
      {/*    <Span>{renderProductCount()}</Span>*/}
      {/*    <Pagination*/}
      {/*      page={page}*/}
      {/*      variant="outlined"*/}
      {/*      color="primary"*/}
      {/*      count={Math.ceil(productDatabase.length / productPerPage)}*/}
      {/*      onChange={handlePageChange}*/}
      {/*    />*/}
      {/*  </FlexBox>*/}
      </Container>
    </AppLayout>
  )
}

export default SalesPageSite
