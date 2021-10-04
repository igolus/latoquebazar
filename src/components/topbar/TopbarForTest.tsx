import FlexBox from '@component/FlexBox'
import {H5} from '@component/Typography'
import {Container} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {layoutConstant} from '../../util/constants'
import React, {useEffect, useState} from 'react'
import localStrings from "../../localStrings";

const TopbarWrapper = styled('div')(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  height: layoutConstant.topbarHeight,
  fontSize: 12,
  '& .topbarLeft': {
    '& .logo': {
      display: 'none',
    },
    '& .title': {
      marginLeft: '10px',
    },
    '@media only screen and (max-width: 900px)': {
      '& .logo': {
        display: 'block',
      },
      '& > *:not(.logo)': {
        display: 'none',
      },
    },
  },
  '& .topbarRight': {
    '& .link': {
      paddingRight: 30,
      color: theme.palette.secondary.contrastText,
    },
    '@media only screen and (max-width: 900px)': {
      '& .link': {
        display: 'none',
      },
    },
  },
  '& .smallRoundedImage': {
    height: 15,
    width: 25,
    borderRadius: 2,
  },
  '& .handler': {
    height: layoutConstant.topbarHeight,
  },
  '& .menuTitle': {
    fontSize: 12,
    marginLeft: '0.5rem',
    fontWeight: 600,
  },
  '& .menuItem': {
    minWidth: 100,
  },
  '& .marginRight': {
    marginRight: '1.25rem',
  },
}))

const TopbarForTest = () => {
  const [currency, setCurrency] = useState(currencyList[0])
  const [language, setLanguage] = useState(languageList[0])

  const handleCurrencyClick = (curr: any) => () => {
    setCurrency(curr)
  }

  const handleLanguageClick = (lang: any) => () => {
    console.log(lang)

    setLanguage(lang)
  }

  useEffect(() => {
    // get language from browser
    // console.log(navigator.language);
  }, [])

  return (
    <TopbarWrapper>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/*<FlexBox className="topbarLeft" alignItems="center">*/}
        {/*  <div className="logo">*/}
        {/*    <Link href="/">*/}
        {/*      <Image*/}
        {/*        display="block"*/}
        {/*        height="28px"*/}
        {/*        src="/assets/images/logo.svg"*/}
        {/*        alt="logo"*/}
        {/*      />*/}
        {/*    </Link>*/}
        {/*  </div>*/}

        {/*  <FlexBox alignItems="center">*/}
        {/*    <CallOutlined fontSize="small" />*/}
        {/*    <Span className="title">+88012 3456 7894</Span>*/}
        {/*  </FlexBox>*/}
        {/*  <FlexBox alignItems="center" ml={2.5}>*/}
        {/*    <MailOutline fontSize="small" />*/}
        {/*    <Span className="title">support@ui-lib.com</Span>*/}
        {/*  </FlexBox>*/}
        {/*</FlexBox>*/}

        <FlexBox alignItems="right">
          <H5>{localStrings.demoDisclaim}</H5>
        </FlexBox>
      </Container>
    </TopbarWrapper>
  )
}

const languageList = [
  {
    title: 'EN',
    imgUrl: '/assets/images/flags/usa.png',
  },
  {
    title: 'BN',
    imgUrl: '/assets/images/flags/bd.png',
  },
  {
    title: 'HN',
    imgUrl: '/assets/images/flags/in.png',
  },
]

const currencyList = [
  {
    title: 'USD',
    imgUrl: '/assets/images/flags/usa.png',
  },
  {
    title: 'EUR',
    imgUrl: '/assets/images/flags/uk.png',
  },
  {
    title: 'BDT',
    imgUrl: '/assets/images/flags/bd.png',
  },
  {
    title: 'INR',
    imgUrl: '/assets/images/flags/in.png',
  },
]

export default TopbarForTest
