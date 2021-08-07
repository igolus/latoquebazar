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
  return name + " " + price + " " + currency;
}

export function formatName(itemSkuBooking) {
  return itemSkuBooking.productName + " " + itemSkuBooking.name;
}

function ProductSelector({ productAndSku, options,
                           nextCallBack, nextTitle, previousCallBack, canGoPrevious,
                           setterSkuEdit, currency, skuEdit,
                           setterValid,
                           valid}) {

// function ProductSelector({ productAndSku, selectProductCallBack, cancelProductCallBack,
//                            nextCallBack, nextTitle, previousCallBack, canGoPrevious,
//                            setterSkuEdit}) {

  //const [productAndSku, setProductAndSku] = useState(...productAndSkuInit);
  const classes = useStyles();
  //const { orderInCreation, setOrderInCreation, currentBrand, getCurrency} = useAuth();
  //const [options, setOptionsListList] = useState(null);
  //const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Create an scoped async function in the hook
  //   async function load() {
  //     let result = await executeQueryUtil(getOptionsListQuery(currentBrand().id));
  //     setOptionsListList(result.data.getProductOptionListsByBrandId);
  //     setLoading(false)
  //   }    // Execute the created function directly
  //   load();
  // }, []);

  // function addToCart() {
  //   setOrderInCreation({
  //     ...orderInCreation(),
  //     order: {
  //       items: [...orderInCreation().order.items, itemSkuBooking]
  //     }
  //   })
  // }

  useEffect(() => {
    checkValidity();
  }
  , [skuEdit]);

function buildOption(optionList, option) {
  return {
    "option_list_name": optionList.extName,
    "option_list_extRef": optionList.extRef,
    "option_list_internal_name": optionList.name,
    "name": option.extName,
    "ref": option.extRef,
    "price": option.price
  }
}

function handleChangeRadio(optionListComplete, optionList, ref) {
  //alert("options " + value);
  let itemSkuBookingNew = {...productAndSku}
  let other = itemSkuBookingNew.options.filter(option => option.option_list_extRef !== optionList.extRef);
  let optionToSet = optionListComplete.find(optionComplete => optionComplete.ref == ref);

  itemSkuBookingNew.options = [...other, optionToSet];
  setterSkuEdit(itemSkuBookingNew);
}

function handleChangeSelect(optionComplete) {
  let itemSkuBookingNew = {...productAndSku}
  let selected = itemSkuBookingNew.options.find(option => option.ref === optionComplete.ref);
  if (!selected) {
    itemSkuBookingNew.options = [...itemSkuBookingNew.options, optionComplete];
  }
  else {
    let other = itemSkuBookingNew.options.filter(option => option.ref !== optionComplete.ref);
    itemSkuBookingNew.options = [...other];
  }
  setterSkuEdit(itemSkuBookingNew);
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
  let optionListMatching = productAndSku && productAndSku.sku.optionListExtIds ? productAndSku.sku.optionListExtIds.map(optionId => {
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

// function selectProductSku() {
//   if (selectProductCallBack) {
//     selectProductCallBack(getterSkuEdit())
//     setterSkuEdit(null)
//     //getterSkuEdit().options
//   }
// }

function formatTitleOptionList(optionList) {
  return localStrings.formatString(localStrings.optionListWithLimit,
      optionList.name,
      optionList.minValue,
      optionList.maxValue,
      optionList.mandatory ? localStrings.check.required : "",
  ).trim()
}


function getSelector(optionList) {
  if (!optionList.options) {
    return;
  }

  let optionListComplete = optionList.options.map(option => buildOption(optionList, option))
  // alert("optionList.type " + optionList.type)
  // alert("optionList.mandatory " + optionList.mandatory)
  if (optionList.type === OPTION_LIST_SINGLE) {
    return (
        <>
          {/*<p>{JSON.stringify(productAndSku)}</p>*/}
          <FormControl component="fieldset">
            <FormLabel component="legend">{formatTitleOptionList(optionList)}</FormLabel>

            <RadioGroup aria-label="gender"
                        value={getValueRadio(optionList)}
                        onChange={(event) => handleChangeRadio(optionListComplete, optionList, event.target.value)}>

              <Box
                  display="flex"
                  flexWrap="wrap"
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
            <FormLabel component="legend">{formatTitleOptionList(optionList)}</FormLabel>
            <FormGroup>
              <Box
                  display="flex"
                  flexWrap="wrap"
              >

                {optionListComplete.map((optionComplete, key) =>
                    <FormControlLabel style={{marginRight:'20px'}}
                                      control={<Checkbox value={optionComplete}
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
      {/*<p>{JSON.stringify(options)}</p>*/}
      <Box
          // mt={1}
          // mb={1}
      >
        {productAndSku && productAndSku.sku.optionListExtIds && productAndSku.sku.optionListExtIds.map((optionId, key) => {
          let optionListMatching = options
              .find(optionsList => optionsList.extId === optionId)

          //option
          if (optionListMatching) {
            return (
                <Box key={key}
                     mb={1}
                >
                  <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
                    <Typography fontSize="14px" fontWeight="600" lineHeight="1">
                      {optionListMatching.name}
                    </Typography>
                  </Box>
                  {/*<FlexBox justifyContent="space-between" alignItems="flex-end" mb={2} alignContent="flex-end">*/}
                  {/*  <Typography color="grey.600"></Typography>*/}
                  {/*  <FlexBox alignItems="flex-end">*/}
                  {/*    <Typography fontSize="14px" fontWeight="600" lineHeight="1">*/}
                  {/*      {optionListMatching.name}*/}
                  {/*    </Typography>*/}
                  {/*  </FlexBox>*/}
                  {/*</FlexBox>*/}

                  <Divider sx={{ mb: '2px', borderColor: 'grey.300', padding: '0' }} />

                  {/*<p></p>*/}
                  {/*<p>{JSON.stringify(optionListMatching)}</p>*/}
                  {getSelector(optionListMatching)}
                  {/*<p>SELECTOR</p>*/}
                  {/*{JSON.stringify(optionListMatching)}*/}
                </Box>
            )
          }

        })
        }

        {/*<Box*/}
        {/*    p={2}*/}
        {/*    display="flex"*/}
        {/*    justifyContent="flex-end"*/}
        {/*    alignContent="space-around"*/}
        {/*>*/}
        {/*  {cancelProductCallBack &&*/}
        {/*  <Box ml={2}>*/}
        {/*    <Button*/}
        {/*        color="secondary"*/}
        {/*        variant="contained"*/}
        {/*        type="submit"*/}
        {/*        onClick={cancelProductCallBack}*/}
        {/*    >*/}
        {/*      {localStrings.cancel}*/}
        {/*    </Button>*/}
        {/*  </Box>*/}
        {/*  }*/}
        {/*  {selectProductCallBack &&*/}
        {/*  <Box ml={2}>*/}
        {/*    <Button ml={2}*/}
        {/*            color="secondary"*/}
        {/*            variant="contained"*/}
        {/*            type="submit"*/}
        {/*            disabled={!checkValidity()}*/}
        {/*            onClick={selectProductSku}*/}
        {/*    >*/}
        {/*      {getterSkuEdit().selectId ? localStrings.updateProduct : localStrings.selectProduct}*/}
        {/*    </Button>*/}
        {/*  </Box>*/}
        {/*  }*/}

        {/*  {previousCallBack &&*/}
        {/*  <Box ml={2}>*/}
        {/*    <Button ml={2}*/}
        {/*            color="secondary"*/}
        {/*            variant="contained"*/}
        {/*            type="submit"*/}
        {/*            disabled={!canGoPrevious() }*/}
        {/*            onClick={previousCallBack}*/}
        {/*    >*/}
        {/*      {localStrings.previous}*/}
        {/*    </Button>*/}
        {/*  </Box>*/}
        {/*  }*/}
        {/*  {nextCallBack &&*/}
        {/*  <Box ml={2}>*/}
        {/*    <Button ml={2}*/}
        {/*            color="secondary"*/}
        {/*            variant="contained"*/}
        {/*            type="submit"*/}
        {/*            disabled={!checkValidity()}*/}
        {/*            onClick={nextCallBack}*/}
        {/*    >*/}
        {/*      {nextTitle}*/}
        {/*    </Button>*/}
        {/*  </Box>*/}
        {/*  }*/}

        {/*</Box>*/}
      </Box>
    </>
);
}

export default ProductSelector
