import BazarButton from '@component/BazarButton'
import BazarTextField from '@component/BazarTextField'
import FlexBox from '@component/FlexBox'
import {Small} from '@component/Typography'
import {Button, Card, CardProps, CircularProgress} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useFormik} from 'formik'
import React, {useState} from 'react'
import * as yup from 'yup'
import localStrings from "../../localStrings";
import useAuth from '../../hooks/useAuth';
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {green} from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/styles";

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
  buttonProgress: {
    color: green[500],
  },
}))

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: green[500],
  },
}));

const PassWordReset = ({backCallBack, contextData}) => {
  const [messageReset, setMessageReset] = useState(null)
  const [email, setEmail] = useState(null)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false);

  const { resetPassword, currentEstablishment } = useAuth();

  const classes = useStyles();


  const handleFormSubmit = async (values: any) => {
    //alert("reset" + JSON.stringify(values))
    try {
      setLoading(true)
      setErrorSubmit(null);
      setEmail(values.email)
      await resetPassword(contextData.brand, currentEstablishment(), values.email);
      setMessageReset(true);
      setEmailSent(true);
      //backCallBack();
    }
    catch (err) {
      setErrorSubmit(err.message);
    }
    finally {
      setLoading(false);
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

          {!emailSent &&
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
          }

          {!emailSent &&
          <BazarButton
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
              sx={{
                mb: '1.65rem',
                height: 44,
              }}
          >
            {localStrings.resetPassword}
          </BazarButton>
          }

          <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
            {/*<Box>{localStrings.backToLoginPage}</Box>*/}

            <Button variant="outlined"
                    onClick={backCallBack}
                    style={{marginLeft:"10px"}}>
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
