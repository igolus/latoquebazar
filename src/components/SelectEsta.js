import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, FormControlLabel, IconButton, LinearProgress, Paper, Radio, RadioGroup} from "@material-ui/core";

import 'leaflet/dist/leaflet.css';
import {firstOrCurrentEstablishment, getDistanceWithFetch} from "../util/displayUtil";
import useAuth from "@hook/useAuth";
import OpenStreetMap from "@component/map/OpenStreetMap";
import Grid from "@material-ui/core/Grid";
import {styled} from "@material-ui/styles";
import {deleteItemInCart} from "../util/cartUtil";
import Close from "@material-ui/icons/Close";
import {H2} from "@component/Typography";
import localStrings from "../localStrings";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {cloneDeep} from "@apollo/client/utilities";
import {isMobile} from "react-device-detect";
import BazarButton from "@component/BazarButton";

const config = require("../conf/config.json");

const style = {
    width: "100%",
    height: "300px",
};

export function getMarkers(contextData) {
    return (contextData.establishments || []).map(esta => {
        return (
            {
                lat: esta.lat,
                lng: esta.lng,
                name: esta.establishmentName,
                id: esta.id
            }
        )
    })
}

const SelectEsta = ({contextData, closeCallBack}) => {

    function getEsta() {
        return firstOrCurrentEstablishment(currentEstablishment, contextData)
    }

    const {currentEstablishment, setEstablishment} = useAuth();
    const [selectedId, setSelectedId] = useState(getEsta().id)
    const [selectedIdView, setSelectedIdView] = useState(getEsta().id)
    //firstOrCurrentEstablishment





    async function setClosest() {
        navigator.geolocation.getCurrentPosition(async function(position) {


            let currentLat = position.coords.latitude;
            let currentLng = position.coords.longitude;

            let minDist = 10000000;
            let closestEsta;


            let estaCopy = cloneDeep(contextData.establishments);
            for (let i = 0; i < estaCopy.length; i++) {
                const estaElement = estaCopy[i];
                let dist = await getDistanceWithFetch(currentLat, currentLng, estaElement.lat, estaElement.lng);
                if (dist.distance < minDist) {
                    minDist = dist.distance;
                    closestEsta = estaElement;
                }
            }

            // estaCopy.sort((esta1, esta2) =>
            //     ((esta1.lat - currentLat) ** 2 + (esta1.lng - currentLng) ** 2) -
            //     ((esta2.lat - currentLat) ** 2 + (esta2.lng - currentLng) ** 2)
            // );
            setEstablishment(closestEsta);
            // console.log("Latitude is :", position.coords.latitude);
            // console.log("Longitude is :", position.coords.longitude);
        });
    }

    async function setCurrentEsta(estaId) {
        let estaSelected = (contextData.establishments || []).find(esta => esta.id === estaId);
        if (estaSelected) {
            await setEstablishment(estaSelected);
        }
    }

    return (
        <>
            <Box position="absolute" right=".5rem" top=".5rem" style={{zIndex:999, backgroundColor: "transparent"}}>
                <IconButton
                    size="small"
                    sx={{
                        //padding: '4px',
                        ml: '12px',
                    }}
                    onClick={() => {
                        if (closeCallBack) {
                            closeCallBack();
                        }
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>
            </Box>
            <Grid container>
                {/*<Grid item lg={6} xs={8}>*/}

                {/*</Grid>*/}

                <Grid item lg={6} xs={12} paddingLeft="10px">
                    {/*<Box>*/}
                    <Box display="flex" justifyContent="center" marginTop={1}>
                        <H2>{localStrings.selectEsta}</H2>
                    </Box>

                    <FormControl component="fieldset">
                        {/*<FormLabel component="legend">{localStrings.selectEsta}</FormLabel>*/}
                        <RadioGroup
                            aria-label="estblishment"
                            value={getEsta().id}
                            onChange={(event) => setCurrentEsta(event.target.value)}
                            name="radio-buttons-group"
                        >
                            {(contextData.establishments || []).map((esta, key) =>
                                <FormControlLabel
                                    //onMouseOver={() => setSelectedIdView(esta.id)}
                                    value={esta.id} control={<Radio />} label={esta.establishmentName} />
                            )}
                        </RadioGroup>
                    </FormControl>


                    <BazarButton
                        style={{marginBottom: '3px'}}
                        variant="contained" color="primary" fullWidth
                        onClick={() => setClosest()}
                    >
                        {localStrings.setClosestEsta}
                    </BazarButton>
                    {/*</Box>*/}
                </Grid>
                <Grid item lg={6} xs={12} padding="15px"
                      direction="column"
                      alignItems="center"
                      justify="center"
                >
                    <OpenStreetMap
                        styleDiv={{
                            width: isMobile ? "100%" : "calc(100% - 35px)",
                            height: "300px"
                        }}
                        divName={"topMap"}
                        selectedId={getEsta().id}
                        lat={config.defaultMapLat || getEsta().lat}
                        lng={config.defaultMapLng || getEsta().lng}
                        zoom={config.defaultMapZoom || 17}
                        markers={getMarkers(contextData)}
                    />
                </Grid>
                {/*<Grid item xs={4}>*/}
                {/*    <Item>xs=4</Item>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={4}>*/}
                {/*    <Item>xs=4</Item>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={8}>*/}
                {/*    <Item>xs=8</Item>*/}
                {/*</Grid>*/}
            </Grid>
        </>
    )
}

export default SelectEsta;
