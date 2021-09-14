import FlexBox from '@component/FlexBox'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import {
  Button,
  Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  Typography
} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Place from '@material-ui/icons/Place'
import Link from 'next/link'
import React, {useState} from 'react'
import useAuth from "@hook/useAuth";
import localStrings from "../../src/localStrings";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {cloneDeep} from "@apollo/client/utilities";
import {executeMutationUtil} from "../../src/apolloClient/gqlUtil";
import {updateSiteUserQuery} from "../../src/gql/siteUserGql";
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";

const AddressList = ({contextData}) => {
  const {dbUser, currentBrand, setDbUser} = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idDelete, setIdDelete] = useState(null);

  async function handleConfirm() {
    setLoading(true);
    setConfirmDelete(false);
    let filterData = dbUser?.userProfileInfo?.otherAddresses
        .filter(other => idDelete !== other.id);

    const dbUserCopy = cloneDeep(dbUser);

    dbUserCopy.userProfileInfo = {
      ...dbUser.userProfileInfo,
      otherAddresses: filterData,
    }

    let res = await executeMutationUtil(updateSiteUserQuery(currentBrand().id, dbUserCopy))
    let user = res?.data?.updateSiteUser;
    if (user) {
      setDbUser(user);
    }
    setLoading(false);

  }

  return (
    <DashboardLayout contextData={contextData}>
      {loading ?
        <ClipLoaderComponent/>
          :
          <>
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{localStrings.confirmMessage.deleteAddress}</DialogTitle>
              <DialogActions>
                <Button onClick={() => setConfirmDelete(false)} color="primary" autoFocus>
                  {localStrings.cancel}
                </Button>
                <Button onClick={handleConfirm} color="primary">
                  {localStrings.confirmAction}
                </Button>
              </DialogActions>
            </Dialog>

            <DashboardPageHeader
                title={localStrings.myAddresses}
                icon={Place}
                button={
                  <Link href={"/address/new"}>
                    <Button color="primary"  variant={"contained"} sx={{ px: '2rem', textTransform: "none" }}>
                      {localStrings.addNewAddress}
                    </Button>
                  </Link>
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
                    <Link href={"/address/" + item.id}>
                      <IconButton>
                        <Edit fontSize="small" color="inherit" />
                      </IconButton>
                    </Link>
                    <IconButton onClick={() => {
                      setIdDelete(item.id);
                      setConfirmDelete(true);
                    }}>
                      <Delete fontSize="small" color="inherit"/>
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
          </>
      }
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

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

export default AddressList
