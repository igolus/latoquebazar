import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
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
import {styled} from "@material-ui/styles";

// function TableContainer(props: { component: OverridableComponent<PaperTypeMap>, children: ReactNode }) {
//   return null;
// }

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // root: {
    //   padding: "0px 0px",
    //   "&:hover": {
    //     backgroundColor: "red"
    //   }
    // }
  }));

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
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <StyledTableCell align="left">{localStrings.mainAddress}</StyledTableCell>
                      <StyledTableCell align="left" >{dbUser?.userProfileInfo?.address}</StyledTableCell>
                      <StyledTableCell align="left">{dbUser?.userProfileInfo?.additionalInformation}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Link href="/address/main">
                          <IconButton>
                            <Edit fontSize="small" color="inherit" />
                          </IconButton>
                        </Link>
                      </StyledTableCell>
                    </TableRow>


                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ mb: '2rem', borderColor: 'grey.300' }} />


              <TableContainer component={Paper}>
                <Table>
                  {/*<TableHead>*/}
                  {/*  <TableRow>*/}
                  {/*    <TableCell>Dessert (100g serving)</TableCell>*/}
                  {/*    <TableCell align="right">Calories</TableCell>*/}
                  {/*    <TableCell align="right">Fat&nbsp;(g)</TableCell>*/}
                  {/*    <TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
                  {/*    <TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
                  {/*  </TableRow>*/}
                  {/*</TableHead>*/}



                  <TableBody>

                    {(dbUser?.userProfileInfo?.otherAddresses || []).map((item, ind) => (
                        <TableRow
                            key={ind}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <StyledTableCell align="left">{item.name}</StyledTableCell>
                          <StyledTableCell align="left" >{item.address}</StyledTableCell>
                          <StyledTableCell align="left">{item.additionalInformation}</StyledTableCell>
                          <StyledTableCell align="right">
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
                          </StyledTableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

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
