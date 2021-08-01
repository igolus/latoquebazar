import Card1 from '@component/Card1'
import countryList from '@data/countryList'
import {
  Alert,
  Autocomplete, Box,
  Button,
  Checkbox, FormControl,
  FormControlLabel, FormLabel,
  Grid, Radio, RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core'
import { Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import {ORDER_DELIVERY_MODE_DELIVERY, ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} from "../../util/constants";
import BookingSlots from '../../components/form/BookingSlots';
import useAuth from "@hook/useAuth";
import moment from 'moment';
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import {DIST_INFO, setDistanceAndCheck} from "@component/address/AdressCheck";
import {formatDuration, getDeliveryDistance, isDeliveryActive} from "../../util/displayUtil";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  textField: {
    "& .Mui-disabled": {
      //color: "rgba(0, 0, 0, 0.6)", // (default alpha is 0.38)
      WebkitTextFillColor: "rgba(0, 0, 0, 0.65)"
      //
      // -webkit-text-fill-color
    }
  },
}));

export interface CheckoutFormProps {
  contextData: any
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({contextData}) => {
  const classes = useStyles();
  const [sameAsShipping, setSameAsShipping] = useState(false)
  const router = useRouter()
  //const [deliveryMode, setDeliveryMode] = React.useState(ORDER_DELIVERY_MODE_DELIVERY);
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  const [adressValue, setAdressValue] = useState("");
  const [adressEditLock, setAdressEditLock] = useState(true);
  const { setOrderInCreation, orderInCreation, currentEstablishment, dbUser} = useAuth();
  const [distanceInfo, setDistanceInfo] = useState(null);
  //const [maxDistanceReached, setMaxDistanceReached] = useState(false);
  const {maxDistanceReached, setMaxDistanceReached, setLoginDialogOpen} = useAuth();

  useEffect(() => {
    let userAdress = getUserAdress();
    setAdressValue(userAdress);
    let geocodes = getUserAdressLngLat();
    if (geocodes && userAdress) {
      updateDeliveryAdress(userAdress, geocodes.lat, geocodes.lng);
      setAdressValue(userAdress)
    }
    else if (localStorage.getItem(DIST_INFO) ) {
      let distInfo = JSON.parse(localStorage.getItem(DIST_INFO));
      updateDeliveryAdress(distInfo.address, distInfo.lat, distInfo.lng)
      setAdressValue(distInfo.address);
    }
    else {
      setAdressEditLock(false);
    }
  }, [dbUser])


  const handleFormSubmit = async (values: any) => {
    console.log(values)
    router.push('/payment')
  }

  const handleCheckboxChange =
      (values: typeof initialValues, setFieldValue: any) => (e: any, _: boolean) => {
        const checked = e.currentTarget.checked

        setSameAsShipping(checked)
        setFieldValue('same_as_shipping', checked)
        setFieldValue('billing_name', checked ? values.shipping_name : '')
      }


  function setSelectedBookingSlot(bookingSlot) {
    setOrderInCreation({
      ...orderInCreation(),
      bookingSlot: bookingSlot,
    })
  }

  function setDeliveryMode(deliveryMode: string) {
    setOrderInCreation({
      ...orderInCreation(),
      deliveryMode: deliveryMode,
    })
  }

  function updateDeliveryAdress(adress, lat, lng) {
    setOrderInCreation({
      ...orderInCreation(),
      deliveryAddress: {
        adress: adress,
        lat: lat,
        lng: lng,
      },
    })
  }

  function getUserAdress() {
    if (!dbUser || !dbUser.userProfileInfo || !dbUser.userProfileInfo.address) {
      return null
    }
    return dbUser.userProfileInfo.address;
  }

  function getUserAdressLngLat() {
    if (!dbUser || !dbUser.userProfileInfo || !dbUser.userProfileInfo.address) {
      return null
    }
    return {
      lng : dbUser.userProfileInfo.lng,
      lat : dbUser.userProfileInfo.lat,
    };
  }

  return (
      <Formik
          initialValues={getInitialValues(dbUser)}
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
              <Card1 sx={{ mb: '2rem' }}>
                {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                  orderInCreation() && orderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                <Box p={1}>
                  <Alert severity={maxDistanceReached ? "warning" : "success"} style={{marginBottom: 2}}>
                    {maxDistanceReached ?
                        localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                    {
                      localStrings.formatString(localStrings.distanceTime,
                          (distanceInfo.distance / 1000),
                          formatDuration(distanceInfo, localStrings))
                    }

                  </Alert>
                </Box>
                }

                <Typography fontWeight="600" mb={2}>
                  {localStrings.deliveryMode}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="gender" name="gender1"
                              value={orderInCreation() && orderInCreation().deliveryMode}
                              onChange={(event) => setDeliveryMode(event.target.value)}>
                    <Grid item sm={12} xs={12}>
                      <FormControlLabel value={ORDER_DELIVERY_MODE_DELIVERY} control={<Radio />}
                                        label={localStrings.delivery}/>
                      <FormControlLabel value={ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} control={<Radio />}
                                        label={localStrings.clickAndCollect} />
                    </Grid>
                  </RadioGroup>
                </FormControl>
                {orderInCreation() && orderInCreation().deliveryMode === ORDER_DELIVERY_MODE_DELIVERY &&
                <>
                <Typography fontWeight="600" mb={2} mt={2}>
                  {localStrings.deliveryAdress}
                </Typography>

                <Grid container spacing={3}>
                {/*<Box display="flex" p={1}>*/}
                  <Grid item xs={12} lg={8}>
                    <GoogleMapsAutocomplete noKeyKnown
                                            required
                                            setterValueSource={setAdressValue}
                                            valueSource={adressValue}
                                            disabled={adressEditLock}
                                            setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                              if (currentEstablishment()) {
                                                let dist = await getDeliveryDistance(currentEstablishment(), lat, lng);
                                                setDistanceAndCheck(dist,setMaxDistanceReached, setDistanceInfo, currentEstablishment);
                                              }
                                               updateDeliveryAdress(label, lat, lng);
                                              setAdressEditLock(true);
                                            }}/>
                  </Grid>
                  {adressEditLock &&
                  <Grid item xs={12} lg={4}>
                    <Button variant="contained"
                            onClick={() => setAdressEditLock(false)}
                            color="primary" type="button" fullWidth>
                      {localStrings.deliverToOtherAddress}
                    </Button>
                  </Grid>
                  }
                </Grid>
                </>
                }

              </Card1>

              <Card1 sx={{ mb: '2rem' }}>

                {/*<Typography fontWeight="600" mb={2}>*/}
                {/*  {localStrings.timeSlot}*/}
                {/*</Typography>*/}
                {/*{JSON.stringify(contextData ? contextData.brand : {})}*/}
              <BookingSlots
                  startDateParam={moment()}
                  selectCallBack={(bookingSlot) => setSelectedBookingSlot(bookingSlot)}
                  deliveryMode={orderInCreation().deliveryMode}
                  selectedKeyParam={selectedSlotKey}
                  setterSelectedKey={setSelectedSlotKey}
                  brandId={contextData && contextData.brand.id}
              />

                {/*<p>{contextData.brand.id}</p>*/}
              </Card1>

              <Card1 sx={{ mb: '2rem' }}>
                <Typography fontWeight="600" mb={2}>
                  {localStrings.profileInformation}
                </Typography>

                {!dbUser &&
                <Box mb={2}>
                  <Alert severity="info" style={{marginBottom: 2}}>{localStrings.info.connectToOrder}</Alert>
                </Box>
                }

                {!dbUser &&
                <>

                <Grid container spacing={3} mb={2}>
                  {/*<Box display="flex" p={1}>*/}


                  {/*<Grid item xs={12} lg={6}>*/}
                  {/*  <Button variant={bookWithoutAccount ? "contained" : "outlined"}*/}
                  {/*      onClick={() => setBookWithoutAccount(true)}*/}
                  {/*          color="primary" type="button" fullWidth>*/}
                  {/*    {localStrings.bookWithoutAccount}*/}
                  {/*  </Button>*/}
                  {/*</Grid>*/}


                  <Grid item xs={12} lg={12}>
                    <Button variant={"contained"}
                        onClick={() => {
                          setLoginDialogOpen(true);
                        }}
                            color="primary" type="button" fullWidth>
                      {localStrings.login}
                    </Button>
                  </Grid>
                </Grid>
                </>
                }

                {/*<FormControlLabel*/}
                {/*    label="Same as shipping address"*/}
                {/*    control={<Checkbox size="small" color="secondary" />}*/}
                {/*    sx={{*/}
                {/*      mb: sameAsShipping ? '' : '1rem',*/}
                {/*      zIndex: 1,*/}
                {/*      position: 'relative',*/}
                {/*    }}*/}
                {/*    onChange={handleCheckboxChange(values, setFieldValue)}*/}
                {/*/>*/}
                {/*{dbUser &&*/}
                {/*  <p>{JSON.stringify(dbUser.userProfileInfo)}</p>*/}
                {/*}*/}
                {dbUser &&
                  <Grid container spacing={6}>
                  <Grid item sm={12} xs={12}>
                    <TextField
                        className={classes.textField}
                        disabled={dbUser}
                        name="firstName"
                        label={localStrings.firstName}
                        fullWidth
                        sx={{mb: '1rem'}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={dbUser ? dbUser.userProfileInfo.firstName : (values.firstName || '')}
                        error={!!touched.firstName && !!errors.firstName}
                        helperText={touched.firstName && errors.firstName}
                    />

                    <TextField
                        className={classes.textField}
                        disabled={dbUser}
                        name="lastname"
                        label={localStrings.lastName}
                        fullWidth
                        sx={{mb: '1rem'}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={dbUser ? dbUser.userProfileInfo.lastName : (values.lastname || '')}
                        error={!!touched.lastname && !!errors.lastname}
                        helperText={touched.lastname && errors.lastname}
                    />

                    <TextField
                        className={classes.textField}
                        disabled={dbUser}
                        name="email"
                        label={localStrings.email}
                        fullWidth
                        sx={{mb: '1rem'}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={dbUser ? dbUser.userProfileInfo.email : (values.email || '')}
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        className={classes.textField}
                        disabled={dbUser}
                        name="address"
                        label={localStrings.address}
                        fullWidth
                        sx={{mb: '1rem'}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={dbUser ? dbUser.userProfileInfo.address : (values.address || '')}
                        error={!!touched.address && !!errors.address}
                        helperText={touched.address && errors.address}
                    />

                    <TextField
                        className={classes.textField}
                        disabled={dbUser}
                        name="phone"
                        label={localStrings.phone}
                        fullWidth
                        sx={{mb: '1rem'}}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={dbUser ? dbUser.userProfileInfo.phoneNumber : (values.phoneNumber || '')}
                        error={!!touched.phone && !!errors.phone}
                        helperText={touched.phone && errors.phone}
                    />
                    {/*<TextField*/}
                    {/*    name="billing_contact"*/}
                    {/*    label="Phone Number"*/}
                    {/*    fullWidth*/}
                    {/*    sx={{ mb: '1rem' }}*/}
                    {/*    onBlur={handleBlur}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    value={values.billing_contact || ''}*/}
                    {/*    error={!!touched.billing_contact && !!errors.billing_contact}*/}
                    {/*    helperText={touched.billing_contact && errors.billing_contact}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    name="billing_zip"*/}
                    {/*    label="Zip Code"*/}
                    {/*    type="number"*/}
                    {/*    fullWidth*/}
                    {/*    sx={{ mb: '1rem' }}*/}
                    {/*    onBlur={handleBlur}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    value={values.billing_zip || ''}*/}
                    {/*    error={!!touched.billing_zip && !!errors.billing_zip}*/}
                    {/*    helperText={touched.billing_zip && errors.billing_zip}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    name="billing_address1"*/}
                    {/*    label="Address 1"*/}
                    {/*    fullWidth*/}
                    {/*    onBlur={handleBlur}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    value={values.billing_address1 || ''}*/}
                    {/*    error={!!touched.billing_address1 && !!errors.billing_address1}*/}
                    {/*    helperText={touched.billing_address1 && errors.billing_address1}*/}
                    {/*/>*/}
                  </Grid>
                  {/*<Grid item sm={12} xs={12}>*/}

                  {/*</Grid>*/}
                  {/*<Grid item sm={6} xs={12}>*/}
                  {/*  <TextField*/}
                  {/*      name="billing_email"*/}
                  {/*      label="Email Address"*/}
                  {/*      type="email"*/}
                  {/*      fullWidth*/}
                  {/*      sx={{ mb: '1rem' }}*/}
                  {/*      onBlur={handleBlur}*/}
                  {/*      onChange={handleChange}*/}
                  {/*      value={values.billing_email || ''}*/}
                  {/*      error={!!touched.billing_email && !!errors.billing_email}*/}
                  {/*      helperText={touched.billing_email && errors.billing_email}*/}
                  {/*  />*/}
                  {/*  <TextField*/}
                  {/*      name="billing_company"*/}
                  {/*      label="Company"*/}
                  {/*      fullWidth*/}
                  {/*      sx={{ mb: '1rem' }}*/}
                  {/*      onBlur={handleBlur}*/}
                  {/*      onChange={handleChange}*/}
                  {/*      value={values.billing_company || ''}*/}
                  {/*      error={!!touched.billing_company && !!errors.billing_company}*/}
                  {/*      helperText={touched.billing_company && errors.billing_company}*/}
                  {/*  />*/}
                  {/*  <Autocomplete*/}
                  {/*      options={countryList}*/}
                  {/*      getOptionLabel={(option) => option.label || ''}*/}
                  {/*      value={values.billing_country}*/}
                  {/*      sx={{ mb: '1rem' }}*/}
                  {/*      fullWidth*/}
                  {/*      onChange={(_e, value) => setFieldValue('billing_country', value)}*/}
                  {/*      renderInput={(params) => (*/}
                  {/*          <TextField*/}
                  {/*              label="Country"*/}
                  {/*              placeholder="Select Country"*/}
                  {/*              error={!!touched.billing_country && !!errors.billing_country}*/}
                  {/*              helperText={*/}
                  {/*                touched.billing_country && errors.billing_country*/}
                  {/*              }*/}
                  {/*              {...params}*/}
                  {/*          />*/}
                  {/*      )}*/}
                  {/*  />*/}
                  {/*  <TextField*/}
                  {/*      name="billing_address2"*/}
                  {/*      label="Address 2"*/}
                  {/*      fullWidth*/}
                  {/*      onBlur={handleBlur}*/}
                  {/*      onChange={handleChange}*/}
                  {/*      value={values.billing_address2 || ''}*/}
                  {/*      error={!!touched.billing_address2 && !!errors.billing_address2}*/}
                  {/*      helperText={touched.billing_address2 && errors.billing_address2}*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                </Grid>
                }

              </Card1>

              {dbUser &&
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <Link href="/cart">
                    <Button variant="outlined" color="primary" type="button" fullWidth>
                      {localStrings.backToCart}
                    </Button>
                  </Link>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    {localStrings.checkOutNow}
                  </Button>
                </Grid>
              </Grid>
              }
            </form>
        )}
      </Formik>
  )
}

const getInitialValues = (dbUser) => {
  return {
    firstName: dbUser ? dbUser.userProfileInfo.firstName : '',
    lastname:  dbUser ? dbUser.userProfileInfo.lastName : '',
    email:  dbUser ? dbUser.userProfileInfo.email : '',
    address:  dbUser ? dbUser.userProfileInfo.address : '',
    phoneNumber:  dbUser ? dbUser.userProfileInfo.phoneNumber : '',
    // billing_country: countryList[229],
    // billing_address1: '',
    // billing_address2: '',
  }
}


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


// uncommect these fields below for from validation
const checkoutSchema = yup.object().shape({

  firstName: yup.string().required(localStrings.check.requiredField),
  lastName: yup.string().required(localStrings.check.requiredField),
  email: yup.string().email("invalid email").required(localStrings.check.requiredField),
  address: yup.string().required(localStrings.check.requiredField),
  //phone: yup.string().email("invalid email").required("required"),
  phoneNumber: yup.string().matches(phoneRegExp, localStrings.check.badPhoneFormat)
  // shipping_contact: yup.string().required("required"),
  // shipping_zip: yup.string().required("required"),
  // shipping_country: yup.object().required("required"),
  // shipping_address1: yup.string().required("required"),
  // billing_name: yup.string().required("required"),
  // billing_email: yup.string().required("required"),
  // billing_contact: yup.string().required("required"),
  // billing_zip: yup.string().required("required"),
  // billing_country: yup.object().required("required"),
  // billing_address1: yup.string().required("required"),
})

export default CheckoutForm
