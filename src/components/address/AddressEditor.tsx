import Card1 from '@component/Card1'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import {Button, Divider, Grid, TextField, Typography} from '@material-ui/core'
import Place from '@material-ui/icons/Place'
import {Box} from '@material-ui/system'
import {Formik} from 'formik'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import DashboardLayout from '../layout/CustomerDashboardLayout'
import localStrings from "../../localStrings";
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import useAuth from "@hook/useAuth";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import {cloneDeep} from "@apollo/client/utilities";
import {updateSiteUserQuery} from "../../gql/siteUserGql";
import {useRouter} from "next/router";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {uuid} from "uuidv4";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {getDeliveryDistanceWithFetch} from "../../util/displayUtil";
import {distanceAndCheck} from "@component/address/AdressCheck";

const AddressEditor = ({back}) => {

    let id;
    let params = {};
    try {
        params = new URLSearchParams(window.location.search)
        id = params?.get("addId");
        //alert("addId " + id);
    }
    catch (err) {

    }

    const router = useRouter();
    const {currentEstablishment, dbUser, currentBrand, setDbUser, getOrderInCreation, setOrderInCreation} = useAuth()

    const [adressValue, setAdressValue] = useState("");
    const [loading, setLoading] = useState(false);
    //const [deliveryOut, setDeliveryOut] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    // const [distanceInfo, setDistanceInfo] = useState(null);
    // const [maxDistanceReached, setMaxDistanceReached] = useState(false);
    const [adressInfo, setAdressInfo] = useState(null);

    const handleFormSubmit = async (values: any) => {
        //alert("handleFormSubmit" + values.additionalInformation);

        setLoading(true)
        try {
            const dbUserCopy = cloneDeep(dbUser);
            if (id === "main") {
                dbUserCopy.userProfileInfo = {
                    ...dbUser.userProfileInfo,
                    address: adressInfo.address,
                    lat: adressInfo.lat,
                    lng: adressInfo.lng,
                    placeId: adressInfo.placeId,
                    customerDeliveryInformation: values.customerDeliveryInformation,
                }

            } else if (id === "new") {
                dbUserCopy.userProfileInfo = {
                    ...dbUser.userProfileInfo,
                    otherAddresses: [...(dbUser.userProfileInfo.otherAddresses || []),
                        {
                            id: uuid(),
                            name: values.name,
                            address: adressInfo.address,
                            lat: adressInfo.lat,
                            lng: adressInfo.lng,
                            placeId: adressInfo.placeId,
                            customerDeliveryInformation: values.customerDeliveryInformation,
                        }
                    ]
                }
            } else {
                let oldIndex = dbUser?.userProfileInfo?.otherAddresses.findIndex(other => id === other.id)

                let filterData = dbUser?.userProfileInfo?.otherAddresses
                //.filter(other => id !== other.id);

                let otherAddUpdate = {
                    id: id,
                    name: values.name,
                    address: adressInfo.address,
                    lat: adressInfo.lat,
                    lng: adressInfo.lng,
                    placeId: adressInfo.placeId,
                    customerDeliveryInformation: values.customerDeliveryInformation,
                }
                filterData.splice(oldIndex, 1, otherAddUpdate);

                dbUserCopy.userProfileInfo = {
                    ...dbUser.userProfileInfo,
                    otherAddresses: filterData
                }
            }

            let res = await executeMutationUtil(updateSiteUserQuery(currentBrand().id, dbUserCopy))
            let user = res?.data?.updateSiteUser;
            if (user) {
                setDbUser(user);
            }
            setLoading(false);
            if (back) {
                router.push(decodeURI(back))
            } else {
                router.push("/address")
            }
        }
        finally {
            setLoading(false);
        }
    }

    function updateDeliveryAdress(address, lat, lng, placeId) {
        setAdressInfo({
                address: address,
                lat: lat,
                lng: lng,
                placeId: placeId,
                id: id
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
        else if (id !== "new") {
            let adressInfoFromId = dbUser?.userProfileInfo?.otherAddresses.find(add => add.id === id);
            if (adressInfoFromId) {
                setAdressInfo({
                    ...adressInfoFromId
                })
                setAdressValue(adressInfoFromId.address);
            }
        }

    }, [dbUser])

    function getTitle() {
        if (id === "main") {
            return localStrings.modifyMainAddress
        }
        if (id === "new") {
            return localStrings.addNewAddress
        }
        return id ? localStrings.modifyAddress : localStrings.addNewAddress
    }

    function getSubmitText() {
        if (id==="main") {
            return localStrings.updateMainAddress;
        }
        if (id === "new") {
            return localStrings.addNewAddress
        }
        return localStrings.updateAddress;
    }

    return (
        <>
            {loading || !dbUser || (id !== "new" && id !== "main" && !adressInfo)  ?
                <ClipLoaderComponent/>
                :
                <div>

                    {/*<p>{JSON.stringify(adressInfo)}</p>*/}
                    <DashboardPageHeader
                        icon={Place}
                        title={getTitle()}
                        button={
                            <Link href="/address">
                                <Button color="primary" variant="contained" sx={{
                                    px: '2rem', textTransform: "none" }}>
                                    {localStrings.backToAdress}
                                </Button>
                            </Link>
                        }
                    />

                    <Card1>
                        {/*{deliveryOut &&*/}
                        {/*        <AlertHtmlLocal severity={"warning"}*/}
                        {/*                        title={localStrings.warning}*/}
                        {/*                        content={localStrings.tooFarAddress}*/}
                        {/*                        marginBottom={25}*/}
                        {/*        />*/}
                        {/*}*/}


                        <Formik
                            initialValues={initialValues(id, dbUser, adressInfo)}
                            validationSchema={checkoutSchema(id)}
                            onSubmit={handleFormSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box mb={4}>
                                        {/*<p>{JSON.stringify(values)}</p>*/}
                                        <Grid container spacing={3}>
                                            {id && id !== "main" &&
                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        name="name"
                                                        variant="outlined"
                                                        label={localStrings.nameAddress}
                                                        placeholder={localStrings.fillAddressName}
                                                        fullWidth
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.name}
                                                        error={!!touched.name && !!errors.name}
                                                        helperText={touched.name && errors.name}
                                                    />
                                                </Grid>
                                            }
                                            <Grid item md={12} xs={12}>
                                                <GoogleMapsAutocomplete
                                                    modeUk={currentBrand()?.country === 'gb'}
                                                    noKeyKnown
                                                    required
                                                    setterValueSource={setAdressValue}
                                                    placeholderArg={localStrings.fillAddress}
                                                    //initialValue={adressInfo?.address}
                                                    valueSource={adressValue}
                                                    //disabled={adressEditLock}
                                                    setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                                        setLoadingAddress(true);
                                                        // if (currentEstablishment()) {
                                                        //     let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                                        //     await setDistanceAndCheck(distInfo,
                                                        //         (maxDistanceReached) => {
                                                        //             setDeliveryOut(maxDistanceReached)
                                                        //         },
                                                        //         null, currentEstablishment);
                                                        // }
                                                        //setAdressValue(label)
                                                        updateDeliveryAdress(label, lat, lng, placeId);
                                                        setLoadingAddress(false);
                                                    }}/>
                                            </Grid>

                                            <Divider sx={{ mb: '2rem', borderColor: 'grey.300' }} />

                                            <Grid item md={12} xs={12}>

                                                <Typography fontWeight="600" mb={2}>
                                                    {localStrings.bookingadditionalInformationNotes}
                                                </Typography>

                                                <TextField
                                                    name="customerDeliveryInformation"
                                                    placeholder={localStrings.customerDeliveryInformationPlaceHolder}
                                                    multiline
                                                    rows={4}
                                                    label={localStrings.customerDeliveryInformationPlaceHolder}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.customerDeliveryInformation}
                                                    error={!!touched.customerDeliveryInformation && !!errors.customerDeliveryInformation}
                                                    helperText={touched.customerDeliveryInformation && errors.customerDeliveryInformation}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Button  variant="contained" color="primary"
                                             style={{textTransform: "none"}}
                                             disabled={id === "new" && !adressInfo || !checkoutSchema(id).isValidSync(values) || loadingAddress}
                                             type="submit">
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

function getInitialCustomerDeliveryInformation(id, dbUser, adressInfo) {
    if (id === "main") {
        return dbUser?.userProfileInfo?.customerDeliveryInformation;
    }
    if (id !== "new") {
        return adressInfo?.customerDeliveryInformation
    }
    return "";
}

function getInitialName(id, adressInfo) {
    if (id !== "main" && id !== "new") {
        // alert("adressInfo " + JSON.stringify(adressInfo))
        // alert("adressInfo " + adressInfo?.name)
        //alert("dbUser?.userProfileInfo?.additionalInformation " + JSON.stringify(dbUser?.userProfileInfo))
        return adressInfo?.name;
    }
    return "";
}

const initialValues = (id, dbUser, adressInfo) => {
    return {
        name: getInitialName(id, adressInfo),
        //address: '',
        customerDeliveryInformation: getInitialCustomerDeliveryInformation(id, dbUser, adressInfo)
    }
}

const checkoutSchema = (id) => {
    if (id === "new") {
        return yup.object().shape({
            name: yup.string().required('required'),
            //address: yup.string().required('required'),
            // contact: yup.string().required('required'),
        })
    }
    return yup.object().shape({
        //name: yup.string().required('required'),
        //address: yup.string().required('required'),
        // contact: yup.string().required('required'),
    })
}

AddressEditor.layout = DashboardLayout

export default AddressEditor
