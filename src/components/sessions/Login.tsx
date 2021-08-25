import BazarButton from '@component/BazarButton'
import Image from '@component/BazarImage'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import { H3, H6, Small } from '@component/Typography'
import {Box, Button, Card, CardProps, CircularProgress, Divider, IconButton} from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {useCallback, useEffect, useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import useAuth from '../../hooks/useAuth';
import {executeQueryUtil, executeQueryUtilSync} from "../../apolloClient/gqlUtil";
import {getSiteUserByIdQuery} from "../../gql/siteUserGql";
import Signup from "@component/sessions/Signup";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";

const config = require("../../conf/config.json")

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

export const StyledCard = styled<React.FC<StyledCardProps & CardProps>>(
  ({ children, passwordVisibility, ...rest }) => <Card {...rest}>{children}</Card>
)<CardProps>(({ theme, passwordVisibility }) => ({
  //width: 500,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },

  '.content': {
    textAlign: 'center',
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

const Login = ({closeCallBack, callBackBackToLostPassword, contextData}) => {


  const classes = useStyles();
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [createAccountEnabled, setCreateAccountEnabled] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [sendingActivationLink, setSendingActivationLink] = useState(false)
  const [verifEmailSentAgain, setVerifEmailSentAgain] = useState(false)


  const { signInWithEmailAndPassword, signInWithGoogle, getBrandId,
    signInWithFaceBook, setLoginOnGoing, user, currentUser, sendEmailVerification, currentEstablishment} = useAuth();

  const router = useRouter()

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible)
  }, [])

  //
  // if (currentUser() && currentUser().emailVerified && !userInDB()) {
  //   return <Redirect to="/completeUser" />;
  // }

  useEffect(() => {
    setErrorSubmit(null);
    if (user && !user.emailVerified) {
      setErrorSubmit(localStrings.warningMessage.profileNotActivated);
    }
    // if (user && !currentUser().emailVerified) {
    //   alert("emailVerified " + JSON.stringify(user))
    //   alert("emailVerified " + JSON.stringify(currentUser()))
    //   console.log("currentUser() " + JSON.stringify(currentUser(), null, 2))
    // }
  }, [user])


  const handleFormSubmit = async (values: any) => {
    //alert("handleFormSubmit" + JSON.stringify(values))
    setErrorSubmit(null);
    try {
      var user = await signInWithEmailAndPassword(values.email, values.password);
      let result = await executeQueryUtil(getSiteUserByIdQuery(config.brandId, user.user.uid));
      setLoginOnGoing(false)
      if (result.data.getSiteUser) {
        if (closeCallBack) {
          closeCallBack();
        }
      }
    }
    catch (err) {

      if (err.code === 'auth/wrong-password') {
        setErrorSubmit(localStrings.errorMessages.wrongPassword);
      }
      else if (err.code === 'auth/user-not-found') {
        setErrorSubmit(localStrings.errorMessages.noUserEmail);
      }

      else {
        setErrorSubmit(err.message);
      }
      // if ("code":"auth/wrong-password")
      //alert("login error " + JSON.stringify(err))
    }

    // await signInWithEmailAndPassword()
    //
    // router.push('/profile')
    // console.log(values)
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      onSubmit: handleFormSubmit,
      initialValues,
      validationSchema: formSchema,
    })

  async function handleGoogleClick() {
    try {


      var user = await signInWithGoogle();

      let result = await executeQueryUtil(getSiteUserByIdQuery(config.brandId, user.user.uid));
      setLoginOnGoing(false)
      if (result.data.getSiteUser) {
        if (closeCallBack) {
          closeCallBack();
        }
      }

    } catch(err) {
      console.error(err);
    }
  }

  async function handleFacebookClick() {
    try {
      var user = await signInWithFaceBook();
      let result = await executeQueryUtil(getSiteUserByIdQuery(config.brandId, user.user.uid));
      setLoginOnGoing(false)
      if (result.data.getSiteUser) {
        if (closeCallBack) {
          closeCallBack();
        }
      }

    } catch(err) {
      console.error(err);
    }
  }

  function createAccount() {
    setCreateAccountEnabled(true)
  }

  async function sendActivationLink() {
    setVerifEmailSentAgain(false);
    setSendingActivationLink(true);
    await sendEmailVerification(contextData.brand, currentEstablishment());
    setSendingActivationLink(false);
    setVerifEmailSentAgain(true);
  }

  return (
    <>
      {createAccountEnabled ?
          <Signup contextData={contextData} callBackBackToLogin={() => setCreateAccountEnabled(false)} callBackBackToLostPassword={callBackBackToLostPassword}/>
          :
          <StyledCard elevation={3} passwordVisibility={passwordVisibility}>
            <form className="content" onSubmit={handleSubmit}>
              {/*<H3 textAlign="center" mb={1}>*/}
              {/*  Welcome To Ecommerce*/}
              {/*</H3>*/}
              <Small
                  fontWeight="600"
                  fontSize="12px"
                  color="grey.800"
                  textAlign="center"
                  mb={4.5}
                  display="block"
              >
                {localStrings.logEmailAndPassword}
              </Small>


              {user && verifEmailSentAgain &&
              <AlertHtmlLocal severity="info"
                              title={localStrings.infoMessage}
                              content={localStrings.formatString(localStrings.notif.activationEmailSentNotif, user.email)}
              />
              }

              {errorSubmit &&
              <AlertHtmlLocal severity="error"
                              title={localStrings.warning}
                              content={errorSubmit}>

                              {user && !user.emailVerified &&
                  <Box display="flex" flexDirection="row-reverse">
                    <Box mt={2} mb={2}>
                        <Button variant="contained" color="primary" type="button" fullWidth
                                endIcon={sendingActivationLink ? <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
                                onClick={sendActivationLink}>
                          {localStrings.sendLinkAgain}
                        </Button>
                    </Box>
                  </Box>
                  }
                </AlertHtmlLocal>
              }


              <BazarTextField
                  mb={1.5}
                  name="email"
                  label={localStrings.email}
                  placeholder="exmple@mail.com"
                  variant="outlined"
                  size="small"
                  type="email"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email || ''}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
              />

              <BazarTextField
                  mb={2}
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

              <BazarButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mb: '1.65rem',
                    height: 44,
                  }}
              >
                {localStrings.login}
              </BazarButton>

              <BazarButton
                  className="facebookButton"
                  onClick={handleFacebookClick}
                  size="medium"
                  fullWidth
                  sx={{
                    mb: '10px',
                    height: 44,
                  }}
              >
                <Image
                    src="/assets/images/icons/facebook-filled-white.svg"
                    alt="facebook"
                />
                <Box fontSize="12px" ml={1}>
                  {localStrings.continueWithFaceook}
                </Box>
              </BazarButton>


              <BazarButton
                  className="googleButton"
                  size="medium"
                  onClick={handleGoogleClick}
                  fullWidth
                  sx={{
                    height: 44,
                  }}
              >
                <Image src="/assets/images/icons/google-1.svg" alt="facebook" />
                <Box fontSize="12px" ml={1}>
                  {localStrings.continueWithGoogle}
                </Box>
              </BazarButton>

              <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
                <Box>{localStrings.dontHaveAccount}</Box>

                <Button variant="outlined" onClick={createAccount} style={{marginLeft:"10px"}}>
                  {localStrings.signup}
                </Button>
              </FlexBox>
            </form>

            <FlexBox justifyContent="center" alignItems="center"  bgcolor="grey.200" py={2.5}>
              <Box>{localStrings.forgotPassword}</Box>

              <Button variant="outlined" onClick={() => callBackBackToLostPassword()} style={{marginLeft:"10px"}}>
                {localStrings.resetPassword}
              </Button>
            </FlexBox>
          </StyledCard>
      }

    </>
  )
}

const initialValues = {
  email: '',
  password: '',
}

const formSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('${path} is required'),
  password: yup.string().required('${path} is required'),
})

export default Login
