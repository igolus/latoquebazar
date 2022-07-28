import React, {useState} from 'react';
import localStrings from "../../localStrings";
import {Alert, Button} from "@material-ui/core";
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import Card1 from "@component/Card1";
import {getDeliveryDistanceWithFetch, getMaxDistanceDelivery, isDeliveryActive} from "../../util/displayUtil";
import useAuth from "@hook/useAuth";
import Box from "@material-ui/core/Box";
import axios from "axios";

export const DIST_INFO = 'distInfo';
const config = require('../../conf/config.json');

export function setDistanceAndCheckNoCall(distanceInfo, setMaxDistanceReached, maxDist, setDistanceInfo) {
    let distKm = distanceInfo.distance / 1000;
    //alert("distKm " + distKm)
    setMaxDistanceReached(distKm > maxDist)
    //alert("setDistanceInfo " + JSON.stringify(distanceInfo))
    setDistanceInfo(distanceInfo)
}

export async function setDistanceAndCheck(distanceInfo, setMaxDistanceReached,
                                    setDistanceInfo, setZoneMap,
                                    currentEstablishment, orderInCreation, setOrderInCreation, brandId, lat, lng) {
    if (!distanceInfo) {
        return;
    }
    let zones = distanceInfo.zones || [];

    let inZone = false;
    let deliveryZoneId;
    for (let i = 0; i < zones.length; i++) {
        const zone = zones[i];
        let distKm = zone.distance / 1000;
        if (distKm <= zone.maxDistance) {
            inZone = true;
            deliveryZoneId = zone.zoneId;
            if (setDistanceInfo) {
                setDistanceInfo(zone);
            }

            break;
        }
    }
    distanceInfo.deliveryZoneId = deliveryZoneId

    let res = await axios.get(config.getMapByGeoPointUrl + '?brandId='+ brandId
        + '&establishmentId=' + currentEstablishment().id + '&lat=' + lat + '&lng=' + lng);

    if (res.data && res.data.zone) {
        setZoneMap(res.data.zone)
        setMaxDistanceReached(false);
        inZone = true;
    }
    else {
        setZoneMap(null)
    }
    setMaxDistanceReached(!inZone);
}

function AdressCheck({closeCallBack}) {
    const [addressValue, setAddressValue] = useState("");
    const [addressData, setAddressData] = useState({});
    const [distanceInfo, setDistanceInfo] = useState(null);
    const [maxDistanceReached, setMaxDistanceReached] = useState(false);

    const {currentEstablishment, getOrderInCreation, setOrderInCreation, setOrderInCreationNoLogic} = useAuth();

    return(
        <>
            {currentEstablishment() &&
            <Card1>
                {/*<p>{JSON.stringify(distanceInfo)}</p>*/}
                <Box p={1}>
                    <Alert severity="info" style={{marginBottom: 2}}>{localStrings.info.checkAddessInfo}</Alert>
                </Box>
                {distanceInfo && isDeliveryActive(currentEstablishment()) &&
                <Box p={1}>
                    <Alert severity={maxDistanceReached ? "warning" : "success"} style={{marginBottom: 2}}>
                        {maxDistanceReached ?
                            localStrings.warningMessage.maxDistanceDelivery : localStrings.warningMessage.maxDistanceDeliveryOk}
                        {/*{*/}
                        {/*    localStrings.formatString(localStrings.distanceOnly,*/}
                        {/*        (distanceInfo.distance / 1000))*/}
                        {/*}*/}

                    </Alert>
                </Box>
                }
                <Box p={1}>
                    <GoogleMapsAutocomplete noKeyKnown
                                            required
                                            setterValueSource={setAddressValue}
                                            valueSource={addressValue}
                                            setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                                //let dist = await getDeliveryDistance(currentEstablishment(), lat, lng);



                                                setAddressData({
                                                    address: label,
                                                    lat: lat,
                                                    lng: lng,
                                                    placeId: placeId,
                                                })

                                                if (currentEstablishment()) {
                                                    let distInfo = await getDeliveryDistanceWithFetch(currentEstablishment(), lat, lng);
                                                    await setDistanceAndCheck(distInfo, setMaxDistanceReached,
                                                        setDistanceInfo, currentEstablishment, getOrderInCreation(), setOrderInCreationNoLogic);
                                                }
                                            }}/>
                </Box>

                <Box p={1}>
                    <Button variant="contained"
                            onClick={() => {
                                //localStorage.setItem(DIST_INFO, JSON.stringify(addressData));
                                if (closeCallBack) {
                                    closeCallBack();
                                }
                            }}
                            color="primary" type="button" fullWidth>
                        {localStrings.validateAdress}
                    </Button>
                </Box>
            </Card1>
            }
        </>
    )
};

export default AdressCheck;