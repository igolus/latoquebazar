import React, {useEffect, useState} from 'react';
import KRGlue from '@lyracom/embedded-form-glue'
import useAuth from "@hook/useAuth";
import axios from "axios";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import {uuid} from "uuidv4";

const config = require('../../conf/config.json');

const KRPayment = ({text, disabled, errorCallBack, paidCallBack, brandId, email, amount, currency,
                       publicKey, endPoint, checkingPayCallBack}) => {
    //const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const {getOrderInCreation} = useAuth();
    const orderUuid = uuid();
    useEffect(() => {

        let payForm = document.getElementById('myPaymentForm');
        if (payForm) {

            let payButt = document.getElementById('myPaymentForm')
                .getElementsByTagName('button')[0];

            if (payButt) {
                updatePayButtonState(payButt)
                //payButt.style.backgroundColor = disabled ? '#DAE1E7' : '#E3364E'
            }
        }

    }, [text, disabled, document.getElementById('myPaymentForm')])

    function updatePayButtonState(payButt) {
        if (text) {
            payButt.firstElementChild.innerText = text;
        }
        payButt.style.backgroundColor = (disabled ? '#DAE1E7' : '#E3364E');
        payButt.firstElementChild.style.color = (disabled ? '#aca7a7' : '#FFFFFF');
        if (disabled) {
            payButt.hidden = true;
        }
        else {
            payButt.hidden = false;
        }
    }

    useEffect(() => {
        setLoading(true);
        let formToken;
        const urlToken = config.systemPayTokenUrl + "/" + brandId;

        if (amount === 0) {
            return;
        }
        //axios.post(con)
        const dataPay = {
            "amount": Math.round(amount * 100),
            "currency": currency,
            "customer": {
                "email": email
            },
            "orderId": orderUuid
        }

        axios.post(urlToken, dataPay, {
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(resp => {
                formToken = resp.data.token
                return KRGlue.loadLibrary(endPoint, publicKey)
            })
            .then(({ KR }) => {
                    //alert("KR1" + KR)
                    return KR.setFormConfig({
                        /* set the minimal configuration */
                        formToken: formToken,
                        "kr-language": "fr-FR" /* to update initialization parameter */
                    })
                }
            )
            .then(({ KR }) =>

                KR.onSubmit(paymentData => {
                    if (checkingPayCallBack) {
                        checkingPayCallBack();
                    }
                    axios
                        .post(config.systemPayValidatePaymentUrl + "/" + brandId, paymentData)
                        .then(response => {
                            if (response.status === 200 && paidCallBack) {
                                paidCallBack(orderUuid, paymentData.clientAnswer.transactions[0].uuid)
                                //alert("Payment ok !!!")
                            }
                        })
                    return false // Return false to prevent the redirection
                })
            )
            .then(({ KR }) => {
                    //alert("KR2" + KR);
                    if (document.getElementById("myPaymentForm")) {
                        //document.getElementById("paymentSuccessful").style.display = "block";
                        return KR.addForm("#myPaymentForm")
                    }
                    return null;
                }
            ) /* add a payment form  to myPaymentForm div*/
            .then(({ KR, result }) =>
                KR.showForm(result.formId)
            )
            .then(formId => {
                document.getElementById("myPaymentForm")
                    .firstElementChild
                    .style.width = '100%';

                let payButt = document.getElementById('myPaymentForm')
                    .getElementsByTagName('button')[0];
                if (payButt) {
                    //payButt.style.backgroundColor = '#E3364E';
                    payButt.style.width = '100%';
                    //payButt.style.height = '25px';
                    payButt.style.borderRadius = '5px';

                    updatePayButtonState(payButt);
                    setLoading(false);
                }
            })
            .catch(err => {
                errorCallBack(err.message);

                // setMessage(err.message)
                alert(err);
                console.log(err)
            })
        /* show the payment form */

    },  [getOrderInCreation()])


    return (
        <>
                <div className="form">
                    {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
                    {loading &&
                        <ClipLoaderComponent/>
                    }
                    <div className="container">
                        <div id="myPaymentForm"></div>
                    </div>
                </div>
        </>
    )
}

export default KRPayment