import Navbar from '@component/navbar/Navbar'
import {Container} from '@material-ui/core'
import React from 'react'
import AppLayout from './AppLayout'

export interface CheckoutNavLayoutProps {
    title?: string
    description?: string
    ogImage?: string
    noIndex?: boolean
    contextData?: any

}

const CheckoutNavLayout: React.FC<CheckoutNavLayoutProps> = ({ children ,
                                         contextData,
                                         title,
                                         description,
                                         ogImage,
                                         noIndex
}) => {

  return (
    <AppLayout contextData={contextData}
               title={title}
               description={description}
               ogImage={ogImage}
               noIndex={noIndex}
               navbar={<Navbar contextData={contextData}/>} >
      <Container sx={{ my: '2rem' }}>
        {children}
      </Container>
    </AppLayout>
  )
}


export default CheckoutNavLayout
