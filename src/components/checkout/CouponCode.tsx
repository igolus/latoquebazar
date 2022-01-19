import Card1 from '@component/Card1'
import {Button, Dialog, DialogActions, DialogContent, Divider, Grid, TextField, Typography} from '@material-ui/core'
import React, {useState} from 'react'
import useAuth from "@hook/useAuth";
import {firstOrCurrentEstablishment} from "../../util/displayUtil";
import {getCouponCodeDiscount} from "../../gql/productDiscountGql";
import localStrings from "../../localStrings";
import {Formik} from "formik";
import {executeQueryUtil} from "../../apolloClient/gqlUtil";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";
import AlertHtmlLocal from "../../components/alert/AlertHtmlLocal";
import {addDiscountToCart} from "../../util/cartUtil";
import {Tiny2} from "@component/Typography";
import ReactMarkdown from "react-markdown";
import MdRender from "@component/MdRender";
import {ALREADY_CONSUMED} from "../../util/constants";

const config = require("../../conf/config.json");

export interface OrderAmountSummaryProps {
    orderSource: any
    contextData: any
}

const useStyles = makeStyles((theme) => ({
    textField: {
        "& .Mui-disabled": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.65)"
        }
    },
    wrapper: {
        //margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
    },
    dialogContent: {
        paddingBottom: '1.25rem',
    },
}));

const CouponCode:React.FC<OrderAmountSummaryProps> = ({orderSource, contextData}) => {

    const {getOrderInCreation, currentBrand, currentEstablishment, setEstanavOpen, dbUser, setLoginDialogOpen,
        setOrderInCreation} = useAuth();
    const [wrongCode, setWrongCode] = useState(null);
    const [invalidReason, setInvalidReason] = useState(null);
    const [couponAlreadyInUse, setCouponAlreadyInUse] = useState(false);
    const classes = useStyles();
    const [couponApplied, setCouponApplied] = React.useState(false);
    const [couponDescription, setCouponDescription] = React.useState(null);
    // function getEsta() {
    //     return firstOrCurrentEstablishment(currentEstablishment, contextData)
    // }
    //
    // const getOrder = () => {
    //     return orderSource || getOrderInCreation();
    // }

    // useEffect(() => {
    //     setPriceDetails(computePriceDetail(getOrder()))
    // }, [getOrderInCreation, orderSource])

    function getInitialValues() {
        return {
            couponCode: '',
        }
    }

    const handleFormSubmit = async (values: any, transactionId: string, uuidvalue: string) => {
        //alert("handleFormSubmit" );
        if (!dbUser) {
            setLoginDialogOpen(true);
        }

        if ((getOrderInCreation().discounts || [])
            .filter(discount => discount.restrictions?.couponCodes && discount.restrictions?.couponCodes.length > 0).length > 0) {
            console.log(JSON.stringify(getOrderInCreation().discounts, null, 2))

            setCouponAlreadyInUse(true);
            return;
        }


        try {
            let res = await executeQueryUtil(getCouponCodeDiscount(currentBrand().id, dbUser?.id, values.couponCode))
            let discount = res?.data?.getCouponCodeDiscount;

            if (!discount) {
                //alert("no discount")
                setWrongCode(values.couponCode);
                return;
            }

            if (!discount.valid) {
                if (discount.invalidReason === ALREADY_CONSUMED) {
                    setInvalidReason(localStrings.invalidCouponConsumed)
                }
                else {
                    setWrongCode(values.couponCode);
                }
                return;
            }

            //alert("res" + JSON.stringify(res.data.getCouponCodeDiscount, null, 2));
            addDiscountToCart(discount, getOrderInCreation, setOrderInCreation);
            setCouponDescription(res.data.getCouponCodeDiscount.description);
            setCouponApplied(true);
        }
        catch (err) {
            alert(err);
        }
    }

    return (
        <div style={{marginTop:10}}>

            <Dialog open={couponApplied} maxWidth="sm"
            >
                <DialogContent className={classes.dialogContent}>
                    <AlertHtmlLocal
                        severity="success"
                        title={localStrings.warning}
                        // content={config.alertOnSelectPickup}
                    >
                        <MdRender content = {couponDescription}/>
                        {/*<Tiny2 color="grey.600">*/}
                        {/*    <ReactMarkdown>{couponDescription}</ReactMarkdown>*/}
                        {/*</Tiny2>*/}

                    </AlertHtmlLocal>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setCouponApplied(false)} color="primary">
                        {localStrings.IUnderstand}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={invalidReason != null} maxWidth="sm"
            >
                <DialogContent className={classes.dialogContent}>
                    <AlertHtmlLocal
                        severity="error"
                        title={localStrings.warning}
                        content={invalidReason}
                    >
                    </AlertHtmlLocal>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setInvalidReason(null)} color="primary">
                        {localStrings.IUnderstand}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={wrongCode != null} maxWidth="sm"
            >
                <DialogContent className={classes.dialogContent}>
                    <AlertHtmlLocal
                        severity="error"
                        title={localStrings.warning}
                        content={localStrings.formatString(localStrings.wrongCouponCode, wrongCode || "")}
                    >
                    </AlertHtmlLocal>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setWrongCode(null)} color="primary">
                        {localStrings.IUnderstand}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={couponAlreadyInUse} maxWidth="sm"
            >
                <DialogContent className={classes.dialogContent}>
                    <AlertHtmlLocal
                        severity="error"
                        title={localStrings.warning}
                        content={localStrings.couponAlreadyInUse}
                    >
                    </AlertHtmlLocal>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setCouponAlreadyInUse(false)} color="primary">
                        {localStrings.IUnderstand}
                    </Button>
                </DialogActions>
            </Dialog>

            <Card1>
                {/*{wrongCode &&*/}
                {/*<DialogContent className={classes.dialogContent}>*/}
                {/*    <AlertHtmlLocal*/}
                {/*        title={localStrings.warning}*/}
                {/*        content={localStrings.formatString(localStrings.wrongCouponCode, wrongCode)}*/}
                {/*    >*/}
                {/*    </AlertHtmlLocal>*/}
                {/*</DialogContent>*/}
                {/*}*/}

                {/*{wrongCode &&*/}
                {/*<DialogContent className={classes.dialogContent}>*/}
                {/*    <AlertHtmlLocal*/}
                {/*        title={localStrings.warning}*/}
                {/*        content={localStrings.formatString(localStrings.wrongCouponCode, wrongCode)}*/}
                {/*    >*/}
                {/*    </AlertHtmlLocal>*/}
                {/*</DialogContent>*/}
                {/*}*/}

                {/*{JSON.stringify(orderSource || getOrderInCreation())}*/}
                <Typography fontWeight="600" mb={1} mt={2}>
                    {localStrings.IHaveACouponCode}
                </Typography>

                <Divider sx={{mb: '1rem'}}/>
                <Formik
                    initialValues={getInitialValues()}
                    //validationSchema={checkoutSchema(bookWithoutAccount)}
                    onSubmit={(values) => handleFormSubmit(values, null, null)}
                >

                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                      }) => (
                        <form onSubmit={handleSubmit}>

                                <Grid container spacing={6}>
                                    <Grid item sm={12} xs={12}>

                                        <TextField
                                            //className={classes.textField}
                                            name="couponCode"
                                            label={localStrings.couponCode}
                                            fullWidth
                                            sx={{mb: '1rem'}}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.couponCode}
                                            error={!!touched.couponCode && !!errors.couponCode}
                                            helperText={touched.couponCode && errors.couponCode}
                                        />
                                        </Grid>


                                </Grid>

                                <Button variant="contained" color="primary" type="submit" fullWidth
                                        //style={{margin: "10px"}}
                                >
                                    {dbUser ? localStrings.applyCouponCode : localStrings.connectApplyCouponCode}
                                </Button>
                        </form>
                    )}
                </Formik>
            </Card1>
        </div>
    )
};

export default CouponCode