import React from 'react';
import {Container, Typography} from "@material-ui/core";

import 'leaflet/dist/leaflet.css';
import OpenStreetMap from "@component/map/OpenStreetMap";
import localStrings from "../localStrings";
import {isMobile} from "react-device-detect";
import Card1 from "./Card1";
import OpeningHours from "./OpeningHours";
import ClosingDays from "./ClosingDays";
import {getMarkers} from "@component/SelectEsta";

const config = require("../conf/config.json");

const EstaInfo = ({selectedEsta, contextData}) => {

    return (
        <Container sx={{ mb: '70px' }}>
            {/*<h1>CONTACT INFO TODO</h1>*/}
            {selectedEsta &&
            <Card1 sx={{mb: '2rem', mt: '2rem'}}>
                <Typography variant="h4" fontWeight="600" mb={4}>
                    {selectedEsta.establishmentName}
                </Typography>

                <Typography variant="h6" fontWeight="600" mb={4}>
                    {selectedEsta.address}
                </Typography>
            </Card1>
            }


            <Card1 sx={{mb: '2rem', mt:'2rem' }}>
                <Typography  variant="h6" fontWeight="600" mb={4}>
                    {localStrings.place}
                </Typography>

                <OpenStreetMap
                    styleDiv={{
                        width: "100%",
                        height: "300px"
                    }}
                    //divName={"esta_" + selectedEsta.id}
                    divName={"estaMap"}
                    selectedId={selectedEsta.id}
                    lat={selectedEsta.lat}
                    lng={selectedEsta.lng}
                    zoom={config.defaultMapZoom || 17}
                    markers={getMarkers(contextData)}
                />

            </Card1>

            <Card1 sx={{mb: '2rem'}}>
                <Typography variant="h6" fontWeight="600" mb={4}>
                    {localStrings.openingHours}
                </Typography>
                <OpeningHours firstEsta={selectedEsta}/>
            </Card1>

            <Card1 sx={{mb: '2rem'}}>
                <ClosingDays firstEsta={selectedEsta}/>
            </Card1>

            {/*<GoogleMap widthp={refDiv.current.width}/>*/}
        </Container>
    )
}

export default EstaInfo;
