import CheckoutForm from '@component/checkout/CheckoutForm'
import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import { Grid } from '@material-ui/core'
import React from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";


export interface CheckoutProps {
  contextData?: any
}

const Checkout:React.FC<Checkout> = ({contextData}) => {
  return (
    <CheckoutNavLayout contextData={contextData}>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm contextData={contextData}/>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <OrderAmountSummary currency={getBrandCurrency(contextData.brand)}/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Checkout
