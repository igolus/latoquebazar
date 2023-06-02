import BazarButton from '@component/BazarButton'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import {H3, H6, Small} from '@component/Typography'
import {Card, CardProps, Checkbox, CircularProgress, FormControlLabel,} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useCallback, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import {createSiteUserMutation} from "../../gql/siteUserGql";
import {useToasts} from "react-toast-notifications";
import parsePhoneNumber from "libphonenumber-js";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import {pixelCompleteRegistration} from "../../util/faceBookPixelUtil";

const fbStyle = {
  background: '#3B5998',
  color: 'white',
}
const googleStyle = {
  background: '#4285F4',
  color: 'white',
}

type StyledCardProps = {
  passwordVisibility?: boolean
}

const StyledCard = styled<React.FC<StyledCardProps & CardProps>>(
    ({ children, passwordVisibility, ...rest }) => <Card {...rest}>{children}</Card>
)<CardProps>(({ theme, passwordVisibility }) => ({
  width: 500,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },

  '.content': {
    padding: '3rem 3.75rem 0px',
    [theme.breakpoints.down('xs')]: {
      padding: '1.5rem 1rem 0px',
    },
  },
  '.passwordEye': {
    color: passwordVisibility ? theme.palette.grey[600] : theme.palette.grey[400],
  },
  '.facebookButton': {
    marginBottom: 10,
    '&:hover': fbStyle,
    ...fbStyle,
  },
  '.googleButton': {
    '&:hover': googleStyle,
    ...googleStyle,
  },
  '.agreement': {
    marginTop: 12,
    marginBottom: 24,
  },
}))

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: green[500],
  },
}));

const CompleteProfile = ({closeCallBack, language}) => {
  const classes = useStyles();
  const {addToast} = useToasts();
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [submitOnGoing, setSubmitOnGoing] = useState(false)
  const { user, currentBrand, currentEstablishment, establishmentList, setDbUser, dbUser, setLoginOnGoing, logout } = useAuth();
  const router = useRouter();

  const initialValues = {
    email: user.email || '',
    firstName: user.name && user.name !== user.email && user.name.split(" ").length > 0 ? user.name.split(" ")[0] : '',
    lastName: user.name && user.name.split(" ").length > 1 ? user.name.split(" ")[1] : '',
    agreement: false,
    commercialAgreement: true,
    //address: JSON.parse(localStorage.getItem(DIST_INFO)).address || '',
    placeId: '',
    city: '',
    postcode: '',
    citycode: '',
    lat: '',
    lng: '',
    phoneNumber: '',

  }

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible)
  }, [])

  const handleFormSubmit = async (values: any) => {
    setSubmitOnGoing(true);
    let data = {}
    data.establishmentIds = establishmentList ? establishmentList.map(item => item.id) : []
    data.defaultEstablishmentId = currentEstablishment().id
    data.brandId = currentBrand().id;
    data.id = user.id;
    let valueCopy = { ...values };

    delete valueCopy.agreement;
    delete valueCopy.submit
    delete valueCopy.establishments
    delete valueCopy.commercialAgreement
    valueCopy.phoneNumber = parsePhoneNumber(values.phoneNumber, 'FR').number
    data.userProfileInfo = { ...valueCopy };
    delete data.userProfileInfo.lat;
    delete data.userProfileInfo.lng;
    data.commercialAgreement = values.commercialAgreement;
    data.webUser = true;
    // alert("user.uid " + user.uid)
    // alert("user " + JSON.stringify(user));
    // alert("data " + JSON.stringify(data))
    const res = await executeMutationUtil(createSiteUserMutation(currentBrand().id, data));
    // alert("res " + JSON.stringify(res))
    if (res.data) {
      setDbUser(res.data.addSiteUser)
    }

    if (closeCallBack) {
      closeCallBack();
    }
    addToast(localStrings.notif.accountCreated, { appearance: 'success', autoDismiss: true });
    pixelCompleteRegistration(currentBrand())
    setSubmitOnGoing(false);
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
      useFormik({
        onSubmit: handleFormSubmit,
        initialValues,
        validationSchema: formSchema(language),
      })

  // function setFieldValueFromLocalStorage(setFieldValue: (field: string, value: any, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<any>> | Promise<void>)) {
  //
  //   let localStorageValue=JSON.parse(localStorage.getItem(DIST_INFO)).address;
  //
  //   setFieldValue("address", localStorageValue.address);
  //   setFieldValue("placeId", localStorageValue.placeId);
  //   setFieldValue("lat", localStorageValue.lat);
  //   setFieldValue("lng", localStorageValue.lng);
  //
  // }

  return (
      <StyledCard elevation={3} passwordVisibility={passwordVisibility}>
        <form className="content" onSubmit={handleSubmit}>
          <H3 textAlign="center" mb={1}>
            {localStrings.completeAccount}
          </H3>
          <Small
              fontWeight="600"
              fontSize="12px"
              color="grey.800"
              textAlign="center"
              mb={4.5}
              display="block"
          >
            {localStrings.fillInfoToContinue}
          </Small>
          {/*{setFieldValueFromLocalStorage(setFieldValue)}*/}
          {/*<GoogleMapsAutocomplete noKeyKnown*/}
          {/*                        required*/}
          {/*                        initialValue={JSON.parse(localStorage.getItem(DIST_INFO)).address}*/}
          {/*                        title={localStrings.address}*/}
          {/*                        error={!!touched.address && !!errors.address}*/}
          {/*                        helperText={touched.address && errors.address}*/}
          {/*                        setValueCallback={(label, placeId, city, postcode, citycode, lat, lng) => {*/}
          {/*                          setFieldValue("address", label);*/}
          {/*                          setFieldValue("placeId", placeId);*/}
          {/*                          setFieldValue("lat", lat);*/}
          {/*                          setFieldValue("lng", lng);*/}
          {/*                        }}/>*/}



          <BazarTextField
              mb={1.5}
              disabled
              name="email"
              label={localStrings.email}
              placeholder={localStrings.email}
              variant="outlined"
              size="small"
              type="email"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              //defaultValue={}
              value={user.email}
          />

          <BazarTextField
              mb={1.5}
              name="firstName"
              label={localStrings.firstName}
              placeholder={localStrings.firstName}
              variant="outlined"
              size="small"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              //defaultValue={user.name && user.name.split(" ").length > 0 ? user.name.split(" ")[0] : ''}
              value={values.firstName}
              error={!!touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
          />

          <BazarTextField
              mb={1.5}
              name="lastName"
              label={localStrings.lastName}
              placeholder={localStrings.lastName}
              variant="outlined"
              size="small"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              defaultValue={user.name && user.name.split(" ").length > 1 ? user.name.split(" ")[1] : ''}
              value={values.lastName}
              error={!!touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
          />

          <BazarTextField
              mb={1.5}
              name="phoneNumber"
              label={localStrings.phone}
              placeholder={localStrings.phone}
              variant="outlined"
              size="small"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              defaultValue={''}
              value={values.phoneNumber}
              error={!!touched.phoneNumber && !!errors.phoneNumber}
              helperText={touched.phoneNumber && errors.phoneNumber}
          />


          <FormControlLabel
              className="agreement"
              name="agreement"
              //onChange={handleChange}
              control={
                <Checkbox
                    onChange={(event ) => setFieldValue('agreement', event.target.checked)}
                    size="small"
                    color="secondary"
                    checked={values.agreement || false}
                />
              }
              label={
                <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                  {/*{localStrings.bySigningTermsAndConditions}*/}
                  <a href="/cgv" target="_blank" rel="noreferrer noopener">
                    <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                      {localStrings.cgvAccept}
                    </H6>
                  </a>
                </FlexBox>
              }
          />

          <FormControlLabel
              className="agreement"
              name="commercialAgreement"
              onChange={handleChange}
              control={
                <Checkbox
                    onChange={(event ) => setFieldValue('commercialAgreement', event.target.checked)}
                    size="small"
                    color="secondary"
                    checked={values.commercialAgreement || false}
                />
              }
              label={
                <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                  {/*{localStrings.bySigningTermsAndConditions}*/}
                  {/*<a href="/cgv" target="_blank">*/}
                    <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                      {localStrings.commercialAgreementAccept}
                    </H6>
                  {/*</a>*/}
                </FlexBox>
              }
          />

          <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
            <BazarButton
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                //disable={}
                disabled={!values.agreement || submitOnGoing}
                sx={{
                  height: 44,
                }}
                endIcon={submitOnGoing ?
                    <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
            >
              {localStrings.completeAccount}
            </BazarButton>

          </FlexBox>


          <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
            <BazarButton
                variant="contained"
                color="primary"
                onClick={async () => {
                  setDbUser(null);
                  if (closeCallBack) {
                    closeCallBack();
                  }
                  await logout();
                  setLoginOnGoing(false);
                  // router.push("/");
                }}
                fullWidth
                disable={!dbUser}
                sx={{
                  height: 44,
                }}
                endIcon={submitOnGoing ?
                    <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
            >
              {localStrings.logout}
            </BazarButton>
          </FlexBox>

        </form>

      </StyledCard>
  )
}

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const formSchema = (language) => {
  return yup.object().shape({
    lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
    //address: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
    phoneNumber: yup.string()
        .test(
            'goodFormat',
            localStrings.check.badPhoneFormat,
            value => {
              if (!value) {
                return false
              }
              const phoneNumber = parsePhoneNumber(value, language === 'fr' ? 'FR' : 'UK');
              //console.log("phoneNumber " + JSON.stringify(phoneNumber, null, 2))
              return phoneNumber?.isValid();
            })
  })
}

export default CompleteProfile
