import CheckoutForm from '@component/checkout/CheckoutForm'
import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import { Grid } from '@material-ui/core'
import React from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import useAuth from "@hook/useAuth";


export interface CheckoutProps {
  //contextData?: any
}

const Checkout:React.FC<Checkout> = () => {
  const {getContextData, currentBrand} = useAuth();

  let publicKey = currentBrand()?.config?.paymentWebConfig?.stripePublicKey;
  console.log("publicKey" + publicKey)
  //console.log("publicKey" + JSON.stringify(currentBrand()?.config?.paymentWebConfig || {}));
  //const stripePromise = loadStripe("pk_test_51HcnJ8CbzAqh3BSlQjObyHGav4oJaZVP9JfH0VnVDS8sAu9qGi57PV5BQ3NTJGNz9V5WLPXQrBhe3yTW9vCy9tOT009bLe7Kl8");
  const stripePromise = loadStripe(publicKey);

  //const stripePromise = loadStripe("fake");


  return (
    <CheckoutNavLayout contextData={getContextData()}>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <Elements stripe={stripePromise}>
            <CheckoutForm contextData={getContextData()}/>
          </Elements>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <OrderAmountSummary currency={getBrandCurrency(getContextData()?.brand)}/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   return await getStaticPropsUtil();
// }

export default Checkout
