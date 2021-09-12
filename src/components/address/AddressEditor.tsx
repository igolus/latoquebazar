import Card1 from '@component/Card1'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {Button, Divider, Grid, TextField, Typography} from '@material-ui/core'
import Place from '@material-ui/icons/Place'
import { Box } from '@material-ui/system'
import { Formik } from 'formik'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import DashboardLayout from '../layout/CustomerDashboardLayout'
import localStrings from "../../localStrings";
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import {getDeliveryDistanceWithFetch} from "../../util/displayUtil";
import {setDistanceAndCheck} from "@component/address/AdressCheck";
import {MODE_EDIT, ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} from "../../util/constants";
import useAuth from "@hook/useAuth";
import {executeMutationUtil, executeQueryUtil} from "../../apolloClient/gqlUtil";
import {getOrderByIdQuery} from "../../gql/orderGql";
import {cloneDeep} from "@apollo/client/utilities";
import {updateSiteUserQuery} from "../../gql/siteUserGql";
import {useRouter} from "next/router";
import ClipLoaderComponent from "@component/ClipLoaderComponent";


const AddressEditor = ({id, mode}) => {

    const router = useRouter();
    const {currentEstablishment, dbUser, currentBrand, setDbUser} = useAuth()



    const [adressValue, setAdressValue] = useState("");
    const [loading, setLoading] = useState("");
    const [adressEditLock, setAdressEditLock] = useState(false);
    const [distanceInfo, setDistanceInfo] = useState(null);
    const [maxDistanceReached, setMaxDistanceReached] = useState(false);
    const [adressInfo, setAdressInfo] = useState({});

    const handleFormSubmit = async (values: any) => {
        //alert("handleFormSubmit" + values.additionalInformation);
        setLoading(true)
        const dbUserCopy = cloneDeep(dbUser);
        dbUserCopy.userProfileInfo = {
            ...dbUser.userProfileInfo,
            address: adressInfo.address,
            lat: adressInfo.lat,
            lng: adressInfo.lng,
            placeId: adressInfo.placeId,
            additionalInformation: values.additionalInformation,
        }
        let res = await executeMutationUtil(updateSiteUserQuery(currentBrand().id, dbUserCopy))
        let user = res?.data?.updateSiteUser;
        if (user) {
            setDbUser(user);
        }
        setLoading(false);
        router.push("/address")

    }

    function updateDeliveryAdress(address, lat, lng, placeId) {
        setAdressInfo({
                address: address,
                lat: lat,
                lng: lng,
                placeId: placeId,
            }
        )
    }

    useEffect(async () => {
        if (id === "main") {
            setAdressInfo({
                address: dbUser?.userProfileInfo?.address,
                lat: dbUser?.userProfileInfo?.lat,
                lng: dbUser?.userProfileInfo?.lng,
                placeId: dbUser?.userProfileInfo?.placeId,
            })
            setAdressValue(dbUser?.userProfileInfo?.address)
        }
    }, [dbUser])

    function getTitle() {
        if (id === "main") {
            return localStrings.modifyMainAddress
        }
        return id ? localStrings.modifyAddress : localStrings.addNewAddress
    }

    function getSubmitText() {
        if (id==="main") {
            return localStrings.updateMainAddress;
        }
    }

    return (
        <>
            {loading || !dbUser ?
                <ClipLoaderComponent/>
                :
                <div>

                    <p>{JSON.stringify(adressInfo)}</p>
                    <DashboardPageHeader
                        icon={Place}
                        title={getTitle()}
                        button={
                            <Link href="/address">
                                <Button color="primary" sx={{ bgcolor: 'primary.light', px: '2rem' }}>
                                    {localStrings.backToAdress}
                                </Button>
                            </Link>
                        }
                    />

                    <Card1>
                        <Formik
                            initialValues={initialValues(id, dbUser)}
                            validationSchema={checkoutSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box mb={4}>

                                        <Grid container spacing={3}>
                                            {id && id !== "main" &&
                                            <Grid item md={12} xs={12}>
                                                <TextField
                                                    name="name"
                                                    variant="outlined"
                                                    label={localStrings.nameAddress}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.name || ''}
                                                    error={!!touched.name && !!errors.name}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Grid>
                                            }
                                            <Grid item md={12} xs={12}>
                                                <GoogleMapsAutocomplete
                                                    //ref={autocomp}
                                                    noKeyKnown
                                                    required
                                                    setterValueSource={setAdressValue}
                                                    valueSource={adressValue}
                                                    disabled={adressEditLock}
                                                    setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                                        if (currentEstablishment()) {
                                                            let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                                            setDistanceAndCheck(distInfo,
                                                                (maxDistanceReached) => {
                                                                    setMaxDistanceReached(maxDistanceReached);
                                                                },
                                                                setDistanceInfo, currentEstablishment);
                                                        }
                                                        //setAdressValue(label)
                                                        updateDeliveryAdress(label, lat, lng, placeId);
                                                        setAdressEditLock(true);
                                                    }}/>
                                            </Grid>

                                            <Divider sx={{ mb: '2rem', borderColor: 'grey.300' }} />

                                            <Grid item md={12} xs={12}>

                                                <Typography fontWeight="600" mb={2}>
                                                    {localStrings.bookingadditionalInformation}
                                                </Typography>

                                                <Typography variant="body2" fontWeight="400" mb={2}>
                                                    {localStrings.bookingadditionalInformationExample}
                                                </Typography>

                                                <TextField
                                                    name="additionalInformation"
                                                    multiline
                                                    rows={4}
                                                    label={localStrings.additionalInformation}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.additionalInformation}
                                                    error={!!touched.additionalInformation && !!errors.additionalInformation}
                                                    helperText={touched.additionalInformation && errors.additionalInformation}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Button  variant="contained" color="primary" type="submit">
                                        {getSubmitText()}
                                    </Button>
                                </form>
                            )}
                        </Formik>
                    </Card1>
                </div>
            }
        </>
    )
}

function getInitialAdditionalInformation(id, dbUser) {
    if (id === "main") {
        //alert("dbUser?.userProfileInfo?.additionalInformation " + JSON.stringify(dbUser?.userProfileInfo))
        return dbUser?.userProfileInfo?.additionalInformation;
    }
    return "";
}

const initialValues = (id, dbUser) => {
    return {
        name: '',
        address: '',
        additionalInformation: getInitialAdditionalInformation(id, dbUser)
    }
}

const checkoutSchema = yup.object().shape({
    //name: yup.string().required('required'),
    //address: yup.string().required('required'),
    // contact: yup.string().required('required'),
})

AddressEditor.layout = DashboardLayout

export default AddressEditor
