import Navbar from '@component/navbar/Navbar'
import { Container, Grid } from '@material-ui/core'
import React from 'react'
import AppLayout from './AppLayout'
import CustomerDashboardNavigation from './CustomerDashboardNavigation'
import {OrdersProps} from "../../../pages/orders";

export interface OrdersProps {
  contextData?: any
}

const CustomerDashboardLayout:React.FC<OrdersProps> = ({ children, contextData }) => (
  <AppLayout navbar={<Navbar contextData={contextData}/>}>
    <Container sx={{ my: '2rem' }}>
      <Grid container spacing={3}>
        <Grid
          item
          lg={3}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        >
          <CustomerDashboardNavigation />
        </Grid>
        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  </AppLayout>
)

export default CustomerDashboardLayout
