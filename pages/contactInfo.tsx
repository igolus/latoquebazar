import AppLayout from '@component/layout/AppLayout'
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useState} from "react";
import Navbar from "@component/navbar/Navbar";
import {Tab, Tabs} from "@material-ui/core";
import useAuth from "@hook/useAuth";
import EstaInfo from "../src/components/EstaInfo"
import {GetStaticProps} from "next";
import OpenStreetMap from "@component/map/OpenStreetMap";
import SeoHead from "@component/seo/SeoHead";
import localStrings from "../src/localStrings";

// const config = require('../src/conf/config.json')
export interface IndexPageProps {
    contextData?: any
}

const ContactInfoPage:React.FC<IndexPageProps> = ({contextData}) => {
    const {currentEstablishment, getContextDataAuth} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().brand) {
            return getContextDataAuth()
        }
        return contextData;
    }


    function firstOrCurrentEstablishment() {
        if (currentEstablishment()) {
            return currentEstablishment();
        }
        return getContextData().establishments[0];
    }

    const [selectedEsta, setSelectedEsta] = useState(firstOrCurrentEstablishment());

    //const [currentTab, setCurrentTab] = useState(selectedEsta.id);

    const handleTabsChange = (event, value) => {
        let selected = (contextData.establishments || []).find(esta => esta.id === value);
        setSelectedEsta(selected)
    };

    // const buildMap = () => {
    //     return (<OpenStreetMap
    //         styleDiv={{
    //             width: "100%",
    //             height: "300px"
    //         }}
    //         divName={"estaMap"}
    //         selectedId={selectedEsta.id}
    //         lat={selectedEsta.lat}
    //         lng={selectedEsta.lng}
    //         zoom={config.defaultMapZoom || 17}
    //         markers={[
    //             {
    //                 lat: selectedEsta.lat,
    //                 lng: selectedEsta.lng,
    //                 name: selectedEsta.establishmentName,
    //                 id: selectedEsta.id
    //             }
    //         ]}
    //     />)
    // }

    // const config = require("../src/conf/config.json")
    //
    // function getSelectedEsta() {
    //     let (contextData.establishments || []).find(esta => esta.id === sel)
    // }

    // const refDiv = useRef();
    return (
        <>
            <SeoHead
                metaDesc={localStrings.deliveryHourAndPlace}
                metaTitle={localStrings.deliveryHourAndPlaceDesc}
            />

            <AppLayout contextData={contextData} navbar={<Navbar contextData={contextData}/>}>
                {(contextData.establishments || []).length > 1 &&
                <Tabs
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    value={selectedEsta.id}
                    textColor="secondary"
                    variant="scrollable"
                >
                    {(contextData.establishments || []).map((esta, key) =>
                        <Tab key={key}
                             label={esta.establishmentName} value={esta.id} />
                    )}
                </Tabs>
                }

                <EstaInfo selectedEsta={selectedEsta} contextData={contextData}/>

            </AppLayout>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ContactInfoPage
