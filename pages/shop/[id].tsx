import useWindowSize from '@hook/useWindowSize'
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
      <></>
    // <NavbarLayout contextData={contextData}>
    //   <ShopIntroCard />
    //   <Grid container spacing={3}>
    //     <Grid
    //       item
    //       md={3}
    //       xs={12}
    //       sx={{
    //         '@media only screen and (max-width: 1024px)': {
    //           display: 'none',
    //         },
    //       }}
    //     >
    //       <ProductFilterCard callBackFilter={(v) => alert(v)}/>
    //     </Grid>
    //
    //     <Grid item md={9} xs={12}>
    //       {isTablet && (
    //         <Sidenav
    //           position="left"
    //           handle={
    //             <IconButton
    //               sx={{
    //                 marginLeft: 'auto',
    //                 display: 'block',
    //               }}
    //             >
    //               <FilterList fontSize="small" />
    //             </IconButton>
    //           }
    //         >
    //             <ProductFilterCard callBackFilter={(v) => alert(v)}/>
    //         </Sidenav>
    //       )}
    //       <ProductCard1List />
    //     </Grid>
    //   </Grid>
    // </NavbarLayout>
  )
}

export default Shop
