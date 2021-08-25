import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import CustomerOrderList from '@component/orders/CustomerOrderList'
import React, {useEffect, useState} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {CartProps} from "../cart";
import useAuth from "@hook/useAuth";
import {executeQueryUtil} from "../../src/apolloClient/gqlUtil";
import {getCustomerOrdersOnlyIdQuery, getCustomerOrdersQuery} from "../../src/gql/orderGql";

export interface OrdersProps {
    contextData?: any
}

export const loadOrderCount = async (dbUser, contextData, setterCount) => {
    if (dbUser && contextData) {
        const brandId = contextData.brand.id;
        let result = await executeQueryUtil(getCustomerOrdersOnlyIdQuery(brandId, dbUser.id));
        if (result && result.data) {
            setterCount(result.data.getSiteUser.orders.length);
        }
    }
}

const Orders:React.FC<OrdersProps> = ({contextData}) => {
    const [orderCount, setOrderCount] = useState(0)
    const {dbUser} = useAuth();

    useEffect(async () => {
        loadOrderCount(dbUser, contextData,setOrderCount)
    }, [dbUser, contextData]);


    return (
        <CustomerDashboardLayout contextData={contextData} orderCount={orderCount}>
            <CustomerOrderList contextData={contextData} />
        </CustomerDashboardLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default Orders
