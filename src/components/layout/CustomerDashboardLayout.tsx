import Navbar from '@component/navbar/Navbar'
import {Container, Grid} from '@material-ui/core'
import React from 'react'
import AppLayout from './AppLayout'
import CustomerDashboardNavigation from './CustomerDashboardNavigation'
import useAuth from "@hook/useAuth";

export interface CustomerDashboardLayoutProps {
    title?: string
    description?: string
    ogImage?: string
    noIndex?: boolean
    contextData?: any

}

const CustomerDashboardLayout:React.FC<CustomerDashboardLayoutProps> = ({ children,
                                                           contextData,
                                                           title,
                                                           description,
                                                           ogImage,
                                                           noIndex

}) => {

    const {dbUser} = useAuth()
    return (
        <AppLayout contextData={contextData}
                   title={title}
                   description={description}
                   ogImage={ogImage}
                   noIndex={noIndex}
                   navbar={<Navbar contextData={contextData}/>}>
            {/*{orderCount}*/}
            {/*{JSON.stringify(contextData || {})}*/}
            <Container sx={{my: '2rem'}}>
                <Grid container spacing={3}>
                    {dbUser &&
                    <Grid
                        item
                        lg={3}
                        xs={12}
                        sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}
                    >
                        <CustomerDashboardNavigation/>
                    </Grid>
                    }
                    <Grid item lg={dbUser ? 9 : 12} xs={12}>
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </AppLayout>
    )

}

export default CustomerDashboardLayout
