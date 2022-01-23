import BazarButton from '@component/BazarButton'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import {H3} from '@component/Typography'
import {Box, Button, Card, CardProps, CircularProgress, IconButton,} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useCallback, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {green} from "@material-ui/core/colors";

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

const Signup = ({callBackBackToLogin, callBackBackToLostPassword, contextData}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [submitOnGoing, setSubmitOnGoing] = useState(false)
  const router = useRouter()
  const {createUserWithEmailAndPassword, sendEmailVerification, currentEstablishment} = useAuth();
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible)
  }, [])

  const handleFormSubmit = async (values: any) => {
    setSubmitOnGoing(true);
    //alert("existingconfs Email sent " + values.email + values.password)
    try {
      setErrorSubmit(null);
      await createUserWithEmailAndPassword(values.email, values.password);
      callBackBackToLogin();
      await sendEmailVerification(contextData.brand, currentEstablishment());

    }
    catch (err) {
      //alert("err " + err);

      //alert(JSON.stringify(err))

      if (err.code === 'auth/email-already-in-use') {
        setErrorSubmit(localStrings.errorMessages .accountAlreadyExists);
      }
      else {
        setErrorSubmit(err.message);
      }
      //setErrors({submit: err.message});
    }
    finally {
      setSubmitOnGoing(false);
    }
    console.log(values)
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setErrors} =
      useFormik({
        onSubmit: handleFormSubmit,
        initialValues,
        validationSchema: formSchema,
      })



  return (
    <StyledCard elevation={3} passwordVisibility={passwordVisibility}>



      <form className="content" onSubmit={handleSubmit}>



        <H3 textAlign="center" mb={1}>
          {localStrings.createYourAccount}
        </H3>

        {/*<Box m={2}>*/}
        {errorSubmit &&
        <AlertHtmlLocal severity="error"
                        title={localStrings.warning}
                        content={errorSubmit}
        />
        }


        <BazarTextField
            mb={1.5}
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
            value={values.email}
        />


        <BazarTextField
          mb={1.5}
          name="password"
          label={localStrings.password}
          placeholder="*********"
          autoComplete="on"
          type={passwordVisibility ? 'text' : 'password'}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton
                size="small"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? (
                  <Visibility className="passwordEye" fontSize="small" />
                ) : (
                  <VisibilityOff className="passwordEye" fontSize="small" />
                )}
              </IconButton>
            ),
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password || ''}
          error={!!touched.password && !!errors.password}
          helperText={touched.password && errors.password}
        />

        <BazarTextField
            mb={2}
          name="re_password"
          label={localStrings.reTypePassword}
          placeholder="*********"
          autoComplete="on"
          type={passwordVisibility ? 'text' : 'password'}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton
                size="small"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? (
                  <Visibility className="passwordEye" fontSize="small" />
                ) : (
                  <VisibilityOff className="passwordEye" fontSize="small" />
                )}
              </IconButton>
            ),
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.re_password || ''}
          error={!!touched.re_password && !!errors.re_password}
          helperText={touched.re_password && errors.re_password}
        />

        <BazarButton
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            height: 44,
          }}
          disabled={submitOnGoing}
          endIcon={submitOnGoing ?
              <CircularProgress size={30} style={{color: green[500]}}/> : <></>}
        >
          {localStrings.createYourAccount}
        </BazarButton>

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

        <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
          <Box>{localStrings.havingAnAccount}</Box>

          <Button variant="outlined" onClick={() => callBackBackToLogin()} style={{marginLeft:"10px"}}>

            {localStrings.login}
          </Button>
          {/*<Link href="/login">*/}
          {/*  <a>*/}
          {/*    <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">*/}
          {/*      {localStrings.login}*/}
          {/*    </H6>*/}
          {/*  </a>*/}
          {/*</Link>*/}
        </FlexBox>
      </form>

      <FlexBox justifyContent="center" alignItems="center"  bgcolor="grey.200" py={2.5}>
        <Box>{localStrings.forgotPassword}</Box>

        <Button variant="outlined" onClick={() => callBackBackToLostPassword()} style={{marginLeft:"10px"}}>
          {localStrings.resetPassword}
        </Button>
        {/*<Link href="/">*/}
        {/*  <a>*/}
        {/*    <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">*/}
        {/*      {localStrings.resetPassword}*/}
        {/*    </H6>*/}
        {/*  </a>*/}
        {/*</Link>*/}
      </FlexBox>
    </StyledCard>
  )
}

const initialValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  re_password: '',
  agreement: false,
}

const formSchema = yup.object().shape({
  // firstName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
  // lastName: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}')),
  email: yup.string().email('invalid email').required('${path} is required'),
  // phoneNumber: yup.string().required(localStrings.formatString(localStrings.requiredField, '${path}'))
  //     .matches(phoneRegExp, localStrings.check.badPhoneFormat),
  password: yup.string().required('${path} is required'),
  re_password: yup
    .string()
    .oneOf([yup.ref('password'), null], localStrings.check.passwordsMatch )
    .required(localStrings.check.reTypePassword),
  // agreement: yup
  //   .bool()s
  //   .test(
  //     'agreement',
  //       localStrings.check.termsAndConditionsMandatory,
  //     (value) => value === true
  //   )
  //   .required(localStrings.check.termsAndConditionsMandatory),
})

export default Signup
