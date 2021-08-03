import CheckoutForm from '@component/checkout/CheckoutForm'
import CheckoutSummary from '@component/checkout/CheckoutSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import { Grid } from '@material-ui/core'
import React from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";
import ConfirmInfo from "../src/components/confirm/ConfirmInfo";

export interface ConfirmedProps {
  contextData?: any
}

const Confirmed:React.FC<ConfirmedProps> = ({contextData}) => {
  return (
    <CheckoutNavLayout contextData={contextData}>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <ConfirmInfo contextData={contextData}/>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary currency={getBrandCurrency(contextData.brand)}/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Confirmed
