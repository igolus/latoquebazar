import CarouselCompo from '@component/home-1/CarouselCompo'
import Section10 from '@component/home-1/Section10'
import Section11 from '@component/home-1/Section11'
import Section12 from '@component/home-1/Section12'
import Section13 from '@component/home-1/Section13'
import Section2 from '@component/home-1/Section2'
import Section3 from '@component/home-1/Section3'
import Section4 from '@component/home-1/Section4'
import Section5 from '@component/home-1/Section5'
import Section6 from '@component/home-1/Section6'
import Section7 from '@component/home-1/Section7'
import Section8 from '@component/home-1/Section8'
import Section9 from '@component/home-1/Section9'
import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../src/util/displayUtil";
import React from "react";
import {CartProps} from "./cart";

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
