import DashboardLayout from '@component/layout/CustomerDashboardLayout'
import React from 'react'
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import {GetStaticProps} from "next";
import OrderDetailsComponent from "@component/orders/OrderDetailsComponent";

export interface OrderDetailsProps {
    contextData?: any
}

const OrderDetails:React.FC<OrderDetailsProps> = ({contextData}) => {
    // let params = {};
    function getContextData() {
        return contextData;
    }

    return (
        <DashboardLayout contextData={getContextData()} noIndex={true}>
            <OrderDetailsComponent contextData={contextData}/>
        </DashboardLayout>
    )
}
export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}


export default OrderDetails
