import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import CustomerOrderList from '@component/orders/CustomerOrderList'
import React, {useEffect} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {useRouter} from "next/router";
import useAuth from "@hook/useAuth";

export interface OrdersProps {
    contextData?: any
}


const Orders:React.FC<OrdersProps> = ({contextData}) => {
    const router = useRouter();
    const {dbUser} = useAuth();

    useEffect(() => {
            if (!dbUser) {
                //alert("push user")
                router.push("/profile")
            }
        },
        [dbUser]
    )

    return (
        <CustomerDashboardLayout contextData={contextData}>
            <CustomerOrderList contextData={contextData} />
        </CustomerDashboardLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default Orders
