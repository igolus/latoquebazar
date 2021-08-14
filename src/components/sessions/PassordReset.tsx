import BazarButton from '@component/BazarButton'
import Image from '@component/BazarImage'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import { H3, H6, Small } from '@component/Typography'
import {Box, Button, Card, CardProps, Divider, IconButton} from '@material-ui/core'
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



const PassWordReset = ({backCallBack}) => {
  const [messageReset, setMessageReset] = useState(null)
  const [email, setEmail] = useState(null)
  const [errorSubmit, setErrorSubmit] = useState(null)

  const { resetPassword } = useAuth();

  //
  // if (currentUser() && currentUser().emailVerified && !userInDB()) {
  //   return <Redirect to="/completeUser" />;
  // }



  const handleFormSubmit = async (values: any) => {
    //alert("reset" + JSON.stringify(values))
    try {
      setEmail(values.email)
      resetPassword(values.email);
      setMessageReset(true);
      //backCallBack();
    }
    catch (err) {
      // if (err.code === 'auth/wrong-password') {
      //   setErrorSubmit(localStrings.errorMessages.wrongPassword);
      // }
      // else if (err.code === 'auth/user-not-found') {
      //   setErrorSubmit(localStrings.errorMessages.noUserEmail);
      // }
      //
      // else {
        setErrorSubmit(err.message);
      // }
      // if ("code":"auth/wrong-password")
      //alert("login error " + JSON.stringify(err))
    }

  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
      useFormik({
        onSubmit: handleFormSubmit,
        initialValues,
        validationSchema: formSchema,
      })
  return (
      <StyledCard elevation={3}>
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
            {localStrings.resetPassword}
          </Small>

          {messageReset &&
          <AlertHtmlLocal severity="info"
                          title={localStrings.warning}
                          content={localStrings.formatString(localStrings.info.resetPassword, email)}
          />
          }

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
            {localStrings.resetPassword}
          </BazarButton>

          <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
            {/*<Box>{localStrings.backToLoginPage}</Box>*/}

            <Button variant="outlined" onClick={backCallBack} style={{marginLeft:"10px"}}>
              {localStrings.backToLoginPage}
            </Button>
          </FlexBox>
        </form>

      </StyledCard>
  )
};

const initialValues = {
  email: '',
  password: '',
}

const formSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('${path} is required'),
})

export default PassWordReset
