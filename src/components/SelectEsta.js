import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, Typography} from "@material-ui/core";

import 'leaflet/dist/leaflet.css';
import {getDistanceWithFetch} from "../util/displayUtil";
import useAuth from "@hook/useAuth";
import OpenStreetMap from "@component/map/OpenStreetMap";
import Grid from "@material-ui/core/Grid";
import Close from "@material-ui/icons/Close";
import {H2} from "@component/Typography";
import localStrings from "../localStrings";
import {cloneDeep} from "@apollo/client/utilities";
import {faBuilding} from "@fortawesome/free-solid-svg-icons";
import {ORDER_DELIVERY_MODE_DELIVERY, ORDER_DELIVERY_MODE_PICKUP_ON_SPOT} from "../util/constants";
import PresenterSelect from "@component/PresenterSelect";
import moment from "moment";
import {green} from "@material-ui/core/colors";

const config = require("../conf/config.json");

const style = {
    width: "100%",
    height: "300px",
};

export function getMarkers(contextData) {
    return (contextData?.establishments || []).map(esta => {
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
    const [selectedEstaId, setSelectedEstaId] = useState(null);
    const [loadingClosest, setLoadingClosest] = useState(false);

    function getEsta() {
        return currentEstablishment();
    }

    const {currentEstablishment, setEstablishment} = useAuth();


    useEffect(() => {
            if (currentEstablishment()) {
                setSelectedEstaId(currentEstablishment().id)
            }
        },
        [currentEstablishment()]);

    async function setClosest() {
        setLoadingClosest(true);
        try {
            navigator.geolocation.getCurrentPosition(async function (position) {
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
                setSelectedEstaId(closestEsta.id)
                await setEstablishment(closestEsta);
                closeTimeout(closestEsta);
                setLoadingClosest(false);
            });
        }
        catch (err) {
            console.log(err);
        }

    }

    function closeTimeout (esta) {
        setTimeout(() => {
            closeCallBack(esta);
        }, "1500")
    }

    async function setCurrentEsta(estaId) {
        let estaSelected = (contextData?.establishments || []).find(esta => esta.id === estaId);
        if (estaSelected) {
            await setEstablishment(estaSelected);
            setSelectedEstaId(estaSelected.id);
            closeTimeout(estaSelected);
        }
    }

    function formatMultiHours(settingsOfDay) {
        let ret = "";
        for (let i = 0; i < settingsOfDay.length; i++) {
            const settingsOfDayElement = settingsOfDay[i];
            ret += settingsOfDayElement.startHourBooking + "-" + settingsOfDayElement.endHourService;
            if (i<settingsOfDay.length -1) {
                ret += " / "
            }
        }
        return ret;
    }

    function getOpenTextArray(esta) {
        let openText = []
        const day = moment().format('dddd').toLowerCase();
        let settingsOfDayDelivery = esta?.serviceSetting?.daySetting?.filter(ds => ds.day == day
            && ds.deliveryMode === ORDER_DELIVERY_MODE_DELIVERY);
        if (settingsOfDayDelivery && settingsOfDayDelivery.length > 0) {
            openText.push(
                <Typography>
                    <strong>{localStrings.delivery + ": "}</strong>{formatMultiHours(settingsOfDayDelivery)}
                </Typography>
            )
        }


        let settingsOfDayPickup = esta?.serviceSetting?.daySetting?.filter(ds => ds.day == day
            && ds.deliveryMode === ORDER_DELIVERY_MODE_PICKUP_ON_SPOT);
        if (settingsOfDayPickup && settingsOfDayPickup.length > 0) {
            openText.push(
                <Typography>
                    <strong>{localStrings.pickupOnSpot + ": "}</strong>{formatMultiHours(settingsOfDayPickup)}
                </Typography>
            )
        }

        if ((!settingsOfDayPickup || settingsOfDayPickup.length == 0) &&
            (!settingsOfDayDelivery || settingsOfDayDelivery.length == 0)) {
            openText.push(
                <Typography>
                    <strong>{localStrings.noSlotToday}</strong>
                </Typography>
            )
        }
        return openText;
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
                <Grid item lg={12} xs={12} padding="15px">
                    {/*<Box>*/}
                    <Box display="flex" justifyContent="center" marginTop={1}>
                        <H2>{localStrings.selectEsta}</H2>
                    </Box>

                    {(contextData?.establishments || []).map((esta, key) =>
                        <PresenterSelect
                            icon={faBuilding}
                            title={esta.establishmentName}
                            subtitle={esta.address}
                            selected={selectedEstaId == esta.id}
                            additionalTexts={getOpenTextArray(esta)}
                            onCLickCallBack={() => setCurrentEsta(esta.id)}
                        />
                    )}

                    {/*<BazarButton*/}

                    {/*</Box>*/}
                </Grid>

                <Grid item lg={12} xs={12} padding="15px">
                    <Button
                        //style={{textTransform: "none"}}
                        style={{textTransform: "none", marginBottom: '3px', paddingLeft:"15px", paddingRight:"25px"}}
                        variant="contained" color="primary" fullWidth
                        onClick={() => setClosest()}
                        endIcon={loadingClosest ?
                            <CircularProgress size={30} style={{color: green[500]}}/> : <></>}
                    >
                        {localStrings.setClosestEsta}
                    </Button>
                </Grid>

                {/*<p>{JSON.stringify(currentEstablishment() || {})}</p>*/}
                {/*<p>{JSON.stringify(currentEstablishment() || {})}</p>*/}
                <Grid item lg={12} xs={12} padding="15px"
                      direction="column"
                      alignItems="center"
                      justify="center"
                >
                    <OpenStreetMap
                        styleDiv={{
                            width: "100%",
                            height: "300px"
                        }}
                        divName={"topMap"}
                        selectedId={getEsta()?.id}
                        lat={config.defaultMapLat || getEsta()?.lat}
                        lng={config.defaultMapLng || getEsta()?.lng}
                        zoom={config.defaultMapZoom || 17}
                        markers={getMarkers(contextData)}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default SelectEsta;
