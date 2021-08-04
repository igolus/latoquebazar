import FlexBox from '@component/FlexBox'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import { H5 } from '@component/Typography'
import { Pagination } from '@material-ui/core'
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import React, {Fragment, useEffect, useState} from 'react'
import OrderRow from './OrderRow'
import useAuth from "@hook/useAuth";
import {getCustomerOrdersQuery} from "../../gql/orderGql";
import {executeQueryUtil} from "../../apolloClient/gqlUtil";
import localStrings from "../../localStrings";
import {getBrandCurrency} from "../../util/displayUtil";

export interface CustomerOrderListProps {
  contextData?: any
}

const CustomerOrderList: React.FC<CustomerOrderListProps> = ({contextData}) => {
  const {dbUser} = useAuth();
  const brandId = contextData.brand.id;
  const currency = getBrandCurrency(contextData.brand);
  const [sourceOrders, setSourceOrders] = useState([]);

  useEffect(() => {
    async function load() {
      if (dbUser) {
        let result = await executeQueryUtil(getCustomerOrdersQuery(brandId, dbUser.id));
        if (result && result.data) {
          setSourceOrders(result.data.getSiteUser.orders)
        }
      }

    }    // Execute the created function directly
    load();
  }, [dbUser]);

  return (
    <Fragment>
      <DashboardPageHeader title={localStrings.myOrders} icon={ShoppingBag}/>

      {/*<p>{JSON.stringify(sourceOrders)}</p>*/}

      <TableRow
        sx={{
          display: { xs: 'none', md: 'flex' },
          padding: '0px 18px',
          background: 'none',
        }}
        elevation={0}
      >
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          {localStrings.orderNumber}
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          {localStrings.status}
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          {localStrings.purchaseDate}
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          {localStrings.totalTTC}
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
      </TableRow>

      {sourceOrders.map((item, ind) => (
        <OrderRow item={item} key={ind} currency={currency} />
      ))}

      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          variant="outlined"
          color="primary"
          onChange={(data) => {
            console.log(data)
          }}
        />
      </FlexBox>
    </Fragment>
  )
}

const orderList = [
  {
    orderNo: '1050017AS',
    status: 'Pending',
    purchaseDate: new Date(),
    price: 350,
    href: '/orders/5452423',
  },
  {
    orderNo: '1050017AS',
    status: 'Processing',
    purchaseDate: new Date(),
    price: 500,
    href: '/orders/5452423',
  },
  {
    orderNo: '1050017AS',
    status: 'Delivered',
    purchaseDate: '2020/12/23',
    price: 700,
    href: '/orders/5452423',
  },
  {
    orderNo: '1050017AS',
    status: 'Delivered',
    purchaseDate: '2020/12/23',
    price: 700,
    href: '/orders/5452423',
  },
  {
    orderNo: '1050017AS',
    status: 'Cancelled',
    purchaseDate: '2020/12/15',
    price: 300,
    href: '/orders/5452423',
  },
]

export default CustomerOrderList
