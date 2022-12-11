import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CircularProgress, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    buttonProgress: {
        color: green[500],
    },
}));

function PresenterSelect({icon, title, subtitle, selected, onCLickCallBack, loading, additionalTexts}) {
    const classes = useStyles();
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
                <FontAwesomeIcon icon={icon} size="3x"/>

            </Box>
            <Box p={1} flexShrink={1}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <Typography>
                    {subtitle}
                </Typography>
                {additionalTexts}
            </Box>
            {loading &&
                <Box
                    display="flex"
                    justifyContent="right"
                    alignItems="right"
                    //minHeight="100vh"
                    p={1}
                >
                    <CircularProgress size={50} className={classes.buttonProgress}/>

                </Box>
            }
        </Box>
    );
}

export default PresenterSelect;
