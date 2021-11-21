import AddressEditor from '@component/address/AddressEditor'
import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React from 'react'
import {useRouter} from "next/router";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {GetStaticPaths, GetStaticProps} from "next";

const AddressUpdater = ({contextData}) => {

    function getContextData() {
        return contextData;
    }

    const router = useRouter();
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
