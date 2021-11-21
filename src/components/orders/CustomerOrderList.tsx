import FlexBox from '@component/FlexBox'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import React, {Fragment, useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import {getCustomerOrdersQuery} from "../../gql/orderGql";
import {executeQueryUtil} from "../../apolloClient/gqlUtil";
import localStrings from "../../localStrings";
import {formatOrderConsumingModeGrid, getBrandCurrency} from "../../util/displayUtil";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import moment from "moment";
import East from "@material-ui/icons/East";
import {styled} from "@material-ui/styles";
import Link from "next/link";
import { H5 } from '@component/Typography'
import {isMobile} from "react-device-detect";

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // root: {
    //   padding: "0px 0px",
    //   "&:hover": {
    //     backgroundColor: "red"
    //   }
    // }
  }));

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


                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">
                            <H5 color="grey.600">
                              {isMobile ? localStrings.orderNumberMobile : localStrings.orderNumber}

                              {/*{localStrings.orderNumber}*/}
                            </H5>
                          </TableCell>
                          <TableCell align="left">
                            <H5 color="grey.600">
                              {localStrings.deliveryMode}
                            </H5>
                          </TableCell>
                          <TableCell align="left">
                            <H5 color="grey.600">
                              {localStrings.purchaseDate}
                            </H5>
                          </TableCell>
                          <TableCell align="left">
                            <H5 color="grey.600">
                              {localStrings.totalTTC}
                            </H5>
                          </TableCell>
                          {!isMobile &&
                            <TableCell align="right"></TableCell>
                          }
                        </TableRow>
                      </TableHead>



                      <TableBody>

                        {ordersDisplay.map((item, ind) => (
                            <Link href={"/orders?orderId=" + item.id}>
                            <TableRow
                                key={ind}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <StyledTableCell align="left">{item.orderNumber}</StyledTableCell>
                              <StyledTableCell align="left" >{formatOrderConsumingModeGrid(item, localStrings)}</StyledTableCell>
                              <StyledTableCell align="left">{moment(parseFloat(item.creationDate)).locale("fr").calendar()}</StyledTableCell>
                              <StyledTableCell align="left">{(item.totalPrice || 0).toFixed(2)} {currency}</StyledTableCell>
                              {!isMobile &&
                              <StyledTableCell align="right">
                                <Link href={"orders/orderDetail?orderId=" + item.id}>
                                  <IconButton>
                                    <East fontSize="small" color="inherit"/>
                                  </IconButton>
                                </Link>
                              </StyledTableCell>
                              }
                              {/*  <Link href={"/address/" + item.id}>*/}
                              {/*    <IconButton>*/}
                              {/*      <Edit fontSize="small" color="inherit" />*/}
                              {/*    </IconButton>*/}
                              {/*  </Link>*/}
                              {/*  <IconButton onClick={() => {*/}
                              {/*    setIdDelete(item.id);*/}
                              {/*    setConfirmDelete(true);*/}
                              {/*  }}>*/}
                              {/*    <Delete fontSize="small" color="inherit"/>*/}
                              {/*  </IconButton>*/}
                              {/*</StyledTableCell>*/}
                            </TableRow>
                            </Link>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>




                {/*  <TableRow sx={{ my: '1rem', padding: '6px 18px' }}>*/}
                {/*    <H5 color="grey.600" my="0px" mx={0} textAlign="left">*/}
                {/*        {localStrings.orderNumber}*/}
                {/*    </H5>*/}


                {/*    <H5 color="grey.600" my="0px" mx={-1} textAlign="left" sx={{width: 250}} >*/}
                {/*      {localStrings.deliveryMode}*/}
                {/*    </H5>*/}
                {/*    <H5 color="grey.600" my="0px" ml={5.5} textAlign="left">*/}
                {/*        {localStrings.purchaseDate}*/}
                {/*    </H5>*/}
                {/*    <H5 color="grey.600" my="0px" textAlign="left">*/}
                {/*        {localStrings.totalTTC}*/}
                {/*    </H5>*/}
                {/*    <H5 flex="0 0 0 !important" color="grey.600" px={1} py={0.5} my={0}></H5>*/}
                {/*</TableRow>*/}

                {/*{ordersDisplay.map((item, ind) => (*/}
                {/*    <OrderRow item={item} key={ind} currency={currency} />*/}
                {/*))}*/}

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
