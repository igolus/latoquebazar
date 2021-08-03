import React, {useEffect, useState} from 'react';
import useAuth from "../../hooks/useAuth";

function ConfirmInfo({ contextData }) {
    const {justCreatedOrder} = useAuth();
    return(
        <p>{JSON.stringify(justCreatedOrder || {})}</p>
    )
}

export default ConfirmInfo