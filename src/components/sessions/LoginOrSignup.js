import React, {Component, useEffect} from 'react';
import useAuth from "../../hooks/useAuth";
import Login from "./Login";
import Signup from "./Signup";
import CompleteProfile from "@component/sessions/CompleteProfile";
import {executeQueryUtilSync} from "../../apolloClient/gqlUtil";
import {getSiteUserByIdQuery} from "../../gql/siteUserGql";

const LoginOrSignup = ({closeCallBack}) => {
    const {getDbUser, user, dbUser, setDbUser} = useAuth();
    useEffect(() => {
        if (dbUser) {
            closeCallBack();
        }
    }, [dbUser, setDbUser])

    if (!user) {
        return (<Login closeCallBack={closeCallBack}/>);
    }
    if (!dbUser) {
        return (<CompleteProfile closeCallBack={closeCallBack}/>);
    }
    // else {
        //closeCallBack();
    // }

    return(<></>);
}

export default LoginOrSignup