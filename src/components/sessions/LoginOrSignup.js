import React, {useEffect, useState} from 'react';
import useAuth from "../../hooks/useAuth";
import Login from "./Login";
import CompleteProfile from "@component/sessions/CompleteProfile";
import PassordReset from "@component/sessions/PassordReset";

const LoginOrSignup = ({closeCallBack, contextData}) => {
    const [lostPassword, setLostPassword] = useState(false)
    const language = contextData?.brand?.config?.language || 'fr';
    const {getDbUser, user, dbUser, setDbUser, loginOnGoing, currentUser} = useAuth();
    useEffect(() => {
        if (dbUser && closeCallBack) {
            closeCallBack();
        }
    }, [dbUser, setDbUser, user, currentUser()])

    //return (<PassordReset></PassordReset>)
    if (lostPassword) {
        return (<PassordReset backCallBack={() => setLostPassword(false)} contextData={contextData}/>)
        //return (<h1>RESET</h1>)
    }

    if (!user || !currentUser()?.emailVerified) {
        return (<Login contextData={contextData} closeCallBack={closeCallBack} callBackBackToLostPassword={() => setLostPassword(true)}/>);
    }
    if (!dbUser && !loginOnGoing) {
        return (<CompleteProfile closeCallBack={closeCallBack} language={language}/>);
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
