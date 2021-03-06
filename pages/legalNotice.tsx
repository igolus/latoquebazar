import React, {useEffect, useState} from 'react'
import {GetStaticProps} from "next";
import MdRender from "@component/MdRender";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import axios from "axios";
import localStrings from "../src/localStrings";
import SeoHead from "@component/seo/SeoHead";

export interface ProductDetailsProps {
    contextData?: any
}
//const config = require('../../../src/conf/config.json');

const LegalNotice:React.FC<ProductDetailsProps> = ({contextData}) => {

    const [mdSource, setMdSource] = useState(null)
    useEffect(() => {
        // Create an scoped async function in the hook
        async function load() {
            let res = await axios.get("/md/legaNotice.md");
            setMdSource(res.data);
        }    // Execute the created function directly
        load();
    }, []);
    return (
        <>
            <SeoHead
                metaDesc={localStrings.cgv}
                metaTitle={localStrings.cgv}
            />
            {/*<Head>*/}
            {/*    <link rel="shortcut icon" id="favicon"*/}
            {/*          href={contextData?.brand?.iconUrl}/>*/}
            {/*</Head>*/}
            <div style={{margin:"25px"}}>
                {mdSource &&
                <MdRender content={mdSource}/>
                }
            </div>
        </>

    )
}

export const getStaticProps: GetStaticProps = async () => {
    return await getStaticPropsUtil();
}

export default LegalNotice
