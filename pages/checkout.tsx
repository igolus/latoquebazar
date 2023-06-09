import CheckoutForm from '@component/checkout/CheckoutForm'
import OrderAmountSummary from '@component/checkout/OrderAmountSummary'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import {Divider, Grid} from '@material-ui/core'
import React, {useState} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import useAuth from "@hook/useAuth";
import Head from 'next/head';


export interface CheckoutProps {
  contextData?: any
}

const Checkout:React.FC<Checkout> = ({contextData}) => {

  function getContextData() {
    return contextData;
  }

  const {currentBrand} = useAuth();
  const [addressLoading, setAddressLoading] = useState(false);

  let publicKey = currentBrand()?.config?.paymentWebConfig?.stripePublicKey;
  //console.log("publicKey" + publicKey)
  //console.log("publicKey" + JSON.stringify(currentBrand()?.config?.paymentWebConfig || {}));
  //const stripePromise = loadStripe("pk_test_51HcnJ8CbzAqh3BSlQjObyHGav4oJaZVP9JfH0VnVDS8sAu9qGi57PV5BQ3NTJGNz9V5WLPXQrBhe3yTW9vCy9tOT009bLe7Kl8");
  let stripePromise;
  if (publicKey) {
    stripePromise = loadStripe(publicKey);
  }

  //const stripePromise = loadStripe("fake");


  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/classic-reset.css"/>
        <script
                src="https://api.systempay.fr/static/js/krypton-client/V4.0/ext/classic.js">
        </script>
      </Head>
    <CheckoutNavLayout contextData={getContextData()}>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          {stripePromise ?
              <Elements stripe={stripePromise}>
                <CheckoutForm
                    setAddressLoading={setAddressLoading}
                    contextData={getContextData()}
                    noStripe={false}
                    addressLoading={addressLoading}
                />
              </Elements>
              :
              <CheckoutForm
                  contextData={getContextData()}
                  setAddressLoading={setAddressLoading}
                  noStripe={true}
                  addressLoading={addressLoading}
              />
          }

        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <OrderAmountSummary
              loading={addressLoading}
              currency={getBrandCurrency(getContextData()?.brand)}
              contextData={getContextData()}/>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default Checkout
