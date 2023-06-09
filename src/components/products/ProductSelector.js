import React, {useEffect} from 'react';
import {Checkbox, Divider, FormControlLabel, FormGroup, RadioGroup, Typography,} from '@material-ui/core';
import Box from '@material-ui/core/Box';
//import ClipLoaderComponent from '../ClipLoaderComponent';
import localStrings from '../../localStrings';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from "@material-ui/styles";
import useAuth from "@hook/useAuth";
import cloneDeep from "clone-deep";
import ClipLoaderComponent from "@component/ClipLoaderComponent";

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

export function displayWithPrice (name, price, currency, optionDisabled, language) {
  let display;
  if (language === 'fr') {
    display = name + " " + parseFloat(price).toFixed(2) + " " + currency;
  }
  else {
    display = name + " " + currency + " " + parseFloat(price).toFixed(2);
  }

  if (optionDisabled) {
    display += " " + localStrings.unavailable;
  }
  return display;
}

export function formatName(itemSkuBooking) {
  return itemSkuBooking.productName + " " + itemSkuBooking.name;
}

function ProductSelector({ productAndSku, options,
                           nextCallBack, nextTitle, previousCallBack, canGoPrevious,
                           setterSkuEdit, currency, skuEdit,
                           setterValid, setterInvalidIds,
                           valid, lineNumber, initialItem, language}) {

  const classes = useStyles();
  const {dealEdit, currentEstablishment, getContextDataAuth} = useAuth();
  //const [initialItemState, setInitialItem] = useState(null);

  useEffect(() => {
    if (initialItem) {
      //productAndSku = cloneDeep(productAndSku)
      productAndSku.options = [...initialItem.options]
      //setterSkuEdit({...productAndSku, options:[...initialItem.options]})
    }
  }, [])


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
      "option_list_extRef": optionList.extId || optionList.extRef,
      "option_list_internal_name": optionList.name,
      "name": option.name || option.extName,
      "ref": option.extRef,
      "price": option.price,
      "defaultSelected": option.defaultSelected,
      "noSelectOption": option.noSelectOption,
      "unavailableInEstablishmentIds": option.unavailableInEstablishmentIds
    }
  }

  function getNewSkuBooking() {
    return {...productAndSku};
  }

  function handleChangeRadio(optionListComplete, optionList, ref, noCallSetter) {
    //alert("options " + value);
    let itemSkuBookingNew = getNewSkuBooking()
    let other = itemSkuBookingNew.options.filter(option => option.option_list_extRef !== optionList.extRef
        && option.option_list_extRef !== optionList.extId);
    let optionToSet = optionListComplete.find(optionComplete => optionComplete.ref == ref);
    if (!optionToSet) {
      return;
    }
    itemSkuBookingNew.options = [...other, optionToSet];
    if (!noCallSetter) {
      setterSkuEdit(itemSkuBookingNew);
    }
    return itemSkuBookingNew;
  }

  function handleChangeSelect(optionComplete, noCallSetter, itemSkuBooking) {
    let itemSkuBookingNew = itemSkuBooking || getNewSkuBooking()
    let selected = itemSkuBookingNew.options.find(option => option.ref === optionComplete.ref);
    if (!selected) {
      itemSkuBookingNew.options = [...itemSkuBookingNew.options, optionComplete];
    }
    else {
      let other = itemSkuBookingNew.options.filter(option => option.ref !== optionComplete.ref);
      itemSkuBookingNew.options = [...other];
    }
    if (!optionComplete.noSelectOption) {
      itemSkuBookingNew.options = itemSkuBookingNew.options.filter(o => !o.noSelectOption ||
          optionComplete.option_list_extRef != o.option_list_extRef);
    }
    else {
      itemSkuBookingNew.options  = itemSkuBookingNew.options.filter(o => o.noSelectOption ||
          optionComplete.option_list_extRef != o.option_list_extRef);
    }
    if (!noCallSetter) {
      setterSkuEdit(itemSkuBookingNew);
    }
    //return skuEdit.options.find(o => o.noSelectOption);

    return itemSkuBookingNew;

  }

  function getValueRadio(optionList) {
    let option = productAndSku.options.find(option => option.option_list_extRef === optionList.extRef ||
        option.option_list_extRef === optionList.extId);
    return option ? option.ref : null;
  }

  function isCheckSelect(optionComplete) {
    return productAndSku && productAndSku.options && productAndSku.options.find(option => option.ref === optionComplete.ref) != null;
  }

  function checkQuantity(optionList, optionComplete) {
    if (optionList.maxValue === -1) {
      return true;
    }

    let countSelect = productAndSku.options.filter(option => option.option_list_extRef === (optionList.extRef || optionList.extId)).length;
    return isCheckSelect(optionComplete) || countSelect < optionList.maxValue;
  }

  function checkValidity() {

    let invalidsIds = [];
    setterInvalidIds([])
    let valid = true;
    let optionListMatching = productAndSku && productAndSku.sku && productAndSku.sku.optionListExtIds ? productAndSku.sku.optionListExtIds.map(optionId => {
      return options
          .find(optionsList => optionsList.extId === optionId)
    }).filter(element => element !== undefined) : []

    //alert("optionListMatching " + JSON.stringify(optionListMatching))
    optionListMatching.forEach(optionList => {
      //let optionValid = true;
      let countSelect = productAndSku.options.filter(option => optionList.options.map(o => o.extRef).includes(option.ref)).length;
      //let countSelect = productAndSku.options.filter(option => option.ref === optionList.extId).length;
      if (optionList.mandatory) {
        let optionValid1 = countSelect>0;
        valid &= optionValid1;
        if (!optionValid1) {
          invalidsIds.push(optionList.id)
        }
      }

      let optionValid2 = countSelect >= optionList.minValue;
      if (!optionValid2) {
        invalidsIds.push(optionList.id)
      }
      valid &= optionValid2
      if (optionList.maxValue != -1) {
        let optionValid3 = countSelect <= optionList.maxValue;
        if (!optionValid3) {
          invalidsIds.push(optionList.id)
        }
        valid &= optionValid3;
      }
    })

    //alert("isValid " + valid)
    setterValid(valid)
    setterInvalidIds(invalidsIds)
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

      let optionListComplete = (optionList.options || []).map(option => buildOption(optionList, option));
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
      }

    })
    if (skuBooking) {
      setterSkuEdit(skuBooking)
    }


  }

  function optionDisabled(optionComplete) {
    return currentEstablishment() && (optionComplete.unavailableInEstablishmentIds || []).includes(currentEstablishment().id);
  }

  function noSelectOptionSelected(optionComplete) {
    if (optionComplete.noSelectOption) {
      return true;
    }
    return skuEdit.options.find(o => o.noSelectOption) == null;
  }

  function getSelector(optionList) {
    if (!optionList.options) {
      return;
    }

    let optionListComplete = optionList.options.map(option => buildOption(optionList, option))

    if (!getContextDataAuth()) {
      return <ClipLoaderComponent/>
    }

    if (optionList.type === OPTION_LIST_SINGLE) {
      return (
          <>
            <div id= {"selector" + optionList.id}>
              {/*<p>{"selector" + optionList.id}</p>*/}
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender"
                            value={getValueRadio(optionList)}
                            onChange={(event) => handleChangeRadio(optionListComplete, optionList, event.target.value)}>

                  <Box
                      display="flex"
                      flexDirection="column"
                  >
                    {optionListComplete.map((optionComplete, key) =>
                        <>
                          <FormControlLabel  style={{marginRight:'20px'}} key={key} value={optionComplete.ref} control={<Radio disabled={optionDisabled(optionComplete)}/>}
                                             label={displayWithPrice(optionComplete.name, optionComplete.price, currency, optionDisabled(optionComplete), language)} />
                        </>
                    )}
                  </Box>
                </RadioGroup>

              </FormControl>
            </div>
          </>
      )
    }
    else  {



      //if (optionList.type === OPTION_LIST_MULTIPLE) {
      return (
          <>
            <div id= {"selector" + optionList.id}>

              <FormControl component="fieldset" >
                <FormGroup>
                  <Box
                      display="flex"
                      flexDirection="column"
                  >

                    {optionListComplete.map((optionComplete, key) =>
                        <>
                          {/*<p>{JSON.stringify(optionComplete)}</p>*/}
                          <FormControlLabel style={{marginRight:'20px'}}
                                            control={<Checkbox value={optionComplete}
                                                //defaultChecked={optionComplete.defaultSelected}
                                                               disabled={optionDisabled(optionComplete) || !checkQuantity(optionList, optionComplete)}
                                                               checked={isCheckSelect(optionComplete)}
                                                               onChange={(event) => handleChangeSelect(optionComplete)} />}
                                            label={displayWithPrice(optionComplete.name, optionComplete.price, currency, optionDisabled(optionComplete), language)}
                          />
                        </>
                    )}
                  </Box>
                </FormGroup>
              </FormControl>
            </div>
          </>
      )
      //}
    }
  }

  return (
      <>
        {/*<p>{JSON.stringify(productAndSku)}</p>*/}
        <Box
        >
          {productAndSku && productAndSku.sku && productAndSku?.sku?.optionListExtIds && productAndSku?.sku?.optionListExtIds.map((optionId, key) => {
            let optionListMatching = options
                .find(optionsList => optionsList.extId === optionId)

            //option
            if (optionListMatching) {
              return (
                  <div id= {"selector" + optionListMatching.id}>
                    {/*<p>{"selector" + optionListMatching.id}</p>*/}
                    <Box key={key}
                         mb={1}
                    >
                      <Box display="flex" flexDirection="column" p={1} m={1}>
                        <Typography fontSize="14px" fontWeight="600" lineHeight="1">
                          {formatTitleOptionList(optionListMatching)}
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: '2px', borderColor: 'grey.300', padding: '0' }} />
                      {getSelector(optionListMatching)}
                    </Box>
                  </div>
              )
            }
          })
          }
        </Box>
      </>
  );
}

export default ProductSelector
