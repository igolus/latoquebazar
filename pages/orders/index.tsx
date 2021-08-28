import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import CustomerOrderList from '@component/orders/CustomerOrderList'
import React from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";

export interface OrdersProps {
    contextData?: any
}

const Orders:React.FC<OrdersProps> = ({contextData}) => {

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
