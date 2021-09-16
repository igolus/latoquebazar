import React from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"
import useAuth from "@hook/useAuth";
import TableRow from "@component/TableRow";
import {H5} from "@component/Typography";
import localStrings from "../localStrings";
import {Box} from "@material-ui/system";
import {Chip, IconButton, Typography} from "@material-ui/core";
import {formatOrderStatus} from "../util/displayUtil";
import moment from "moment";
import East from "@material-ui/icons/East";
import Card1 from "@component/Card1";

const ClosingDayItem = ({slot}) => {
    if (!slot) {
        return (<></>);
    }

    let dateStart = moment.unix(slot.startDate).locale("fr").calendar();
    let dateEnd = moment.unix(slot.endDate).locale("fr").calendar();

    return (<TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
        <Typography className="pre" m={0.75} textAlign="left">
            {localStrings.formatString(localStrings.closingPeriod, dateStart, dateEnd)}
        </Typography>
    </TableRow>);
}

const ClosingDays = ({}) => {
    const {currentEstablishment} = useAuth()
    //const { height, width } = useWindowDimensions();
    const closingSlots = (currentEstablishment()?.serviceSetting?.closingSlots || [])
        .filter(slot => moment.unix(slot.startDate).isAfter());

    return (
        <>
        {/*<p>{JSON.stringify(closingSlots)}</p>*/}
        {closingSlots.length > 0 &&
        <Card1 sx={{mb: '2rem'}}>

            <Typography  variant="h6" fontWeight="600" mb={4}>
                {localStrings.closingDays}
            </Typography>

            {/*<TableRow*/}
            {/*    sx={{*/}
            {/*        display: { xs: 'none', md: 'flex' },*/}
            {/*        padding: '0px 18px',*/}
            {/*        background: 'none',*/}
            {/*    }}*/}
            {/*    elevation={0}*/}
            {/*>*/}
            {/*    <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">*/}
            {/*        {localStrings.closingDays}*/}
            {/*    </H5>*/}
            {/*    /!*<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">*!/*/}
            {/*    /!*    {localStrings.schedules}*!/*/}
            {/*    /!*</H5>*!/*/}

            {/*    /!*<H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>*!/*/}
            {/*</TableRow>*/}

            {
                closingSlots.map((item, key) =>
                    <ClosingDayItem slot={item}/>
                )
            }


        </Card1>
        }
        </>)
}

export default ClosingDays