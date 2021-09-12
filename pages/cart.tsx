import FlexBox from '@component/FlexBox'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import ProductCard7 from '@component/product-cards/ProductCard7'
import {Span} from '@component/Typography'
import countryList from '@data/countryList'
import {Autocomplete, Box, Button, Card, Divider, Grid, MenuItem, TextField,} from '@material-ui/core'
import Link from 'next/link'
import useAuth from "@hook/useAuth";
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import {getCartItems} from "../src/util/cartUtil";
import {getBrandCurrency} from "../src/util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../src/util/constants";
import DealCard7 from "@component/product-cards/DealCard7";
import LazyImage from "@component/LazyImage";
import localStrings from "../src/localStrings";
import {isMobile} from "react-device-detect";
import OrderAmountSummary from "@component/checkout/OrderAmountSummary";

export interface CartProps {
  contextData?: any
}

const Cart:React.FC<CartProps> = ({contextData}) => {
  const { getOrderInCreation } = useAuth();
  const currency = getBrandCurrency(contextData ? contextData.brand : null)

  return (
    <CheckoutNavLayout contextData={contextData}>
      {/*<p>{JSON.stringify(orderInCreation(), null, 2)}</p>*/}
      <Grid container spacing={3}>
        <Grid item lg={8} md={8} xs={12}>

          {getCartItems(getOrderInCreation).map((item) => {

              //<p>{JSON.stringify(item)}</p>
              if (item.type === TYPE_DEAL) {
                return(<DealCard7 key={item.id} deal={item} currency={currency} products={contextData ? contextData.products : []}/>)
              }
              else if (item.type === TYPE_PRODUCT) {
                return(<ProductCard7 key={item.id} item={item} currency={currency} products={contextData ? contextData.products : []}/>)
              }
          })}


          {getCartItems(getOrderInCreation).length == 0 && (
              <FlexBox
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  //mt="calc(100% - 74px)"
                  height={isMobile ? "none" : "calc(100% - 74px)"}
              >
                <LazyImage
                    src="/assets/images/logos/shopping-bag.svg"
                    width="200px"
                    height="100%"
                />
                <Box
                    component="p"
                    mt={2}
                    color="grey.600"
                    textAlign="center"
                    maxWidth="200px"
                >
                  {localStrings.emptyBasket}
                </Box>
              </FlexBox>
          )}

          {getCartItems(getOrderInCreation).length > 0 &&
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <Link href="/product/shop/all">
                <Button variant="contained" color="primary" type="button" fullWidth
                        style={{textTransform: "none"}}
                >
                  {localStrings.continueShopping}
                </Button>
              </Link>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Link href="/checkout">
                <Button variant="contained" color="primary" type="button" fullWidth>
                  {localStrings.checkOutNow}
                </Button>
              </Link>
            </Grid>

          </Grid>
          }

        </Grid>



        <Grid item lg={4} md={4} xs={12}>
          <OrderAmountSummary currency={getBrandCurrency(contextData.brand)} hideDetail/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Cart
