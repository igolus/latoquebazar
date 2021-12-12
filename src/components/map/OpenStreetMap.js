    import React, {useEffect, useRef, useState} from 'react';
    import {Box, LinearProgress} from "@material-ui/core";

    import 'leaflet/dist/leaflet.css';
    import {isMobile} from "react-device-detect";

    const style = {
        // width:"100%",
        // width: isMobile ? "100%" : "calc(100% - 35px)",
        height: "300px",
    };

    const config = require('../../conf/config.json');

    const OpenStreetMap = ({zoom, lat, lng, markers, selectedId, selectedIdNav, styleDiv, divName}) => {

        // useEffect(() => {
        //         navigator.geolocation.getCurrentPosition(function(position) {
        //             console.log("Latitude is :", position.coords.latitude);
        //             console.log("Longitude is :", position.coords.longitude);
        //         });
        //     },
        //     []);
        const getSelectedLoc = () => {
            let marker = markers.find(item => item.id === selectedId);
            if (marker) {
                return [marker.lat, marker.lng];
            }
            return null;
        }


        const mapRef = useRef(null);
        const [markerItems, setMarkerItems] = useState([]);
        useEffect(() => {
                let markerItem = markerItems.find(item => item.id === selectedId);
                if (markerItem) {
                    mapRef.current.flyTo(markerItem.marker.getLatLng(), zoom)
                }
            },
            [selectedId, markers]);


        useEffect(() => {
            //if (cabinet.latitude && cabinet.longitude) {
            try {
                const latSet = getSelectedLoc();

                const L = require("leaflet");

                const markerIcon = L.icon({
                    iconUrl: "/assets/images/marker-icon.png",
                    shadowUrl: "/assets/images/marker-shadow.png",
                });

                mapRef.current = L.map(divName).setView(latSet || [lat, lng], zoom);
                const allMarkers = [];

                (markers || []).forEach(marker => {
                    const markerItem = L.marker([marker.lat, marker.lng], {icon: markerIcon}).addTo(mapRef.current)
                        .bindPopup(marker.name)
                        .on('click', () => {
                            //alert("onClick")
                            mapRef.current.flyTo([marker.lat, marker.lng], zoom)
                        });

                    // markerItem.onClick= (() => {
                    //     alert("onClick")
                    //     mapRef.current.flyTo(markerItem.getLatLng(), zoom)
                    // });
                    allMarkers.push({
                        id: marker.id,
                        marker: markerItem,
                    });
                })

                setMarkerItems(allMarkers);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href={config.siteUrl}>OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);
            }
            catch (err) {
                console.log(err);
            }

            // L.marker([cabinet.latitude, cabinet.longitude], {icon: markerIcon}).addTo(mapRef.current)
            //     .bindPopup(cabinet.name)
            //     .openPopup();

        }, [selectedId]);

        return (
            <div id={divName} style={styleDiv}/>
        );
    }

    export default OpenStreetMap;
