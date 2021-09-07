import React from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"


const MyMap =  withScriptjs(withGoogleMap((props) => {
    //const { height, width } = useWindowDimensions();

    return (
        <GoogleMap
            defaultZoom={14}
            //defaultCenter={{ lat: 43.5929918,   lng: 7.120605599999999 }}
            defaultCenter={{ lat: props.lat,   lng: props.lng }}
        >
            <Marker
                //position={{ lat: 43.5929918,   lng: 7.120605599999999 }}
                position={{ lat: props.lat,   lng: props.lng }}
                title={props.name}
            />
        </GoogleMap>
    )
}))

export default MyMap