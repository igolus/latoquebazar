import FlexBox from '@component/FlexBox'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import ProductCard7 from '@component/product-cards/ProductCard7'
import {Box, Button, Grid,} from '@material-ui/core'
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
import ChargeCard7 from "@component/product-cards/ChargeCard7";
import EmptyBasket from "../src/components/shop/EmptyBasket";

export interface CartProps {
  contextData?: any
}

const Cart:React.FC<CartProps> = ({contextData}) => {

  const {getContextDataAuth} = useAuth();

  function getContextData() {
    if (getContextDataAuth()) {
      return getContextDataAuth()
    }
    return contextData;
  }

  const { getOrderInCreation} = useAuth();
  const currency = getBrandCurrency(getContextData() ? getContextData().brand : null)

  return (
    <CheckoutNavLayout contextData={getContextData()}>
      {/*<p>{JSON.stringify(orderInCreation(), null, 2)}</p>*/}
      <Grid container spacing={3}>
        <Grid item lg={8} md={8} xs={12}>

          {(getOrderInCreation()?.charges || []).map((chargeItem, key) =>
              <ChargeCard7 item={chargeItem} currency={currency}/>
          )}

          {getCartItems(getOrderInCreation).map((item, key) => {

              //<p>{JSON.stringify(item)}</p>
              if (item.type === TYPE_DEAL) {
                return(<DealCard7 key={key} deal={item} currency={currency} products={getContextData() ? getContextData().products : []}/>)
              }
              else if (item.type === TYPE_PRODUCT) {
                return(<ProductCard7 key={key} item={item} currency={currency} products={getContextData() ? getContextData().products : []}/>)
              }
          })}

          {/*<p>{JSON.stringify(getOrderInCreation()?.charges || {})}</p>*/}

          {getCartItems(getOrderInCreation).length == 0 && (
              <EmptyBasket/>
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
          <OrderAmountSummary currency={getBrandCurrency(getContextData()?.brand)} hideDetail/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Cart
