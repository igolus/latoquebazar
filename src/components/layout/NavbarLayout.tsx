import { Container } from '@material-ui/core'
import React from 'react'
import Navbar from '../navbar/Navbar'
import AppLayout from './AppLayout'
import {isBrandInBadStripStatus} from "../../util/displayUtil";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import localStrings from "../../localStrings";

const NavbarLayout: React.FC = ({ children ,
                                    contextData,
                                    title,
                                    ogImage,
                                    description,
                                    noSpace}) => {
  return (
    <AppLayout title={title} contextData={contextData}
               description={description}
               ogImage={ogImage}
               navbar={<Navbar contextData={contextData}/>}>
      {/*<h1>AppLayout</h1>*/}
      {/*  {isBrandInBadStripStatus(contextData?.brand) ?*/}
      {/*      <Container sx={{ my: '2rem' }}>*/}
      {/*          <AlertHtmlLocal title={localStrings.siteUnavailable}*/}
      {/*                          content={localStrings.siteUnavailableDetail}>*/}
      {/*          </AlertHtmlLocal>*/}
      {/*      </Container>*/}
      {/*  :*/}
        {noSpace ?
            <div style={{width: "100%"}}>
                {children}
            </div>

            :
            <Container sx={{my: '2rem'}}>{children}</Container>
        }
        {/*}*/}
    </AppLayout>
  )
}

export default NavbarLayout
