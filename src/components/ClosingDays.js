import React from 'react';
import useAuth from "@hook/useAuth";
import TableRow from "@component/TableRow";
import localStrings from "../localStrings";
import {Typography} from "@material-ui/core";
import moment from "moment";
import Card1 from "@component/Card1";

const ClosingDayItem = ({slot, language}) => {
    if (!slot) {
        return (<></>);
    }

    let dateStart = moment.unix(slot.startDate).locale(language).calendar();
    let dateEnd = moment.unix(slot.endDate).locale(language).calendar();

    return (<TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
        {/*<p>{language}</p>*/}
        <Typography className="pre" m={0.75} textAlign="left">
            {localStrings.formatString(localStrings.closingPeriod, dateStart, dateEnd)}
        </Typography>
    </TableRow>);
}

const ClosingDays = ({firstEsta, language}) => {
    const {currentEstablishment} = useAuth();

    function firstOrCurrentEstablishment() {
        // if (currentEstablishment()) {
        //     return currentEstablishment();
        // }
        return firstEsta;
    }


    //const { height, width } = useWindowDimensions();
    const closingSlots = (firstOrCurrentEstablishment()?.serviceSetting?.closingSlots || [])
        .filter(slot => moment.unix(slot.startDate).isAfter());

    return (
        <>
        {/*<p>{JSON.stringify(closingSlots)}</p>*/}
        {closingSlots.length > 0 &&
        <Card1 sx={{mb: '2rem'}}>

            <Typography  variant="h6" fontWeight="600" mb={4}>
                {localStrings.closingDays}
            </Typography>

            {
                closingSlots.map((item, key) =>
                    <ClosingDayItem slot={item} language={language}/>
                )
            }


        </Card1>
        }
        </>)
}

export default ClosingDays
