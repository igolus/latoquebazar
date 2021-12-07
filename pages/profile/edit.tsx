import Card1 from '@component/Card1'
import FlexBox from '@component/FlexBox'
import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {Button, Checkbox, FormControlLabel, Grid, TextField} from '@material-ui/core'
import Person from '@material-ui/icons/Person'
import {Box} from '@material-ui/system'
import {Formik} from 'formik'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../src/localStrings";
import Account from "@component/header/Account";
import useAuth from "@hook/useAuth";
import {executeMutationUtil} from "../../src/apolloClient/gqlUtil";
import {updateSiteUserQuery} from "../../src/gql/siteUserGql";
import {cloneDeep} from "@apollo/client/utilities";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {isDeliveryActive} from "../../src/util/displayUtil";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {useRouter} from "next/router";
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {H6} from "@component/Typography";


const ProfileEditor = ({contextData}) => {
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
            let valuesCopy = cloneDeep(values);
            delete valuesCopy.commercialAgreement;

            newDbUser.userProfileInfo = {...dbUser.userProfileInfo, ...valuesCopy}
            //newDbUser.commercialAgreement = values.commercialAgreement;
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
            <CustomerDashboardLayout contextData={contextData}>
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

                                                {/*<Grid item md={6} xs={12}>*/}
                                                {/*    <FormControlLabel*/}
                                                {/*        className="agreement"*/}
                                                {/*        name="commercialAgreement"*/}
                                                {/*        onChange={handleChange}*/}
                                                {/*        control={*/}
                                                {/*            <Checkbox*/}
                                                {/*                onChange={(event ) => setFieldValue('commercialAgreement', event.target.checked)}*/}
                                                {/*                size="small"*/}
                                                {/*                color="secondary"*/}
                                                {/*                checked={values.commercialAgreement || false}*/}
                                                {/*            />*/}
                                                {/*        }*/}
                                                {/*        label={localStrings.commercialAgreementAccept}*/}
                                                {/*    />*/}
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
        commercialAgreement: dbUser?.commercialAgreement,
        //address: dbUser?.userProfileInfo?.address || '',
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


const checkoutSchema = yup.object().shape({
    firstName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
    lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
    email: yup.string().email(localStrings.check.invalidEmail)
        .required(localStrings.formatString(localStrings.requiredField, '${path}')),
    phoneNumber: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),

})

export default ProfileEditor
