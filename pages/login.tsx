import FlexBox from '@component/FlexBox'
import React from 'react'
import LoginOrSignup from "../src/components/sessions/LoginOrSignup";

const LoginPage = () => {

  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <LoginOrSignup/>
    </FlexBox>
  )
}

export default LoginPage
