import React, {Component} from 'react';
import useAuth from "../../hooks/useAuth";
import Login from "./Login";
import Signup from "./Signup";
import CompleteProfile from "@component/sessions/CompleteProfile";

const LoginOrSignup = ({closeCallBack}) => {
    const {getDbUser, user} = useAuth();

    if (!user) {
        return (<Login closeCallBack/>);
    }
    if (!getDbUser()) {
        return (<CompleteProfile/>);
    }
    return(<></>);
}

export default LoginOrSignup