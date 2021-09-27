import React from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"
import useInView from "react-cool-inview";

import dynamic from "next/dynamic";
//const GoogleMap = dynamic(() => import("../components/Comments"));

const MyMap =  withScriptjs(withGoogleMap((props) => {
    //const { height, width } = useWindowDimensions();
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <div ref={observe}>
            {inView &&
            <GoogleMap
                defaultZoom={14}
                //defaultCenter={{ lat: 43.5929918,   lng: 7.120605599999999 }}
                defaultCenter={{lat: props.lat, lng: props.lng}}
            >
                <Marker
                    //position={{ lat: 43.5929918,   lng: 7.120605599999999 }}
                    position={{lat: props.lat, lng: props.lng}}
                    title={props.name}
                />
            </GoogleMap>
            }
        </div>
    )
}))

export default MyMap