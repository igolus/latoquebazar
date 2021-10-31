import AddressEditor from '@component/address/AddressEditor'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React from 'react'
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";

const AddressUpdater = () => {
    const router = useRouter();
    //const { query } = useRouter();
    const { getContextData } = useAuth();
    const { id } = router.query;
    const { back } = router.query;
    //let query = window.location.query.back

    //const back = query.back
    //console.log("query -------------" + back)
    //alert("query " + back)
  return (
    <DashboardLayout contextData={getContextData()}>
      <AddressEditor id={id} back={back}/>
    </DashboardLayout>
  )
}

// export const getStaticProps: GetStaticProps = async (context) => {
//     return await getStaticPropsUtil();
// }
//
// export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
//     return getStaticPathsUtil()
// }


export default AddressUpdater
