import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {
    Autocomplete,
    Button,
    CircularProgress,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import throttle from 'lodash/throttle';
import localStrings from '../../localStrings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {makeStyles} from "@material-ui/styles";
import BazarTextField from "@component/BazarTextField";
import useAuth from "@hook/useAuth";
import FormControl from "@material-ui/core/FormControl";
import Client from 'getaddress-api'
import BazarButton from "@component/BazarButton";
import {green} from "@material-ui/core/colors";

const config = require("../../conf/config.json")


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
                                                   placeholderArg,
                                                   required, error, helperText, disabled, useTextField,
                                                   borderColor, border, borderRadius, modeUk}) {
    const classes = useStyles();

    const {currentBrand} = useAuth()

    useEffect(() => {
        // if (modeUk) {
        //     return;
        // }
        async function loadMaps() {
            let timer1 = setTimeout(() => {
                if (typeof window !== 'undefined' && !loaded.current) {
                    console.log("load maps !")
                    let element = document.querySelector('#google-maps');
                    if (element) {
                        console.log("load element !");
                        element.setAttribute("src",
                            'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places");
                    }
                    else {
                        console.log("load loadScript !");
                        loadScript(
                            'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places",
                            document.querySelector('head'),
                            'google-maps',
                        );
                    }
                    loaded.current = true;
                }
            }, 500);

            return () => {
                clearTimeout(timer1);
            };

        }    // Execute the created function directly
        loadMaps();
    }, []);

    useEffect(() => {
        //setGoogleKey(getGoogleKey());


    },  [])



    let [value, setValue] = React.useState(initialValue || '');
    //let [value, setValue] = React.useState('TOTO');

    if (valueSource) {
        value = valueSource;
    }
    if (setterValueSource) {
        setValue = setterValueSource;
    }
    const [locked , setLocked] = useState(lockmode != null)
    const [postCode , setpostCode] = useState("");
    const [loadAddresses , setLoadAddresses] = useState(false);
    const [adresssResult , setAdresssResult] = useState([]);
    const [selectedAdressIndex , setSelectedAdressIndex] = useState(null);
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

        if (modeUk) {
            if (window.google) {
                geocoder.current = new window.google.maps.Geocoder();
            }
            return;
        }

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
                componentRestrictions: {country: currentBrand().country || 'fr'},
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
                    //console.log("options ",  JSON.stringify(options, null, 2))
                    setOptions(newOptions);
                }
            });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);


    async function searchAdress() {
        setLoadAddresses(true)
        try {
            if (postCode !== '') {
                const api = new Client("YwHgnjYpQU2x61KmKcHaBA39602");
                const findResult = await api.find(postCode);
                if(findResult.isSuccess)
                {
                    const success = findResult.toSuccess();
                    setAdresssResult(success?.addresses?.addresses);
                    if (success?.addresses?.addresses.length > 0) {
                        setSelectedAdressIndex(null);
                    }
                }
                else {
                    console.log("Unable to load adresses")
                }

            }
        }
        finally {
            setLoadAddresses(false)
        }

    }

    function formatAdress(item) {
        if (!item?.formatted_address) {
            return null;
        }
        return item.formatted_address.filter(v => v !== '').join(' ').trim();
    }

    function handleChangeSelectAdress(event) {

        const formattedAdress = formatAdress(adresssResult[event.target.value]);
        if (!formattedAdress) {
            return
        }

        if (window.google && !geocoder.current) {
            geocoder.current = new window.google.maps.Geocoder();
        }

        setSelectedAdressIndex(event.target.value)
        geocoder.current.geocode({
            'address': formattedAdress
        }, (responses, status) => {
            if (status == 'OK') {
                let lat = responses[0].geometry.location.lat();
                let lng = responses[0].geometry.location.lng();
                let placeId = responses[0].place_id;
                //setValue(formattedAdress);
                if (setValueCallback) {
                    setValueCallback(
                        formattedAdress,
                        placeId,
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


    function isPostCodeCorrect() {
        if (!postCode) {
            return false;
        }
        const postCodeTrim = postCode.trim();
        const regex = new RegExp('([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\\s?[0-9][A-Za-z]{2})');
        return regex.test(postCodeTrim)
    }

    if (modeUk) {
        return (
            <Grid
                container
            >
                {/*<h1>modeUk</h1>*/}
                {/*<p>{postCode}</p>*/}
                {/*<p>{JSON.stringify(adresssResult)}</p>*/}
                <Grid
                    item
                    md={12}
                    xs={12}
                    style={{margin: 0}}
                    border={border}
                    borderColor={borderColor}
                    borderRadius={borderRadius}
                >
                    <Grid item lg={12} xs={12} paddingBottom="15px">
                        <TextField
                            error={!isPostCodeCorrect() }
                            helperText={!isPostCodeCorrect() ? localStrings.check.invalidPostCode : null}
                            label={localStrings.postCode}
                            value={postCode}
                            fullWidth
                            onChange={(e) => setpostCode(e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={12} xs={12} paddingBottom="15px">
                        <Button variant="contained" color="primary" fullWidth
                                onClick={searchAdress}
                                style={{textTransform: "none"}}
                                disabled={!isPostCodeCorrect()}
                                // endIcon={<CircularProgress style={{color: green[500]}} size={30}/>}
                                //endIcon={<h1>TEST</h1>}
                                endIcon={loadAddresses ?
                                    <CircularProgress size={30} style={{color: green[500]}}/> : <></>}
                        >
                            {localStrings.getAddress}
                        </Button>
                    </Grid>

                    {adresssResult && adresssResult.length > 0 &&
                        <Grid item lg={12} xs={12} paddingBottom="15px">
                            <FormControl fullWidth>
                                <InputLabel>{localStrings.selectAddress}</InputLabel>
                                <Select
                                    value={selectedAdressIndex}
                                    placeholder={localStrings.selectAddress}
                                    label={localStrings.selectAddress}
                                    onChange={handleChangeSelectAdress}
                                >
                                    {(adresssResult || []).map((item, key) =>
                                        <MenuItem value={key} key={key}>{formatAdress(item)}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                    }

                </Grid>
            </Grid>
        )
    }

    return (


        <Grid
            container
        >
            <Grid
                item
                md={lockmode ? 11 : 12}
                xs={lockmode ? 11 : 12}
                border={border}
                borderColor={borderColor}
                borderRadius={borderRadius}
            >
                <Autocomplete
                    className={classes.autocomplete}
                    noOptionsText={localStrings.noAdresseFound}
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
                        //console.log("NEW value " + JSON.stringify(newValue, null, 2));
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
                            {useTextField ?
                                <TextField {...params}
                                    //style={{height: "44px"}}
                                    //className={classes.autocomplete}
                                           placeholder={placeholderArg || localStrings.fillAddress}
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
                                                placeholder={placeholderArg || localStrings.fillAddress}
                                                helperText={helperText}
                                                required={required}
                                                autoComplete='off'
                                                label={title}
                                                variant="outlined"
                                                fullWidth/>

                            }


                        </form>
                    )}
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
