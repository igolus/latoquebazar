import BazarIconButton from '@component/BazarIconButton'
import Image from '@component/BazarImage'
import Facebook from '@component/icons/Facebook'
import Google from '@component/icons/Google'
import Instagram from '@component/icons/Instagram'
import Twitter from '@component/icons/Twitter'
import {Box, Container, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
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

  function firstOrCurrentEstablishment() {
    if (currentEstablishment()) {
      return currentEstablishment();
    }
    return contextData?.establishments[0];
  }

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
                    {firstOrCurrentEstablishment() && firstOrCurrentEstablishment().address ?
                        firstOrCurrentEstablishment().address : contextData?.establishments[0]?.address }
                  </Box>
                  <Box py={0.6} color="grey.500">
                    {firstOrCurrentEstablishment() && firstOrCurrentEstablishment().contactMail ?
                        <a href={"mailto:\"" + firstOrCurrentEstablishment().contactMail + "\""}>{firstOrCurrentEstablishment().contactMail}</a>
                        :
                        <a href={"mailto:\"" + contextData?.establishments[0]?.contactMail + "\""}>{contextData?.establishments[0]?.contactMail}</a>
                    }
                  </Box>
                  <Box py={0.6} mb={2} color="grey.500">
                    {firstOrCurrentEstablishment() && firstOrCurrentEstablishment().phoneNumber ?
                        <a href={"tel:\"" + firstOrCurrentEstablishment().phoneNumber + "\""}>{firstOrCurrentEstablishment().phoneNumber}</a>
                        :
                        <a href={"tel:\"" + contextData?.establishments[0]?.phoneNumber + "\""}>{contextData?.establishments[0]?.phoneNumber}</a>
                    }
                  </Box>

                  {contextData?.brand?.config?.socialWebConfig?.googleMBCommentUrl &&
                  <a
                      href={contextData?.brand?.config?.socialWebConfig?.googleMBCommentUrl}
                      target="_blank"
                      rel="noreferrer noopenner"
                  >
                    <Box py={0.6} color="grey.500">
                      {localStrings.leaveCommentOnGoogle}
                    </Box>
                  </a>
                  }


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
                          {item.component ?
                              item.component
                              :
                              <BazarIconButton
                                  m={0.5}
                                  bgcolor="rgba(0,0,0,0.2)"
                                  fontSize="20px"
                                  padding="10px"
                              >
                              <item.icon fontSize="inherit"/>
                              </BazarIconButton>
                          }
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

          </Container>
        </Box>
      </footer>
  )
}
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
    if (socialWebConfig.googleMBUrl) {
      ret.push({ icon: Google, url: socialWebConfig.googleMBUrl })
    }
    return ret;
  }
  return [];

}

export default Footer
