import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";
import useAuth from "@hook/useAuth";


export interface IndexPageProps {
    contextData?: any
}

// let isMobile: boolean = (width <= 768);
const SignagePage:React.FC<IndexPageProps> = ({contextData}) => {

    const {currentEstablishment, getContextDataAuth} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().brand) {
            return getContextDataAuth()
        }
        return contextData;
    }

    // useEffect(() => {
    //     setContextData(contextData);
    // }, [])

    // const width = useWindowSize()
    //
    // const config = require("../src/conf/config.json")
    //
    // const extraPages = contextData?.extraPages;
    // let firstPage;
    // let secondPage;
    // let thirdPage;
    //
    // if (extraPages && extraPages.length > 0) {
    //     firstPage = extraPages.find(page => page.id === "1" && page.active);
    //     secondPage = extraPages.find(page => page.id === "2" && page.active);
    //     thirdPage = extraPages.find(page => page.id === "3" && page.active);
    // }
    // function getContextDataOrInjected() {
    //     return getContextData() || contextData;
    // }

    return (

    <>
        <div style={{width:"100%", height:"100vh"}}
                    dangerouslySetInnerHTML={{__html: contextData?.brand?.config?.signagePage || ""}}/>
    </>
        // </div>




    // <>

    //         <p>{getContextData()?.brand?.config?.signagePage}</p>
    //     </>

        // </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default SignagePage
