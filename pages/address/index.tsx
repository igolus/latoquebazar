import FlexBox from '@component/FlexBox'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import {Button, Divider, IconButton, Pagination, Typography} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Place from '@material-ui/icons/Place'
import Link from 'next/link'
import React from 'react'
import useAuth from "@hook/useAuth";
import localStrings from "../../src/localStrings";

const AddressList = () => {
  const {dbUser} = useAuth()

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title={localStrings.myAddresses}
        icon={Place}
        button={
          <Button color="primary" sx={{ bgcolor: 'primary.light', px: '2rem' }}>
            {localStrings.addNewAddress}
          </Button>
        }
      />

      <TableRow sx={{ my: '1rem', padding: '6px 18px', mb: '2rem'}}>
        <Typography whiteSpace="pre" m={0.75} textAlign="left">
          {localStrings.mainAddress}
        </Typography>
        <Typography flex="1 1 260px !important" m={0.75} textAlign="left">
          {dbUser?.userProfileInfo?.address}
        </Typography>
        <Typography whiteSpace="pre" m={0.75} textAlign="left">
          {dbUser?.userProfileInfo?.additionalInformation}
        </Typography>

        <Typography whiteSpace="pre" textAlign="center" color="grey.600">
          <Link href="/address/main">
            <IconButton>
              <Edit fontSize="small" color="inherit" />
            </IconButton>
          </Link>
          {/*<IconButton onClick={(e) => e.stopPropagation()}>*/}
          {/*  <Delete fontSize="small" color="inherit" />*/}
          {/*</IconButton>*/}
        </Typography>
      </TableRow>

      <Divider sx={{ mb: '2rem', borderColor: 'grey.300' }} />

      {(dbUser?.userProfileInfo?.otherAddresses || []).map((item, ind) => (
        <TableRow sx={{ my: '1rem', padding: '6px 18px' }} key={ind}>
          <Typography whiteSpace="pre" m={0.75} textAlign="left">
            {item.name}
          </Typography>
          <Typography flex="1 1 260px !important" m={0.75} textAlign="left">
            {item.address}
          </Typography>
          <Typography whiteSpace="pre" m={0.75} textAlign="left">
            {item.additionalInformation}
          </Typography>

          <Typography whiteSpace="pre" textAlign="center" color="grey.600">
            <Link href="/address/xkssThds6h37sd">
              <IconButton>
                <Edit fontSize="small" color="inherit" />
              </IconButton>
            </Link>
            <IconButton onClick={(e) => e.stopPropagation()}>
              <Delete fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      {/*<FlexBox justifyContent="center" mt={5}>*/}
      {/*  <Pagination*/}
      {/*    count={5}*/}
      {/*    onChange={(data) => {*/}
      {/*      console.log(data)*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</FlexBox>*/}
    </DashboardLayout>
  )
}

const orderList = [
  {
    orderNo: '1050017AS',
    status: 'Pending',
    purchaseDate: new Date(),
    price: 350,
  },
  {
    orderNo: '1050017AS',
    status: 'Processing',
    purchaseDate: new Date(),
    price: 500,
  },
  {
    orderNo: '1050017AS',
    status: 'Delivered',
    purchaseDate: '2020/12/23',
    price: 700,
  },
  {
    orderNo: '1050017AS',
    status: 'Delivered',
    purchaseDate: '2020/12/23',
    price: 700,
  },
  {
    orderNo: '1050017AS',
    status: 'Cancelled',
    purchaseDate: '2020/12/15',
    price: 300,
  },
]

export default AddressList
