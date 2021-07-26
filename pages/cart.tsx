import FlexBox from '@component/FlexBox'
import CheckoutNavLayout from '@component/layout/CheckoutNavLayout'
import ProductCard7 from '@component/product-cards/ProductCard7'
import { Span } from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import countryList from '@data/countryList'
import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { CartItem } from '@reducer/cartReducer'
import Link from 'next/link'
import useAuth from "@hook/useAuth";
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPathsUtil, getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import {getCartItems} from "../src/util/cartUtil";
import {getBrandCurrency} from "../src/util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../src/util/constants";
import DealCard7 from "@component/product-cards/DealCard7";

export interface CartProps {
  contextData?: any
}

const Cart:React.FC<CartProps> = ({contextData}) => {
  //const { state } = useAppContext()
  //const cartList: CartItem[] = state.cart.cartList
  const { orderInCreation } = useAuth();
  const currency = getBrandCurrency(contextData ? contextData.brand : null)
  const getTotalPrice = () => {
    return 100
    // return (
    //   cartList.reduce(
    //     (accumulator, item) => accumulator + item.price * item.qty,
    //     0
    //   ) || 0
    // )
  }



  return (
    <CheckoutNavLayout contextData={contextData}>
      {/*<p>{JSON.stringify(orderInCreation(), null, 2)}</p>*/}
      <Grid container spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          {getCartItems(orderInCreation).map((item) => {
              //<p>{JSON.stringify(item)}</p>
              if (item.type === TYPE_DEAL) {
                return(<DealCard7 key={item.id} item={item} currency={currency} products={contextData ? contextData.products : []}/>)
              }
              else if (item.type === TYPE_PRODUCT) {
                return(<ProductCard7 key={item.id} item={item} currency={currency} products={contextData ? contextData.products : []}/>)
              }
          })}
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Card
            sx={{
              padding: '1.5rem 1.75rem',
              '@media only screen and (max-width: 678px)': {
                padding: '1rem',
              },
            }}
          >
            <FlexBox justifyContent="space-between" alignItems="center" mb={2}>
              <Span color="grey.600">Total:</Span>
              <FlexBox alignItems="flex-end">
                <Span fontSize="18px" fontWeight="600" lineHeight="1">
                  ${getTotalPrice().toFixed(2)}
                </Span>
                <Span fontWeight="600" fontSize="14px" lineHeight="1">
                  00
                </Span>
              </FlexBox>
            </FlexBox>

            <Divider sx={{ mb: '1rem' }} />

            <FlexBox alignItems="center" mb={2}>
              <Span fontWeight="600" mr={1.25}>
                Additional Comments
              </Span>
              <Span
                fontSize="12px"
                color="primary.main"
                lineHeight="1"
                p="6px 10px"
                bgcolor="primary.light"
                borderRadius="3px"
              >
                Note
              </Span>
            </FlexBox>

            <TextField
              variant="outlined"
              rows={6}
              fullWidth
              multiline
              sx={{ mb: '1rem' }}
            />

            <Divider sx={{ mb: '1rem' }} />

            <TextField
              label="Voucher"
              placeholder="Voucher"
              size="small"
              variant="outlined"
              fullWidth
            />

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                mt: '1rem',
                mb: '30px',
              }}
            >
              Apply Voucher
            </Button>

            <Divider sx={{ mb: '1rem' }} />

            <Span fontWeight="600" mb={2} display="block">
              Shipping Estimates
            </Span>

            <Autocomplete
              options={countryList}
              getOptionLabel={(option) => option.label}
              fullWidth
              sx={{ mb: '1rem' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  placeholder="Select Country"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <TextField
              label="State"
              placeholder="Select State"
              select
              variant="outlined"
              size="small"
              fullWidth
            >
              {stateList.map((item) => (
                <MenuItem value={item.value} key={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Zip Code"
              placeholder="3100"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: '1rem' }}
            />

            <Button variant="outlined" color="primary" fullWidth sx={{ my: '1rem' }}>
              Calculate Shipping
            </Button>

            <Link href="/checkout">
              <Button variant="contained" color="primary" fullWidth>
                Checkout Now
              </Button>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

const stateList = [
  {
    value: 'New York',
    label: 'New York',
  },
  {
    value: 'Chicago',
    label: 'Chicago',
  },
]

export default Cart
