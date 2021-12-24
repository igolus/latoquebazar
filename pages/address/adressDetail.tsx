import AddressEditor from '@component/address/AddressEditor'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React, {useEffect} from 'react'
import {useRouter} from "next/router";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {GetStaticProps} from "next";
import useAuth from "@hook/useAuth";

const AddressUpdater = ({contextData}) => {
    const router = useRouter();
    const {dbUser} = useAuth()
    function getContextData() {
        return contextData;
    }

    useEffect(() => {
            if (!dbUser) {
                router.push("/profile")
            }

        },
        [dbUser])
    // const { id } = router.query;
    const { back } = router.query;

  return (
    <DashboardLayout contextData={getContextData()} noIndex={true}>
      <AddressEditor back={back}/>
    </DashboardLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


export default AddressUpdater
