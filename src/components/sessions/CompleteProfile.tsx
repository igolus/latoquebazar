import BazarButton from '@component/BazarButton'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import {H3, H6, Small} from '@component/Typography'
import {Card, CardProps, Checkbox, FormControlLabel,} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useCallback, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import {createSiteUserMutation} from "../../gql/siteUserGql";
import {DIST_INFO} from "@component/address/AdressCheck";
import {useToasts} from "react-toast-notifications";
import parsePhoneNumber from "libphonenumber-js";

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

const CompleteProfile = ({closeCallBack}) => {
  const {addToast} = useToasts();
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const { user, currentBrand, currentEstablishment, establishmentList, setDbUser } = useAuth();
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

    let data = {}
    data.establishmentIds = establishmentList ? establishmentList.map(item => item.id) : []
    data.defaultEstablishmentId = currentEstablishment().id
    data.brandId = currentBrand().id;
    data.id = user.id;
    let valueCopy = { ...values };

    // if (values.placeId == "") {
    //   let localStorageValue=JSON.parse(localStorage.getItem(DIST_INFO));
    //   valueCopy = {...valueCopy, ...localStorageValue}
    // }

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
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
      useFormik({
        onSubmit: handleFormSubmit,
        initialValues,
        validationSchema: formSchema,
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
                disabled={!values.agreement}
                sx={{
                  height: 44,
                }}
            >
              {localStrings.completeAccount}
            </BazarButton>
          </FlexBox>

          {/*<Box mb={2} mt={3.3}>*/}
          {/*  <Box width="200px" mx="auto">*/}
          {/*    <Divider />*/}
          {/*  </Box>*/}

          {/*  <FlexBox justifyContent="center" mt={-1.625}>*/}
          {/*    <Box color="grey.600" bgcolor="background.paper" px={2}>*/}
          {/*      on*/}
          {/*    </Box>*/}
          {/*  </FlexBox>*/}
          {/*</Box>*/}

          {/*<BazarButton*/}
          {/*  className="facebookButton"*/}
          {/*  size="medium"*/}
          {/*  fullWidth*/}
          {/*  sx={{*/}
          {/*    height: 44,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Image*/}
          {/*    src="/assets/images/icons/facebook-filled-white.svg"*/}
          {/*    alt="facebook"*/}
          {/*  />*/}
          {/*  <Box fontSize="12px" ml={1}>*/}
          {/*    Continue with Facebook*/}
          {/*  </Box>*/}
          {/*</BazarButton>*/}
          {/*<BazarButton*/}
          {/*  className="googleButton"*/}
          {/*  size="medium"*/}
          {/*  fullWidth*/}
          {/*  sx={{*/}
          {/*    height: 44,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Image src="/assets/images/icons/google-1.svg" alt="facebook" />*/}
          {/*  <Box fontSize="12px" ml={1}>*/}
          {/*    Continue with Google*/}
          {/*  </Box>*/}
          {/*</BazarButton>*/}

          {/*<FlexBox justifyContent="center" alignItems="center" my="1.25rem">*/}
          {/*  <Box>Don’t have account?</Box>*/}
          {/*  <Link href="/login">*/}
          {/*    <a>*/}
          {/*      <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">*/}
          {/*        Log In*/}
          {/*      </H6>*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</FlexBox>*/}
        </form>

        {/*<FlexBox justifyContent="center" bgcolor="grey.200" py={2.5}>*/}
        {/*  Forgot your password?*/}
        {/*  <Link href="/">*/}
        {/*    <a>*/}
        {/*      <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">*/}
        {/*        Reset It*/}
        {/*      </H6>*/}
        {/*    </a>*/}
        {/*  </Link>*/}
        {/*</FlexBox>*/}
      </StyledCard>
  )
}

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const formSchema = yup.object().shape({
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
            const phoneNumber = parsePhoneNumber(value, 'FR');
            //console.log("phoneNumber " + JSON.stringify(phoneNumber, null, 2))
            return phoneNumber?.isValid();
          })

  // phoneNumber: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}'))
  //     .matches(phoneRegExp, localStrings.check.badPhoneFormat),
  // agreement: yup
  //     .bool()
  //     .test(
  //         'agreement',
  //         localStrings.check.termsAndConditionsMandatory,
  //         (value) => value === true
  //     )
  //     .required(localStrings.check.termsAndConditionsMandatory),
})

export default CompleteProfile
