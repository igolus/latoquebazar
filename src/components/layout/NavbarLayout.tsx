import { Container } from '@material-ui/core'
import React from 'react'
import Navbar from '../navbar/Navbar'
import AppLayout from './AppLayout'

const NavbarLayout: React.FC = ({ children ,
                                    contextData,
                                    title,
                                    ogImage,
                                    description}) => {
  return (
    <AppLayout title={title} contextData={contextData}
               description={description}
               ogImage={ogImage}
               navbar={<Navbar contextData={contextData}/>}>
      {/*<h1>AppLayout</h1>*/}
        <Container sx={{ my: '2rem' }}>{children}</Container>
    </AppLayout>
  )
}

export default NavbarLayout
