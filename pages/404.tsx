import BazarImage from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import {Button} from '@material-ui/core'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import localStrings from "../src/localStrings";

const Error404 = () => {
  const router = useRouter()

  const handleGoBack = async () => {
    router.back()
  }

  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <BazarImage
        src="/assets/images/illustrations/404.svg"
        sx={{
          display: 'block',
          maxWidth: '320px',
          width: '100%',
          mb: '1.5rem',
        }}
      />
      <FlexBox flexWrap="wrap">
        {/*<Button*/}
        {/*  variant="outlined"*/}
        {/*  color="primary"*/}
        {/*  sx={{ m: '0.5rem', textTransform: "none"}}*/}
        {/*  onClick={handleGoBack}*/}
        {/*>*/}
        {/*  {localStrings.backNav}*/}
        {/*</Button>*/}
        <Link href="/">
          <Button variant="contained" color="primary" sx={{ m: '0.5rem', textTransform: "none" }}>
            {localStrings.backToHome}
          </Button>
        </Link>
      </FlexBox>
    </FlexBox>
  )
}

export default Error404
