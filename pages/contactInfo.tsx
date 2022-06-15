import AppLayout from '@component/layout/AppLayout'
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useState} from "react";
import Navbar from "@component/navbar/Navbar";
import {Tab, Tabs} from "@material-ui/core";
import useAuth from "@hook/useAuth";
import EstaInfo from "../src/components/EstaInfo"
import {GetStaticProps} from "next";
import localStrings from "../src/localStrings";

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

    const handleTabsChange = (event, value) => {
        let selected = (contextData.establishments || []).find(esta => esta.id === value);
        setSelectedEsta(selected)
    };

    return (
        <>
            <AppLayout contextData={contextData}
                       title={localStrings.deliveryHourAndPlaceDesc}
                       description={localStrings.deliveryHourAndPlaceDesc}
                       navbar={<Navbar contextData={contextData}/>}>
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
