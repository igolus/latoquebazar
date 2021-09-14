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
import ClipLoaderComponent from "@component/ClipLoaderComponent";

export interface CustomerOrderListProps {
  contextData?: any
}

const itemPerPage = 10;

const CustomerOrderList: React.FC<CustomerOrderListProps> = ({contextData}) => {
  const {dbUser} = useAuth();
  const brandId = contextData.brand.id;
  const currency = getBrandCurrency(contextData.brand);
  const [sourceOrders, setSourceOrders] = useState(null);
  const [ordersDisplay, setOrdersDisplay] = React.useState(null);
  const [maxPage, setMaxPage] = React.useState(0);
  const [page, setPage] = React.useState(1);


  useEffect(() => {
    async function load() {
      if (dbUser) {
        let result = await executeQueryUtil(getCustomerOrdersQuery(brandId, dbUser.id));
        let orders;
        if (result && result.data) {
          orders = result.data.getSiteUser.orders;
          orders.sort((order1,order2) =>
              parseFloat(order2.creationDate) - parseFloat(order1.creationDate));
          setSourceOrders(orders)
        }

        setPage(0);
        let pSize = orders ? orders.length : 0;

        let maxPage = Math.floor(pSize/ itemPerPage) + 1;
        if (pSize % itemPerPage == 0) {
          maxPage = pSize/itemPerPage;
        }
        setMaxPage(maxPage);

        if (orders) {
          setOrdersDisplay(orders.slice(0,
              Math.min(orders.length + 1, itemPerPage)))
        }

      }

    }    // Execute the created function directly
    load();
  }, [dbUser]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (!sourceOrders) {
      return;
    }
    setOrdersDisplay(sourceOrders.slice((value - 1)* itemPerPage,
        Math.min(sourceOrders.length, value * itemPerPage)))

    setPage(value);
  };

  return (
    <Fragment>
        {
            ordersDisplay ?
                <>
                <DashboardPageHeader title={localStrings.myOrders} icon={ShoppingBag}/>
                {/*<p>{JSON.stringify(ordersDisplay)}</p>*/}
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
                      {localStrings.deliveryMode}
                    </H5>
                    <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
                        {localStrings.purchaseDate}
                    </H5>
                    <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
                        {localStrings.totalTTC}
                    </H5>
                    <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
                </TableRow>

                {ordersDisplay.map((item, ind) => (
                    <OrderRow item={item} key={ind} currency={currency} />
                ))}

              {maxPage > 1 &&
              <FlexBox
                  flexWrap="wrap"
                  flexDirection="row-reverse"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={4}
              >
                <Pagination count={maxPage} variant="outlined" color="primary" page={page} onChange={handleChange}/>
              </FlexBox>
              }
            </>
            :
            <ClipLoaderComponent/>
        }

    </Fragment>
  )
};


export default CustomerOrderList
