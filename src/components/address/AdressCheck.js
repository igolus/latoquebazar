import React, {useEffect, useState} from 'react';
import localStrings from "../../localStrings";
import {Alert, Button, Typography} from "@material-ui/core";
import GoogleMapsAutocomplete from "@component/map/GoogleMapsAutocomplete";
import Card1 from "@component/Card1";
import {formatDuration, getDeliveryDistance, getMaxDistanceDelivery, isDeliveryActive} from "../../util/displayUtil";
import useAuth from "@hook/useAuth";
import Box from "@material-ui/core/Box";

export const DIST_INFO = 'distInfo';

export function setDistanceAndCheck(value, setMaxDistanceReached, setDistanceInfo, currentEstablishment) {
    if (!value) {
        return;
    }
    let maxDist = getMaxDistanceDelivery(currentEstablishment());
    let distKm = value.distance / 1000;
    //alert("distKm " + distKm)
    setMaxDistanceReached(distKm > maxDist)
    setDistanceInfo(value)
}

function AdressCheck({closeCallBack}) {
    const [addressValue, setAddressValue] = useState("");
    const [addressData, setAddressData] = useState({});
    const [distanceInfo, setDistanceInfo] = useState(null);
    const [maxDistanceReached, setMaxDistanceReached] = useState(!localStorage.getItem(DIST_INFO));

    const {currentEstablishment} = useAuth();

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
                        {
                            localStrings.formatString(localStrings.distanceTime,
                                (distanceInfo.distance / 1000),
                                formatDuration(distanceInfo, localStrings))
                        }

                    </Alert>
                </Box>
                }
                <Box p={1}>
                    <GoogleMapsAutocomplete noKeyKnown
                                            required
                                            setterValueSource={setAddressValue}
                                            valueSource={addressValue}
                                            setValueCallback={async (label, placeId, city, postcode, citycode, lat, lng) => {
                                                let dist = await getDeliveryDistance(currentEstablishment(), lat, lng);
                                                setAddressData({
                                                    address: label,
                                                    lat: lat,
                                                    lng: lng,
                                                    placeId: placeId,
                                                })
                                                setDistanceAndCheck(dist,setMaxDistanceReached, setDistanceInfo, currentEstablishment);
                                            }}/>
                </Box>

                <Box p={1}>
                    <Button variant="contained"
                            onClick={() => {
                                localStorage.setItem(DIST_INFO, JSON.stringify(addressData));
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