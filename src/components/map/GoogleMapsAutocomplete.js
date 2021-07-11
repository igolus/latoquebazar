import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { IconButton, Tooltip } from '@material-ui/core';
import localStrings from '../../localStrings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import useAuth from '../../hooks/useAuth';
import {makeStyles} from "@material-ui/styles";
import BazarTextField from "../BazarTextField";

const config = require("../../conf/config.json")

function loadScript(src, position, id) {
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

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function GoogleMapsAutocomplete({title, setValueCallback, initialValue,
                                                 valueSource, setterValueSource, noKeyKnown, ...rest}) {

  const [googleKey, setGoogleKey] = useState('');

  useEffect(() => {
    //setGoogleKey(getGoogleKey());

    if (typeof window !== 'undefined' && !loaded.current) {
      let element = document.querySelector('#google-maps');
      if (!element) {
        loadScript(
          'https://maps.googleapis.com/maps/api/js?key=' + config.googleKey + "&libraries=places",
          document.querySelector('head'),
          'google-maps',
        );
      }
      loaded.current = true;
    }

  },  [])

  const classes = useStyles();
  let [value, setValue] = React.useState(initialValue || '');

  if (valueSource) {
    value = valueSource;
  }
  if (setterValueSource) {
    setValue = setterValueSource;
  }
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

          setOptions(newOptions);
        }
      });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
       <Autocomplete
          id="google-map-demo"
          fullWidth
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
                  console.log(lat, lng);
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
            <BazarTextField {...rest}/>
            // </form>
          )}
          renderOption={(option) => {
            if (!option || !option.structured_formatting) {
              return;
            }
            const matches = option.structured_formatting.main_text_matched_substrings;
            const parts = parse(
              option.structured_formatting.main_text,
              matches.map((match) => [match.offset, match.offset + match.length]),
            );

            return (
              <Grid container alignItems="center">
                <Grid item>
                  <LocationOnIcon className={classes.icon} />
                </Grid>
                <Grid item xs>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
                  ))}

                  <Typography variant="body2" color="textSecondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>


              </Grid>
            );
          }}
        />




  );
}
