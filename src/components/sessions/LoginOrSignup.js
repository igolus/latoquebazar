import React, {Component, useEffect, useState} from 'react';
import useAuth from "../../hooks/useAuth";
import Login, {StyledCard} from "./Login";
import Signup from "./Signup";
import CompleteProfile from "@component/sessions/CompleteProfile";
import {executeQueryUtilSync} from "../../apolloClient/gqlUtil";
import {getSiteUserByIdQuery} from "../../gql/siteUserGql";
import {CircularProgress} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PassordReset from "@component/sessions/PassordReset";

const LoginOrSignup = ({closeCallBack}) => {
    const [lostPassword, setLostPassword] = useState(false)

    const {getDbUser, user, dbUser, setDbUser, loginOnGoing, currentUser} = useAuth();
    useEffect(() => {
        if (dbUser) {
            closeCallBack();
        }
    }, [dbUser, setDbUser, user, currentUser()])

    //return (<PassordReset></PassordReset>)
    if (lostPassword) {
        return (<PassordReset backCallBack={() => setLostPassword(false)}/>)
        //return (<h1>RESET</h1>)
    }

    if (!user || !currentUser().emailVerified) {
        return (<Login closeCallBack={closeCallBack} callBackBackToLostPassword={() => setLostPassword(true)}/>);
    }
    if (!dbUser && !loginOnGoing) {
        return (<CompleteProfile closeCallBack={closeCallBack}/>);
    }
    // else {
        //closeCallBack();
    // }

    return(

        // <Grid container justify="center">
            <></>
        // </Grid>
    // <div elevation={3} style={{minWidth:'200px', minHeight:'200px', verticalAlign: 'middle'}}>
    //     {/*<Box justifyContent="center">*/}
    //
    //
    //     {/*</Box>*/}
    //     <CircularProgress />
    // </div>
);
}

export default LoginOrSignup