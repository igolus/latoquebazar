import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import {overrideCss} from "../util/overrideCss";
import {faShoppingBag} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

function DeliveryMode({icon, title, subtitle, selected, onCLickCallBack}) {
  return (
    <Box
        style={{cursor: "pointer"}}
        border={selected ? 4 : 2}
        borderColor={selected && "primary.main"}
        display="flex" m={2} borderRadius="8px"
        onClick={onCLickCallBack}>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            //minHeight="100vh"
            p={1}
        >
            {/*<Grid container justify="center">*/}
                <FontAwesomeIcon icon={icon} size="3x"/>
            {/*</Grid>*/}
        </Box>
        <Box p={1} flexShrink={1}>
            <Typography variant="h6">
                {title}
            </Typography>
            <Typography>
                {subtitle}
            </Typography>
        </Box>
    </Box>
  );
}

export default DeliveryMode;
