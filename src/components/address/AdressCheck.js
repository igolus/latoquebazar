import React from 'react';
import localStrings from "../../localStrings";
import {getEstablishmentSettings} from "../../util/displayUtil";
import axios from "axios";
import {uuid} from "uuidv4";
import {getMapByGeoPointUrl, stuartApiUrl} from "../../conf/configUtil";
import {getStuartAmountAndRound} from "@component/checkout/CheckoutForm";

const config = require('../../conf/config.json');

export const ACCES_ERROR = "ACCESS_ERROR";
export const OUT_OF_RANGE = "OUT_OF_RANGE";

export async function distanceAndCheck(distanceInfo,
                        currentEstablishment, orderInCreation, brandId, lat, lng, bookingSlot, address, contextData) {



    let ret = {
        maxDistanceReached:false,
        amount: null,
        currency: null,
        error: null,
        charge: null,
        distanceInfo: null,
        zoneMap: null
    }

    let deliveryStuartClientId = getEstablishmentSettings(currentEstablishment(), 'deliveryStuartClientId');
    let deliveryStuartClientSecret = getEstablishmentSettings(currentEstablishment(), 'deliveryStuartClientSecret');
    let deliveryStuartActive = getEstablishmentSettings(currentEstablishment(), 'deliveryStuartActive');

    if (deliveryStuartActive && deliveryStuartClientId && deliveryStuartClientSecret && bookingSlot &&
        bookingSlot?.startDate && bookingSlot?.endDate) {
        const url = stuartApiUrl() + '/jobPricing/' + brandId + '/' + currentEstablishment().id;
        try {
            let res = await axios.post(url, {
                ...orderInCreation,
                bookingSlot: bookingSlot,
                deliveryAddress: {
                    address: address
                }
            });
            if (res.data.error) {
                ret.maxDistanceReached = true;
                ret.error = res.data.error;
                return ret;
            }
            if (res.data.amount) {
                const charge = {
                    id: uuid(),
                    stuart: true,
                    name: localStrings.deliveryFeeExternal,
                    extRef: "",
                    pricingEffect: "fixed_price",
                    pricingValue: getStuartAmountAndRound(res.data.amount.toFixed(2), currentEstablishment, contextData),
                    price: parseFloat(getStuartAmountAndRound(res.data.amount, currentEstablishment, contextData)),
                }

                ret.maxDistanceReached = false;
                ret.amount = res.data.amount.toFixed(2);
                ret.currency = res.data.currency;
                ret.charge = charge;
                return ret;
            }
            ret.maxDistanceReached = false;
            //setMaxDistanceReached(true);
        }
        catch (error) {
            console.log(error);
            ret.error = ACCES_ERROR;
        }
        return ret;
    }
    if (deliveryStuartActive) {
        ret.maxDistanceReached = true;
        return ret;
    }


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
            ret.distanceInfo = zone;
            break;
        }
    }
    distanceInfo.deliveryZoneId = deliveryZoneId

    let res = await axios.get(getMapByGeoPointUrl() + '?brandId='+ brandId
        + '&establishmentId=' + currentEstablishment().id + '&lat=' + lat + '&lng=' + lng);

    if (res.data && res.data.zone) {
        ret.zoneMap = res.data.zone;
        ret.maxDistanceReached = false;
        inZone = true;
    }
    else {
        ret.zoneMap = null;
    }
    ret.maxDistanceReached = !inZone;
    return ret;
}