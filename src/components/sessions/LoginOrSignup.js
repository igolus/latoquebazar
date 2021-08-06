import React, {Component, useEffect} from 'react';
import useAuth from "../../hooks/useAuth";
import Login, {StyledCard} from "./Login";
import Signup from "./Signup";
import CompleteProfile from "@component/sessions/CompleteProfile";
import {executeQueryUtilSync} from "../../apolloClient/gqlUtil";
import {getSiteUserByIdQuery} from "../../gql/siteUserGql";
import {CircularProgress} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const LoginOrSignup = ({closeCallBack}) => {
    const {getDbUser, user, dbUser, setDbUser, loginOnGoing} = useAuth();
    useEffect(() => {
        if (dbUser) {
            closeCallBack();
        }
    }, [dbUser, setDbUser])

    if (!user) {
        return (<Login closeCallBack={closeCallBack}/>);
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