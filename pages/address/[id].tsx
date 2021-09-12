import AddressEditor from '@component/address/AddressEditor'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React from 'react'
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";

const AddressUpdater = () => {
    const router = useRouter()
    const { id } = router.query;

  return (
    <DashboardLayout>
      <AddressEditor id={id}/>
    </DashboardLayout>
  )
}

export default AddressUpdater
