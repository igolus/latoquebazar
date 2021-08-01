import CarouselCompo from '@component/home-1/CarouselCompo'
import Section10 from '@component/home-1/Section10'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React from "react";

export interface IndexPageProps {
    contextData?: any
}

const IndexPage:React.FC<IndexPageProps> = ({contextData}) => {
  return (
    <AppLayout contextData={contextData}>
      {/*<h1>TOTO IndexPage</h1>*/}
        <CarouselCompo contextData={contextData}/>
      {/*<Section2 />*/}
      {/*<Section3 />*/}
      {/*<Section4 />*/}
      {/*<Section5 />*/}
      {/*<Section13 />*/}
      {/*<Section6 />*/}
      {/*<Section7 />*/}
      {/*<Section8 />*/}
      {/*<Section9 />*/}
      <Section10 />
      {/*<Section11 />*/}
      {/*<Section12 />*/}
    </AppLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default IndexPage
