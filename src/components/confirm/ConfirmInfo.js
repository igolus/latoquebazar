import React, {useEffect, useState} from 'react';
import useAuth from "../../hooks/useAuth";
import OrderContent from "@component/orders/OrderContent";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import localStrings from "../../localStrings";
import {formatDuration} from "../../util/displayUtil";

function ConfirmInfo({ contextData }) {
    const {justCreatedOrder} = useAuth();
    return(
        <>
            {/*<p>{JSON.stringify(justCreatedOrder || {})}</p>*/}
            <OrderContent
                order={justCreatedOrder}
                contextData={contextData}
                modeConfirmed/>
        </>

    )
}

export default ConfirmInfo