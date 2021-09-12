import AppLayout from '@component/layout/AppLayout'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import React, {useRef} from "react";
import Navbar from "@component/navbar/Navbar";
import {Container, Typography} from "@material-ui/core";
import MyMap from "@component/GoogleMap";
import OpeningHours from "@component/OpeningHours";
import ClosingDays from "@component/ClosingDays";
import useAuth from "@hook/useAuth";
import Card1 from "@component/Card1";
import localStrings from "../src/localStrings";

//const config = require("../src/conf/config.json")
//const config = require("../src/conf/config.json")
export interface IndexPageProps {
    contextData?: any
}

const ContactInfoPage:React.FC<IndexPageProps> = ({contextData}) => {

    const {currentEstablishment} = useAuth();
    const config = require("../src/conf/config.json")
    const refDiv = useRef();
    return (
        <AppLayout contextData={contextData} navbar={<Navbar contextData={contextData}/>}>

            {/*<div style={{width: '100%', height:'600px'}} ref={refDiv}>*/}
                <Container sx={{ mb: '70px' }}>
                    {/*<h1>CONTACT INFO TODO</h1>*/}
                    <Card1 sx={{mb: '2rem', mt:'2rem' }}>
                        <Typography  variant="h6" fontWeight="600" mb={4}>
                            {localStrings.place}
                        </Typography>
                        <MyMap
                            lat={currentEstablishment() ? currentEstablishment().lat : null}
                            lng={currentEstablishment() ? currentEstablishment().lng : null}
                            name={currentEstablishment() ? currentEstablishment().establishmentName : null}
                            googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + config.googleKey + "&libraries=geometry,drawing,places"}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                        />

                    </Card1>

                    <Card1 sx={{mb: '2rem'}}>
                        <Typography variant="h6" fontWeight="600" mb={4}>
                            {localStrings.openingHours}
                        </Typography>
                        <OpeningHours/>
                    </Card1>

                    <Card1 sx={{mb: '2rem'}}>
                        <ClosingDays/>
                    </Card1>

                    {/*<GoogleMap widthp={refDiv.current.width}/>*/}
                </Container>
            {/*</div>*/}
            {/*/!*<CarouselCompo contextData={contextData}/>*!/*/}
            {/*<SectionCategories categories={contextData.categories}/>*/}
            {/*<h1>CONTACT INFO TODO</h1>*/}
            {/*<Container sx={{ mt: '2rem' }}>*/}
            {/*    <div>About</div>*/}
            {/*</Container>*/}
        </AppLayout>

    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ContactInfoPage
