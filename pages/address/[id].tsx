import AddressEditor from '@component/address/AddressEditor'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React from 'react'
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";
import {useQuery} from "@apollo/client";

const AddressUpdater = () => {
    const router = useRouter();
    //const { query } = useRouter();
    const { id } = router.query;
    const { back } = router.query;
    //let query = window.location.query.back

    //const back = query.back
    //console.log("query -------------" + back)
    //alert("query " + back)
  return (
    <DashboardLayout>
      <AddressEditor id={id} back={back}/>
    </DashboardLayout>
  )
}

export default AddressUpdater
