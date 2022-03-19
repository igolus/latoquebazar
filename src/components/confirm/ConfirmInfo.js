import React from 'react';
import OrderContent from "@component/orders/OrderContent";

function ConfirmInfo({ orderSource, contextData  }) {
    return(
        <>
            {/*<p>{JSON.stringify(justCreatedOrder || {})}</p>*/}
            <OrderContent
                order={orderSource}
                contextData={contextData}
                modeConfirmed/>
        </>

    )
}

export default ConfirmInfo