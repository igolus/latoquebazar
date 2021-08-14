import FlexBox from '@component/FlexBox'
import Delivery from '@component/icons/Delivery'
import PackageBox from '@component/icons/PackageBox'
import TruckFilled from '@component/icons/TruckFilled'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import { H5, H6, Paragraph } from '@component/Typography'
import productDatabase from '@data/product-database'
import useWindowSize from '@hook/useWindowSize'
import { Avatar, Button, Card, Divider, Grid, Typography } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import Done from '@material-ui/icons/Done'
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import { Box, useTheme } from '@material-ui/system'
import { format } from 'date-fns'
import React, {Fragment, useEffect, useState} from 'react'
import {getStaticPathsUtil, getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {GetStaticPaths, GetStaticProps} from "next";
import {useRouter} from "next/router";
import {getOrderByIdQuery, getSiteUserOrderById} from "../../src/gql/orderGql";
import {executeQueryUtil} from "../../src/apolloClient/gqlUtil";
import useAuth from "@hook/useAuth";
import {
  formatProductAndSkuName, getBrandCurrency,
  getImgUrlFromProducts,
  getImgUrlFromProductsWithExtRef
} from "../../src/util/displayUtil";

const StyledFlexbox = styled(FlexBox)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: '2rem',
  marginBottom: '2rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },

  '& .line': {
    // flex={width < breakpoint ? 'unset' : '1 1 0'}
    // height={width < breakpoint ? 50 : 4}
    // minWidth={width < breakpoint ? 4 : 50}
    // bgcolor={ind < statusIndex ? 'primary.main' : 'grey.300'}
    flex: '1 1 0',
    height: 4,
    minWidth: 50,
    [theme.breakpoints.down('sm')]: {
      flex: 'unset',
      height: 50,
      minWidth: 4,
    },
  },
}))

type OrderStatus = 'packaging' | 'shipping' | 'delivering' | 'complete'

export interface OrderDetailsProps {
  contextData?: any
}

const OrderDetails:React.FC<OrderDetailsProps> = ({contextData}) => {
  const router = useRouter();
  //const brandId = contextData.brand.id;
  const { id } = router.query
  const {currentEstablishment, dbUser} = useAuth()
  const orderStatus: OrderStatus = 'shipping'
  const orderStatusList = ['packaging', 'shipping', 'delivering', 'complete']
  const stepIconList = [PackageBox, TruckFilled, Delivery]

  const statusIndex = orderStatusList.indexOf(orderStatus)
  const width = useWindowSize()
  const theme = useTheme()
  const breakpoint = 350
  console.log(theme.breakpoints.up('md'))

  const [order, setOrder] = useState(null)

  useEffect(async() => {
    if (contextData && contextData.brand && dbUser) {
      let result = await executeQueryUtil(getSiteUserOrderById(contextData.brand.id, dbUser.id , id));

      if (result && result.data) {
        //alert( "result.data " + result.data)
        let order = result.data.getSiteUserOrderById;
        setOrder(order)
      }
    }
  }, [contextData, currentEstablishment(), dbUser])

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title="Order Details"
        icon={ShoppingBag}
        button={
          <Button color="primary" sx={{ bgcolor: 'primary.light', px: '2rem' }}>
            Order Again
          </Button>
        }
      />
      {/*<p>{JSON.stringify(order || {})}</p>*/}
      {/*<p>{JSON.stringify(contextData ? contextData.products : {})}</p>*/}
      <Card sx={{ p: '2rem 1.5rem', mb: '30px' }}>

        <StyledFlexbox>
          {stepIconList.map((Icon, ind) => (
            <Fragment key={ind}>
              <Box position="relative">
                <Avatar
                  sx={{
                    height: 64,
                    width: 64,
                    bgcolor: ind <= statusIndex ? 'primary.main' : 'grey.300',
                    color: ind <= statusIndex ? 'grey.white' : 'primary.main',
                  }}
                >
                  <Icon color="inherit" sx={{ fontSize: '32px' }} />
                </Avatar>
                {ind < statusIndex && (
                  <Box position="absolute" right="0" top="0">
                    <Avatar
                      sx={{
                        height: 22,
                        width: 22,
                        bgcolor: 'grey.200',
                        color: 'success.main',
                      }}
                    >
                      <Done color="inherit" sx={{ fontSize: '1rem' }} />
                    </Avatar>
                  </Box>
                )}
              </Box>
              {ind < stepIconList.length - 1 && (
                <Box
                  className="line"
                  bgcolor={ind < statusIndex ? 'primary.main' : 'grey.300'}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

        <FlexBox justifyContent={width < breakpoint ? 'center' : 'flex-end'}>
          <Typography
            p="0.5rem 1rem"
            borderRadius="300px"
            bgcolor="primary.light"
            color="primary.main"
            textAlign="center"
          >
            Estimated Delivery Date <b>4th October</b>
          </Typography>
        </FlexBox>
      </Card>

      <Card sx={{ p: '0px', mb: '30px' }}>
        <TableRow
          sx={{
            bgcolor: 'grey.200',
            p: '12px',
            boxShadow: 'none',
            borderRadius: 0,
          }}
        >
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize="14px" color="grey.600" mr={0.5}>
              Order ID:
            </Typography>
            <Typography fontSize="14px">9001997718074513</Typography>
          </FlexBox>
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize="14px" color="grey.600" mr={0.5}>
              Placed on:
            </Typography>
            <Typography fontSize="14px">
              {format(new Date(), 'dd MMM, yyyy')}
            </Typography>
          </FlexBox>
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize="14px" color="grey.600" mr={0.5}>
              Delivered on:
            </Typography>
            <Typography fontSize="14px">
              {format(new Date(), 'dd MMM, yyyy')}
            </Typography>
          </FlexBox>
        </TableRow>

        <Box py={1}>

          {order && order.order && order.order.items && order.order.items.map(item => (
          //{productDatabase.slice(179, 182).map((item) => (
            <FlexBox px={2} py={1} flexWrap="wrap" alignItems="center" key={item.id}>

              {/*<p>{getImgUrlFromProductsWithExtRef(item, contextData ? contextData.products : null)}</p>*/}
              <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
                <Avatar src={getImgUrlFromProductsWithExtRef(item, contextData ? contextData.products : null)} sx={{ height: 64, width: 64 }} />
                <Box ml={2.5}>
                  <H6 my="0px">{item.title}</H6>
                  <Typography fontSize="14px" color="grey.600">
                    {parseFloat(item.price).toFixed(2) + " " + getBrandCurrency(contextData.brand) + " x " + item.quantity}
                  </Typography>
                </Box>
              </FlexBox>
              <FlexBox flex="1 1 260px" m={0.75} alignItems="center">
                <Typography fontSize="14px" color="grey.600">
                  {formatProductAndSkuName(item)}
                </Typography>
              </FlexBox>
              <FlexBox flex="160px" m={0.75} alignItems="center">
                <Button variant="text" color="primary">
                  <Typography fontSize="14px">Write a Review</Typography>
                </Button>
              </FlexBox>
            </FlexBox>
          ))}
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px' }}>
            <H5 mt={0} mb={2}>
              Shipping Address
            </H5>
            <Paragraph fontSize="14px" my="0px">
              Kelly Williams 777 Brockton Avenue, Abington MA 2351
            </Paragraph>
          </Card>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px' }}>
            <H5 mt={0} mb={2}>
              Total Summary
            </H5>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Subtotal:
              </Typography>
              <H6 my="0px">$335</H6>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Shipping fee:
              </Typography>
              <H6 my="0px">$10</H6>
            </FlexBox>
            <FlexBox justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="14px" color="grey.600">
                Discount:
              </Typography>
              <H6 my="0px">-$30</H6>
            </FlexBox>

            <Divider sx={{ mb: '0.5rem' }} />

            <FlexBox justifyContent="space-between" alignItems="center" mb={2}>
              <H6 my="0px">Total</H6>
              <H6 my="0px">$315</H6>
            </FlexBox>
            <Typography fontSize="14px">Paid by Credit/Debit Card</Typography>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return getStaticPathsUtil()
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}


export default OrderDetails
