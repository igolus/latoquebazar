import React, {useEffect} from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  RadioGroup, Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
//import ClipLoaderComponent from '../ClipLoaderComponent';
import localStrings from '../../localStrings';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {makeStyles} from "@material-ui/styles";
import FlexBox from "@component/FlexBox";
import useAuth from "@hook/useAuth";

export const OPTION_LIST_SINGLE = "single";
export const OPTION_LIST_MULTIPLE = "multiple";

const useStyles = makeStyles((theme) => ({
  cardContent: {
    marginBottom: 0,
    paddingBottom: 0,

  },
  cardRoot: {
    marginBottom: 2,
    paddingBottom: 0,
  },
  cardAction: {
    paddingBottom: 0,
    paddingTop: 0,
    display: "flex",
    justifyContent: "flex-end",
  },
  boxSelect: {
    minWidth: "200px"
  }
}));

export function displayWithPrice (name, price, currency) {
  return name + " " + parseFloat(price).toFixed(2) + " " + currency;
}

export function formatName(itemSkuBooking) {
  return itemSkuBooking.productName + " " + itemSkuBooking.name;
}

function ProductSelector({ productAndSku, options,
                           nextCallBack, nextTitle, previousCallBack, canGoPrevious,
                           setterSkuEdit, currency, skuEdit,
                           setterValid,
                           valid, lineNumber}) {
  const classes = useStyles();
  const {dealEdit} = useAuth();



  useEffect(() => {
        checkValidity();
      }
      , [skuEdit]);

  useEffect(() => {
        initSelection();
      }
      , []);

  function buildOption(optionList, option) {
    return {
      "option_list_name": optionList.extName,
      "option_list_extRef": optionList.extRef,
      "option_list_internal_name": optionList.name,
      "name": option.name || option.extName,
      "ref": option.extRef,
      "price": option.price,
      "defaultSelected": option.defaultSelected
    }
  }

  function handleChangeRadio(optionListComplete, optionList, ref, noCallSetter) {
    //alert("options " + value);
    let itemSkuBookingNew = {...productAndSku}
    let other = itemSkuBookingNew.options.filter(option => option.option_list_extRef !== optionList.extRef);
    let optionToSet = optionListComplete.find(optionComplete => optionComplete.ref == ref);

    itemSkuBookingNew.options = [...other, optionToSet];
    if (!noCallSetter) {
      setterSkuEdit(itemSkuBookingNew);
    }
    return itemSkuBookingNew;
  }

  function handleChangeSelect(optionComplete, noCallSetter, itemSkuBooking) {
    let itemSkuBookingNew = itemSkuBooking || {...productAndSku}
    let selected = itemSkuBookingNew.options.find(option => option.ref === optionComplete.ref);
    if (!selected) {
      itemSkuBookingNew.options = [...itemSkuBookingNew.options, optionComplete];
    }
    else {
      let other = itemSkuBookingNew.options.filter(option => option.ref !== optionComplete.ref);
      itemSkuBookingNew.options = [...other];
    }
    if (!noCallSetter) {
      setterSkuEdit(itemSkuBookingNew);
    }
    return itemSkuBookingNew;

  }

  function getValueRadio(optionList) {
    let option = productAndSku.options.find(option => option.option_list_extRef === optionList.extRef);
    return option ? option.ref : null;
  }

  function isCheckSelect(optionComplete) {
    return productAndSku && productAndSku.options && productAndSku.options.find(option => option.ref === optionComplete.ref) != null;
  }

  function checkQuantity(optionList, optionComplete) {
    if (optionList.maxValue === -1) {
      return true;
    }
    let countSelect = productAndSku.options.filter(option => option.option_list_extRef === optionList.extRef).length;
    return isCheckSelect(optionComplete) || countSelect < optionList.maxValue;
  }

  function checkValidity() {


    let valid = true;
    let optionListMatching = productAndSku && productAndSku.sku && productAndSku.sku.optionListExtIds ? productAndSku.sku.optionListExtIds.map(optionId => {
      return options
          .find(optionsList => optionsList.extId === optionId)
    }).filter(element => element !== undefined) : []

    //alert("optionListMatching " + JSON.stringify(optionListMatching))
    optionListMatching.forEach(optionList => {
      let countSelect = productAndSku.options.filter(option => option.option_list_extRef === optionList.extRef).length;
      if (optionList.mandatory) {
        valid &= countSelect>0;
      }
      valid &= countSelect >= optionList.minValue;
      if (optionList.maxValue != -1) {
        valid &= countSelect <= optionList.maxValue;
      }
    })

    //alert("isValid " + valid)
    setterValid(valid)
  }

  function formatTitleOptionList(optionList) {
    if ((!optionList.minValue || optionList.minValue ===0)
        && (!optionList.maxValue || optionList.maxValue ===-1) ) {
      return localStrings.formatString(localStrings.optionListWithLimit,
          optionList.name,
          optionList.mandatory ? localStrings.mandatorySelection : "",
      ).trim()
    }

    if (!optionList.minValue || optionList.minValue ===0) {
      return localStrings.formatString(localStrings.optionListWithLimitMax,
          optionList.name,
          optionList.maxValue,
          optionList.mandatory ? localStrings.check.mandatorySelection : "",
      ).trim()
    }

    if (!optionList.maxValue || optionList.maxValue ===-1) {
      return localStrings.formatString(localStrings.optionListWithLimitMin,
          optionList.name,
          optionList.minValue,
          optionList.mandatory ? localStrings.mandatorySelection : "",
      ).trim()
    }

    return localStrings.formatString(localStrings.optionListWithLimitMinMax,
        optionList.name,
        optionList.minValue,
        optionList.maxValue,
        optionList.mandatory ? localStrings.mandatorySelection : "",
    ).trim()
  }

  function initSelection() {
    let skuBooking;
    if (!productAndSku.sku) {
      return;
    }
    productAndSku.sku.optionListExtIds.forEach(optionId => {
      let optionList = options
          .find(optionsList => optionsList.extId === optionId)

      let optionListComplete = optionList.options.map(option => buildOption(optionList, option));
      if (optionList.type === OPTION_LIST_SINGLE) {
        let fistDefault = optionListComplete.find(option => option.defaultSelected);
        //alert("fistDefault " + fistDefault)
        if (fistDefault) {
          skuBooking = handleChangeRadio(optionListComplete, optionList, fistDefault.ref)
        }
      }
      else {

        let defaultSelectedList = optionListComplete.filter(option => option.defaultSelected);
        //alert("defaultSelectedList " + JSON.stringify(defaultSelectedList))

        if (defaultSelectedList && defaultSelectedList.length > 0) {
          defaultSelectedList.forEach(option => {
            //alert("handleChangeSelect " + JSON.stringify(option))
            skuBooking = handleChangeSelect(option, true, skuBooking)
          })

        }
        //
        // let fistDefault = optionListComplete.find(option => option.defaultSelected);
        // alert("fistDefault " + fistDefault)
        // if (fistDefault) {
        //   handleChangeRadio(optionListComplete, optionList, fistDefault.ref)
        // }
      }

    })
    if (skuBooking) {
      setterSkuEdit(skuBooking)
    }


  }

  function getSelector(optionList) {
    if (!optionList.options) {
      return;
    }

    let optionListComplete = optionList.options.map(option => buildOption(optionList, option))

    if (optionList.type === OPTION_LIST_SINGLE) {
      // let fistDefault = optionListComplete.find(option => option.defaultSelected);
      // alert("fistDefault " + fistDefault)
      // if (fistDefault) {
      //   handleChangeRadio(optionListComplete, optionList, fistDefault.ref)
      // }

      return (
          <>
            {/*<p>{JSON.stringify(optionList)}</p>*/}
            <FormControl component="fieldset">
              {/*<FormLabel component="legend">{formatTitleOptionList(optionList)}</FormLabel>*/}

              <RadioGroup aria-label="gender"
                          value={getValueRadio(optionList)}
                          onChange={(event) => handleChangeRadio(optionListComplete, optionList, event.target.value)}>

                <Box
                    display="flex"
                    flexDirection="column"
                >
                  {optionListComplete.map((optionComplete, key) =>
                      <FormControlLabel  style={{marginRight:'20px'}} key={key} value={optionComplete.ref} control={<Radio />}
                                         label={displayWithPrice(optionComplete.name, optionComplete.price, currency)} />
                  )}
                </Box>
              </RadioGroup>

            </FormControl>
          </>
      )
    }
    else  {



      //if (optionList.type === OPTION_LIST_MULTIPLE) {
      return (
          <>
            <FormControl component="fieldset" >
              {/*<p>{JSON.stringify(options)}</p>*/}
              {/*<p>{JSON.stringify(optionList)}</p>*/}
              {/*<FormLabel component="legend">{formatTitleOptionList(optionList)}</FormLabel>*/}
              <FormGroup>
                <Box
                    display="flex"
                    flexDirection="column"
                >

                  {optionListComplete.map((optionComplete, key) =>
                      <FormControlLabel style={{marginRight:'20px'}}
                                        control={<Checkbox value={optionComplete}
                                            //defaultChecked={optionComplete.defaultSelected}
                                                           disabled={!checkQuantity(optionList, optionComplete)}
                                                           checked={isCheckSelect(optionComplete)}
                                                           onChange={(event) => handleChangeSelect(optionComplete)} />}
                                        label={displayWithPrice(optionComplete.name, optionComplete.price, currency)}
                      />
                  )}
                </Box>
              </FormGroup>
            </FormControl>
            {/*<Divider/>*/}
          </>
      )
      //}
    }
  }

  return (
      <>
        {/*productAndSku*/}
        {/*<p>{JSON.stringify(options)}</p>*/}
        {/*<p>{JSON.stringify(productAndSku)}</p>*/}
        {/*<p>{JSON.stringify(dealEdit || {})}</p>*/}
        <Box
            // mt={1}
            // mb={1}
        >
          {productAndSku && productAndSku.sku && productAndSku?.sku?.optionListExtIds && productAndSku?.sku?.optionListExtIds.map((optionId, key) => {
            let optionListMatching = options
                .find(optionsList => optionsList.extId === optionId)

            //option
            if (optionListMatching) {
              return (
                  <Box key={key}
                       mb={1}
                  >
                    {/*{JSON.stringify(optionListMatching || {})}*/}
                    <Box display="flex" flexDirection="column" p={1} m={1}>
                      <Typography fontSize="14px" fontWeight="600" lineHeight="1">
                        {formatTitleOptionList(optionListMatching)}
                        {/*{optionListMatching.name}*/}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: '2px', borderColor: 'grey.300', padding: '0' }} />
                    {getSelector(optionListMatching)}
                  </Box>
              )
            }

          })
          }

        </Box>
      </>
  );
}

export default ProductSelector
