import React from 'react';
import TableRow from "@component/TableRow";
import {H5} from "@component/Typography";
import localStrings from "../localStrings";
import {Box} from "@material-ui/system";
import {Typography} from "@material-ui/core";
import {ORDER_DELIVERY_MODE_ON_THE_SPOT} from "../util/constants";

const OpeningHourRow = ({index, daySetting}) => {
    if (!daySetting) {
        return (<></>);
    }
    let day = localStrings.getString("day_" + (index - 1));
    let englishDay = null;
    switch (index) {
        case 1:
            englishDay="monday"
            break;
        case 2:
            englishDay="tuesday"
            break;
        case 3:
            englishDay="wenesday"
            break;
        case 4:
            englishDay="thursday"
            break;
        case 5:
            englishDay="friday"
            break;
        case 6:
            englishDay="monday"
            break;
        case 7:
            englishDay="sunday"
            break;
        default:
            englishDay=null;
    }
    let daySettingCurrent = daySetting.filter(item =>
        item.deliveryMode === ORDER_DELIVERY_MODE_ON_THE_SPOT &&
        item.day === englishDay)

    return (<TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
        <Typography className="pre" m={0.75} textAlign="left">
            {day}
        </Typography>
        <Box m={0.75}>
            {daySettingCurrent.sort((a,b) => b.startHourBooking < a.endHourService ? 1 : -1).map((item, key) =>
                <Typography textAlign="left" key={key}>
                    {(item.startHourBooking || "") + "-" + (item.endHourService || "")}
                </Typography>
            )}
        </Box>

    </TableRow>);
}

const OpeningHours = ({firstEsta}) => {
    // const {currentEstablishment} = useAuth();
    //
    // function firstOrCurrentEstablishment() {
    //     // if (currentEstablishment()) {
    //     //     return currentEstablishment();
    //     // }
    //     return firstEsta;
    // }

    //const { height, width } = useWindowDimensions();
    const daySetting = firstEsta?.serviceSetting?.daySetting;

    return (<>
        {/*<p>{JSON.stringify(daySetting)}</p>*/}
        {/*<h1>{firstEsta.establishmentName}</h1>*/}
        <TableRow
            sx={{
                display: { xs: 'none', md: 'flex' },
                padding: '0px 18px',
                background: 'none',
            }}
            elevation={0}
        >
            <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
                {localStrings.weekDay}
            </H5>
            <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
                {localStrings.schedules}
            </H5>

            {/*<H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>*/}
        </TableRow>

        <OpeningHourRow daySetting={daySetting} index={1}/>
        <OpeningHourRow daySetting={daySetting} index={2}/>
        <OpeningHourRow daySetting={daySetting} index={3}/>
        <OpeningHourRow daySetting={daySetting} index={4}/>
        <OpeningHourRow daySetting={daySetting} index={5}/>
        <OpeningHourRow daySetting={daySetting} index={6}/>
        <OpeningHourRow daySetting={daySetting} index={7}/>


    </>);
}

export default OpeningHours