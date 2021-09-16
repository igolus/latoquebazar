import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {Button, Grid, TextField} from '@material-ui/core'
import Person from '@material-ui/icons/Person'
import {Box} from '@material-ui/system'
import {Formik} from 'formik'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../src/localStrings";
import Account from "@component/header/Account";
import useAuth from "@hook/useAuth";
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import {executeMutationUtil} from "../../src/apolloClient/gqlUtil";
import {updateSiteUserQuery} from "../../src/gql/siteUserGql";
import {cloneDeep} from "@apollo/client/utilities";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {formatDuration, getDeliveryDistanceWithFetch, isDeliveryActive} from "../../src/util/displayUtil";
import {setDistanceAndCheck} from "@component/address/AdressCheck";
import {ORDER_DELIVERY_MODE_DELIVERY, ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} from "../../src/util/constants";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {useRouter} from "next/router";


const ProfileEditor = () => {
  const router = useRouter();
  const {dbUser, setDbUser, currentBrand, currentEstablishment, maxDistanceReached, setMaxDistanceReached} = useAuth();
  const [loading, setLoading] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);

  useEffect(() => {
          if (!dbUser) {
              //alert("push user")
              router.push("/")
          }
      },
      [dbUser]
  )

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    try {
      let newDbUser = cloneDeep(dbUser);
      newDbUser.userProfileInfo = {...dbUser.userProfileInfo, ...values}
      await executeMutationUtil(updateSiteUserQuery(currentBrand().id, newDbUser));
      setDbUser(newDbUser);
    }
    finally {
      setLoading(false);
    }
  }

  return (
      <>
        {dbUser &&
        <CustomerDashboardLayout>
          {loading ?
              <ClipLoaderComponent/>
              :
              <>
                <DashboardPageHeader
                    icon={Person}
                    title={localStrings.editProfile}
                    button={
                      <Link href="/profile">
                        <Button color="primary" variant="contained" sx={{px: '2rem', textTransform: 'none'}}>
                          {localStrings.backToProfile}
                        </Button>
                      </Link>
                    }
                />

                <Card1>

                    {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                    <Box p={1}>
                        <AlertHtmlLocal severity={maxDistanceReached ? "warning" : "success"}
                                        title={maxDistanceReached ?
                                            localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                                        content={localStrings.formatString(localStrings.distanceOnly,
                                            (distanceInfo.distance / 1000))}
                        />
                    </Box>
                    }

                  <FlexBox alignItems="flex-end" mb={3}>

                    <Account noLinkMode/>
                    {/*<Avatar*/}
                    {/*  src="/assets/images/faces/ralph.png"*/}
                    {/*  sx={{ height: 64, width: 64 }}*/}
                    {/*/>*/}

                    {/*<Box ml={-2.5}>*/}
                    {/*  <label htmlFor="profile-image">*/}
                    {/*    <Button*/}
                    {/*      component="span"*/}
                    {/*      color="secondary"*/}
                    {/*      sx={{*/}
                    {/*        bgcolor: 'grey.300',*/}
                    {/*        height: 'auto',*/}
                    {/*        p: '8px',*/}
                    {/*        borderRadius: '50%',*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <CameraEnhance fontSize="small" />*/}
                    {/*    </Button>*/}
                    {/*  </label>*/}
                    {/*</Box>*/}
                    <Box display="none">
                      <input
                          onChange={(e) => console.log(e.target.files)}
                          id="profile-image"
                          accept="image/*"
                          type="file"
                      />
                    </Box>
                  </FlexBox>

                  <Formik
                      initialValues={initialValues(dbUser)}
                      validationSchema={checkoutSchema}
                      onSubmit={handleFormSubmit}
                  >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <Box mb={4}>
                            <Grid container spacing={3}>
                              <Grid item md={6} xs={12}>
                                <TextField
                                    name="firstName"
                                    label={localStrings.firstName}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName || ''}
                                    error={!!touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                    name="lastName"
                                    label={localStrings.lastName}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName || ''}
                                    error={!!touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                    name="email"
                                    type="email"
                                    disabled
                                    label={localStrings.email}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email || ''}
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                    name="phoneNumber"
                                    label={localStrings.phone}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phoneNumber || ''}
                                    error={!!touched.phoneNumber && !!errors.phoneNumber}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                />
                              </Grid>

                              {/*<Grid item md={12} xs={12}>*/}
                              {/*  <GoogleMapsAutocomplete noKeyKnown*/}
                              {/*                          useTextField*/}
                              {/*                          required*/}
                              {/*                          initialValue={values.address || ''}*/}
                              {/*                          title={localStrings.address}*/}
                              {/*                          error={!!touched.address && !!errors.address}*/}
                              {/*                          helperText={touched.address && errors.address}*/}

                              {/*                          setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {*/}
                              {/*                              if (currentEstablishment()) {*/}
                              {/*                                  let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);*/}
                              {/*                                  setDistanceAndCheck(distInfo,*/}
                              {/*                                      (maxDistanceReached) => {*/}
                              {/*                                          setMaxDistanceReached(maxDistanceReached);*/}
                              {/*                                      },*/}
                              {/*                                      setDistanceInfo, currentEstablishment);*/}
                              {/*                              }*/}

                              {/*                              setFieldValue("address", label);*/}
                              {/*                            setFieldValue("placeId", placeId);*/}
                              {/*                            setFieldValue("lat", lat);*/}
                              {/*                            setFieldValue("lng", lng);*/}
                              {/*                          }}/>*/}
                              {/*</Grid>*/}
                            </Grid>
                          </Box>

                          <Button type="submit" variant="contained" color="primary" sx={{textTransform: 'none'}}>
                            {localStrings.saveChange}
                          </Button>
                        </form>
                    )}
                  </Formik>
                </Card1>
              </>
          }
            </CustomerDashboardLayout>
            }
            </>
            )
          }

const initialValues = (dbUser) => {
  return {
    firstName: dbUser?.userProfileInfo?.firstName || '',
    lastName: dbUser?.userProfileInfo?.lastName || '',
    email: dbUser?.userProfileInfo?.email || '',
    phoneNumber: dbUser?.userProfileInfo?.phoneNumber || '',
    //address: dbUser?.userProfileInfo?.address || '',
  }
}

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
      lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
      email: yup.string().email(localStrings.check.invalidEmail)
      .required(localStrings.formatString(localStrings.requiredField, '${path}')),
      phoneNumber: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),

})

export default ProfileEditor
