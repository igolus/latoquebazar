import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { IconButton, Tooltip } from '@material-ui/core';
import localStrings from '../../localStrings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import useAuth from '../../hooks/useAuth';
import {makeStyles, withStyles} from "@material-ui/styles";
import BazarTextField from "@component/BazarTextField";
import {MuiThemeProps} from "@theme/theme";
import {layoutConstant} from "../../util/constants";

const config = require("../../conf/config.json")

// const DarkerDisabledAutoComplete = withStyles({
//     root: {
//         marginRight: 8,
//         "& .MuiInputBase-root.Mui-disabled": {
//             color: "rgba(0, 0, 0, 0.6)" // (default alpha is 0.38)
//         }
//     }
// })(Autocomplete);



export function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };
const geocoder = { current: null };

const useStyles = makeStyles(() => ({
    icon: {
        //color: theme.palette.text.secondary,
        //marginRight: theme.spacing(2),
    },
    autocomplete: {
        height: "none",
        "& .Mui-disabled": {
            //color: "rgba(0, 0, 0, 0.6)", // (default alpha is 0.38)
            WebkitTextFillColor: "rgba(0, 0, 0, 0.8)"
            //
            // -webkit-text-fill-color
        }
    },
}));

export default function GoogleMapsAutocomplete({title, setValueCallback, initialValue, lockmode,
                                                   valueSource, setterValueSource, noKeyKnown,
                                                   required, error, helperText, disabled, useTextField}) {
    const classes = useStyles();
    const [googleKey, setGoogleKey] = useState('');
    const {getGoogleKey, brand} = useAuth();

    useEffect(() => {
        //setGoogleKey(getGoogleKey());

        if (typeof window !== 'undefined' && !loaded.current) {
            let element = document.querySelector('#google-maps');
            if (element) {
                element.setAttribute("src",
                    'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places");
            }
            else {
                loadScript(
                    'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places",
                    document.querySelector('head'),
                    'google-maps',
                );
            }
            loaded.current = true;
        }

    },  [brand])
    let [value, setValue] = React.useState(initialValue || '');
    //let [value, setValue] = React.useState('TOTO');

    if (valueSource) {
        value = valueSource;
    }
    if (setterValueSource) {
        setValue = setterValueSource;
    }
    const [locked , setLocked] = useState(lockmode != null)
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);



    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                if (autocompleteService && autocompleteService.current) {
                    autocompleteService.current.getPlacePredictions(request, callback);
                }

            }, 200),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (autocompleteService && !autocompleteService.current && !geocoder.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            geocoder.current = new window.google.maps.Geocoder();
        }
        if (!autocompleteService && !autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch(
            {
                input: inputValue,
                componentRestrictions: {country: 'fr'},
            },
            (results) => {
                if (active) {
                    let newOptions = [];

                    if (value) {
                        newOptions = [value];
                    }

                    if (results) {
                        console.log(JSON.stringify(results, null, 2))
                        newOptions = [...newOptions, ...results];
                    }
                    console.log("options ",  JSON.stringify(options, null, 2))
                    setOptions(newOptions);
                }
            });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (


        <Grid
            container
        >
            <Grid
                item
                md={lockmode ? 11 : 12}
                xs={lockmode ? 11 : 12}
            >
                {/*<p>{JSON.stringify(options)}</p>*/}


                <Autocomplete
                    className={classes.autocomplete}
                    disabled={locked || disabled}
                    id="google-map-demo"
                    fullWidth
                    //style={{ marginBottom: '1rem' }}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    value={value}

                    onChange={(event, newValue) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                        console.log("NEW value " + JSON.stringify(newValue, null, 2));
                        if (newValue && newValue.place_id) {
                            geocoder.current.geocode({
                                'placeId': newValue.place_id
                            }, (responses, status) => {
                                if (status == 'OK') {
                                    let lat = responses[0].geometry.location.lat();
                                    let lng = responses[0].geometry.location.lng();

                                    if (setValueCallback) {
                                        setValueCallback(
                                            newValue.description,
                                            newValue.place_id,
                                            null,
                                            null,
                                            null,
                                            lat,
                                            lng
                                        )
                                    }
                                    //console.log(lat, lng);
                                }
                            })
                        }
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    inputProps={{
                        autocomplete: 'new-password',
                    }}

                    renderInput={(params) => (
                        // <form noValidate>
                        <form autocomplete="off">

                            {/*<TextField*/}
                            {/*    name="phone"*/}
                            {/*    label={localStrings.phone}*/}
                            {/*    fullWidth*/}
                            {/*    onBlur={handleBlur}*/}
                            {/*    onChange={handleChange}*/}
                            {/*    value={values.phone || ''}*/}
                            {/*    error={!!touched.phone && !!errors.phone}*/}
                            {/*    helperText={touched.phone && errors.phone}*/}
                            {/*/>*/}
                            {useTextField ?
                                <TextField {...params}
                                    //style={{height: "44px"}}
                                    //className={classes.autocomplete}
                                           error={error}
                                           helperText={helperText}
                                           required={required}
                                           autoComplete='off'
                                           label={title}
                                    //variant="outlined"
                                           fullWidth/>
                                :
                                <BazarTextField {...params}
                                    //style={{height: "44px"}}
                                    //className={classes.autocomplete}
                                           error={error}
                                           helperText={helperText}
                                           required={required}
                                           autoComplete='off'
                                           label={title}
                                           variant="outlined"
                                           fullWidth/>

                            }


                        </form>
                    )}
                    //     renderOption={(option) => {
                    //         if (!option || !option.structured_formatting) {
                    //             return;
                    //         }
                    //         const matches = option.structured_formatting.main_text_matched_substrings;
                    //         const parts = parse(
                    //             option.structured_formatting.main_text,
                    //             matches.map((match) => [match.offset, match.offset + match.length]),
                    //         );
                    //
                    //         return (
                    //             <Grid container alignItems="center">
                    //                 <Grid item>
                    //                     <LocationOnIcon className={classes.icon} />
                    //                 </Grid>
                    //                 <Grid item xs>
                    //                     {parts.map((part, index) => (
                    //                         <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    //   {part.text}
                    // </span>
                    //                     ))}
                    //
                    //                     <Typography variant="body2" color="textSecondary">
                    //                         {option.structured_formatting.secondary_text}
                    //                     </Typography>
                    //                 </Grid>
                    //
                    //
                    //             </Grid>
                    //         );
                    //     }}
                />



            </Grid>

            {lockmode &&
            <Grid
                item
                md={1}
                xs={1}
            >

                <Tooltip title={locked ? localStrings.unlock : localStrings.lock}>
                    <IconButton aria-label="delete" onClick={() => setLocked(!locked)}>
                        <LockOpenIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Grid>
            }
        </Grid>
    );
}
