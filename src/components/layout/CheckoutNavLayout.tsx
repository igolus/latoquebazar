import Navbar from '@component/navbar/Navbar'
import Stepper from '@component/stepper/Stepper'
import {Button, Container, Grid} from '@material-ui/core'
import { Box } from '@material-ui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AppLayout from './AppLayout'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import {getCartItems} from "../../util/cartUtil";
import Link from "next/link";

const CheckoutNavLayout: React.FC = ({ children , contextData}) => {
  //const [selectedStep, setSelectedStep] = useState(0)
  const router = useRouter()

  // const handleStepChange = (step: number) => {
  //   switch (step) {
  //     case 0:
  //       router.push('/cart')
  //       break
  //     case 1:
  //       router.push('/checkout')
  //       break
  //     case 2:
  //       router.push('/confirmed')
  //       break
  //     default:
  //       break
  //   }
  // }
  //
  // useEffect(() => {
  //   switch (pathname) {
  //     case '/cart':
  //       setSelectedStep(0)
  //       break
  //     case '/checkout':
  //       setSelectedStep(1)
  //       break
  //     case '/confirmed':
  //       setSelectedStep(3)
  //       break
  //     default:
  //       break
  //   }
  // }, [pathname])

  // function getStepperList() {
  //   if (getCartItems(orderInCreation).length == 0) {
  //     return [
  //       {
  //         title: localStrings.cart,
  //         disabled: false,
  //       }
  //     ]
  //   }
  //
  //   return [
  //     {
  //       title: localStrings.cart,
  //       disabled: false,
  //     },
  //     {
  //       title: localStrings.order,
  //       disabled: false,
  //     },
  //     {
  //       title: localStrings.confirm,
  //       disabled: false,
  //     },
  //   ]
  // }

  return (
    <AppLayout contextData={contextData} navbar={<Navbar contextData={contextData}/>} >
      <Container sx={{ my: '2rem' }}>
        {children}
      </Container>
    </AppLayout>
  )
}


export default CheckoutNavLayout
