import NavbarLayout from '@component/layout/NavbarLayout'
import React from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import useAuth from "@hook/useAuth";
import {useRouter} from "next/router";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";

export interface ProductDetailsProps {
    contextData?: any
}

export function renderMd(contentMd) {

    var md = require('markdown-it')({
        html: true,
        linkify: true,
        typographer: true
    });

    return md.render(contentMd);
    //
    // var markdown = ReactMarkdown.parse(this.props.markdown);
    // return <div dangerouslySetInnerHTML={{__html:markdown}} />;
}
//const config = require('../../../src/conf/config.json');

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData}) => {

    const router = useRouter();

    const { id } = router.query
    let pageId = id;


    const {getContextDataAuth} = useAuth();


    function getContextData() {
        if (getContextDataAuth() && (getContextDataAuth()?.extraPages || []).find(page => page.id === pageId)) {
            return getContextDataAuth()
        }
        return contextData;
    }

    const extraPage = (getContextData()?.extraPages || []).find(page => page.id === pageId);

    return (
        <>
            {/*<SeoHead*/}
            {/*    metaTitle={extraPage.title}*/}
            {/*    metaDesc={extraPage.title}*/}
            {/*/>*/}
            <NavbarLayout noSpace title={extraPage?.title || ""} description={extraPage?.title || ""} contextData={getContextData()}
            >
                {extraPage && extraPage.content &&
                    <div className="text-container" dangerouslySetInnerHTML={{ __html: extraPage.content }} />

                    // <InnerHTML html={extraPage.content} />
                    // <MdRender content = {extraPage.content}/>
                }
                {/*</div>*/}
            </NavbarLayout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {

    return {
        paths: [
            { params: { id: "1" }},
            { params: { id: "2" }},
            { params: { id: "3" }},
        ], //indicates that no page needs be created at build time
        fallback: false //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ProductDetails
