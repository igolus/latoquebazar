import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import ProductCard7 from '@component/product-cards/ProductCard7'
import {Button, Grid,} from '@material-ui/core'
import Link from 'next/link'
import useAuth from "@hook/useAuth";
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import {getCartItems} from "../src/util/cartUtil";
import {getBrandCurrency} from "../src/util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../src/util/constants";
import DealCard7 from "@component/product-cards/DealCard7";
import localStrings from "../src/localStrings";
import OrderAmountSummary from "@component/checkout/OrderAmountSummary";
import ChargeCard7 from "@component/product-cards/ChargeCard7";
import EmptyBasket from "../src/components/shop/EmptyBasket";
import DiscountCard7 from "@component/product-cards/DiscountCard7";

export interface CartProps {
  contextData?: any
}

const Cart:React.FC<CartProps> = ({contextData}) => {
  const language = contextData?.brand?.config?.language || 'fr';
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

      <>
        {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
        <CheckoutNavLayout
            title={localStrings.cart}
            description={localStrings.cartDesc}
            contextData={getContextData()}>
          {/*<p>{JSON.stringify(getOrderInCreation() || {}, null, 2)}</p>*/}
          <Grid container spacing={3}>
            <Grid item lg={8} md={8} xs={12}>

              {(getOrderInCreation()?.discounts || []).map((discountItem, key) =>
                  <DiscountCard7 item={discountItem}/>
              )}

              {(getOrderInCreation()?.charges || []).map((chargeItem, key) =>
                  <ChargeCard7 item={chargeItem} currency={currency}/>
              )}

              {getCartItems(getOrderInCreation).map((item, key) => {

                //<p>{JSON.stringify(item)}</p>
                if (item.type === TYPE_DEAL) {
                  return(<DealCard7 key={key} deal={item} currency={currency} contextData={getContextData()} products={getContextData() ? getContextData().products : []}/>)
                }
                else if (item.type === TYPE_PRODUCT) {
                  return(<ProductCard7 key={key}
                                       contextData={getContextData()}
                                       item={item}
                                       currency={currency}
                                       products={getContextData() ? getContextData().products : []}/>)
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
                    <Button variant="outlined" color="primary" type="button" fullWidth
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
              <OrderAmountSummary
                  hideCoupon
                  currency={getBrandCurrency(getContextData()?.brand)}
                  hideDetail contextData={getContextData()}

              />
            </Grid>
          </Grid>
        </CheckoutNavLayout>
      </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Cart
