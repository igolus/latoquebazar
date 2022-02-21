import AppStore from '@component/AppStore'
import BazarIconButton from '@component/BazarIconButton'
import Image from '@component/BazarImage'
import Facebook from '@component/icons/Facebook'
import Google from '@component/icons/Google'
import Instagram from '@component/icons/Instagram'
import Twitter from '@component/icons/Twitter'
import Youtube from '@component/icons/Youtube'
import { Paragraph } from '@component/Typography'
import { Box, Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MuiThemeProps } from '@theme/theme'
import Link from 'next/link'
import React from 'react'
import FlexBox from '../FlexBox'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";

const useStyles = makeStyles(({ palette }: MuiThemeProps) => ({
  link: {
    position: 'relative',
    display: 'block',
    padding: '0.3rem 0rem',
    color: palette.grey[500],
    cursor: 'pointer',
    borderRadius: 4,

    '&:hover': {
      color: palette.grey[100],
    },
  },
}))

const Footer = ({contextData}) => {
  const classes = useStyles()
  const { currentEstablishment } = useAuth();
  const logoUrl = contextData ? contextData.brand?.logoUrl : null;
  const brandName = contextData ? contextData.brand?.brandName : null;

  return (
    <footer>
      <Box bgcolor="#0c0e30">
        <Container sx={{ p: '1rem', color: 'white' }}>
          <Box py={10} overflow="hidden">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Link href="/">
                  <a>
                    <Image mb={2.5} src={logoUrl} alt="logo" />
                  </a>
                </Link>

              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Box
                  fontSize="25px"
                  fontWeight="600"
                  mb={2.5}
                  lineHeight="1"
                  color="white"
                >
                  {localStrings.contactUs}
                </Box>

                <Box py={0.6} color="grey.500">
                  {brandName}
                </Box>

                <Box py={0.6} color="grey.500">
                  {currentEstablishment() ? currentEstablishment().address : "-"}
                </Box>
                <Box py={0.6} color="grey.500">
                  {currentEstablishment() ? <a href={"mailto:\"" + currentEstablishment().contactMail + "\""}>{currentEstablishment().contactMail}</a>  : "-"}
                </Box>
                <Box py={0.6} mb={2} color="grey.500">
                  {currentEstablishment() ? <a href={"tel:\"" + currentEstablishment().phoneNumber + "\""}>{currentEstablishment().phoneNumber}</a> : "-"}
                </Box>


              </Grid>

              <Grid item lg={5} md={6} sm={6} xs={12} alignItems="end">
                <FlexBox className="flex" alignItems="flex-end" justifyContent="flex-end" mx={-0.625}>
                  {socialIconList(contextData ? contextData.brand : null).map((item, ind) => (
                      <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer noopenner"
                          key={ind}
                      >
                        <BazarIconButton
                            m={0.5}
                            bgcolor="rgba(0,0,0,0.2)"
                            fontSize="20px"
                            padding="10px"
                        >
                          <item.icon fontSize="inherit" />
                        </BazarIconButton>
                      </a>
                  ))}
                </FlexBox>
              </Grid>
            </Grid>
          </Box>

          <Box
              bgcolor="#0c0e30"
              fontSize="10px"
              fontWeight="400"
              //mb={2.5}
              lineHeight="1"
              color="grey.100"
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                // p: 1,
                mb: 0,
                bgcolor: "#0c0e30",

              }}
              >
            <Box mr={2}>
              <a href="https://latoquemagique.com" target="new">{localStrings.poweredBy}</a>
            </Box>
            <Box mr={2}>
              <a href="/legalNotice" target="new">{localStrings.legalNotice}</a>
            </Box>
            <Box mr={2}>
              <a href="/cgv" target="new">{localStrings.cgv}</a>
            </Box>
          </Box>

          {/*<Box*/}
          {/*    bgcolor="#0c0e30"*/}
          {/*    fontSize="10px"*/}
          {/*    fontWeight="400"*/}
          {/*    //mb={2.5}*/}
          {/*    lineHeight="1"*/}
          {/*    color="grey.100"*/}
          {/*    sx={{*/}
          {/*      display: 'flex',*/}
          {/*      flexDirection: 'row-reverse',*/}
          {/*      // p: 1,*/}
          {/*      mb: 0,*/}
          {/*      bgcolor: "#0c0e30",*/}

          {/*    }}*/}
          {/*>*/}

          {/*  <a href="/cgv">{localStrings.cgv}</a>*/}
          {/*</Box>*/}


        </Container>
      </Box>
      {/*<Box*/}
      {/*    bgcolor="#0c0e30"*/}
      {/*    fontSize="25px"*/}
      {/*    fontWeight="600"*/}
      {/*    //mb={2.5}*/}
      {/*    lineHeight="1"*/}
      {/*    color="white"*/}
      {/*    sx={{*/}
      {/*      display: 'flex',*/}
      {/*      flexDirection: 'row-reverse',*/}
      {/*      // p: 1,*/}
      {/*      mb: 0,*/}
      {/*      bgcolor: "#0c0e30",*/}

      {/*    }}*/}
      {/*    >*/}

      {/*  La toque magique*/}
      {/*</Box>*/}
    </footer>
  )
}

const aboutLinks = [
  'Careers',
  'Our Stores',
  'Our Cares',
  'Terms & Conditions',
  'Privacy Policy',
]

const customerCareLinks = [
  'Help Center',
  'How to Buy',
  'Track Your Order',
  'Corporate & Bulk Purchasing',
  'Returns & Refunds',
]

const iconList = [
  { icon: Facebook, url: 'https://www.facebook.com/UILibOfficial' },
  { icon: Twitter, url: 'https://twitter.com/uilibofficial' },
  {
    icon: Youtube,
    url: 'https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg',
  },
  { icon: Google, url: '/' },
  { icon: Instagram, url: 'https://www.instagram.com/uilibofficial/' },
]

const socialIconList = (brand) => {

  if (brand?.config?.socialWebConfig) {
    let ret = [];
    let socialWebConfig = brand?.config?.socialWebConfig;
    if (socialWebConfig.facebookUrl) {
      ret.push({ icon: Facebook, url: socialWebConfig.facebookUrl })
    }
    if (socialWebConfig.twitterUrl) {
      ret.push({ icon: Twitter, url: socialWebConfig.twitterUrl })
    }
    if (socialWebConfig.instagramUrl) {
      ret.push({ icon: Instagram, url: socialWebConfig.instagramUrl })
    }
    return ret;
  }
  return [];

}

export default Footer
