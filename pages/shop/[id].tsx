import NavbarLayout from '@component/layout/NavbarLayout'
import ProductCard1List from '@component/products/ProductCard1List'
import ProductFilterCard from '@component/products/ProductFilterCard'
import ShopIntroCard from '@component/shop/ShopIntroCard'
import Sidenav from '@component/sidenav/Sidenav'
import useWindowSize from '@hook/useWindowSize'
import { Grid, IconButton } from '@material-ui/core'
import FilterList from '@material-ui/icons/FilterList'
import React, {useCallback, useState} from 'react'

const Shop = () => {
  const width = useWindowSize()
  const isTablet = width < 1025
  const [filter, setFilter] = useState(null);

  const productFilter = useCallback(
        (filterValue) => () => {
            //alert("Filter " + JSON.stringify(filterValue))
            setFilter(v)
        },
        []
    )

  return (
    <NavbarLayout>
      <ShopIntroCard />
      <Grid container spacing={3}>
        <Grid
          item
          md={3}
          xs={12}
          sx={{
            '@media only screen and (max-width: 1024px)': {
              display: 'none',
            },
          }}
        >
          <ProductFilterCard callBackFilter={(v) => alert(v)}/>
        </Grid>

        <Grid item md={9} xs={12}>
          {isTablet && (
            <Sidenav
              position="left"
              handle={
                <IconButton
                  sx={{
                    marginLeft: 'auto',
                    display: 'block',
                  }}
                >
                  <FilterList fontSize="small" />
                </IconButton>
              }
            >
                <ProductFilterCard callBackFilter={(v) => alert(v)}/>
            </Sidenav>
          )}
          <ProductCard1List />
        </Grid>
      </Grid>
    </NavbarLayout>
  )
}

export default Shop
