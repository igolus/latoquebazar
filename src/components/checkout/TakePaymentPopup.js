import React, {useEffect, useRef, useState} from 'react';
import {takePaymentIframeUrl} from "../../conf/configUtil";
import axios from "axios";
import ClipLoaderComponent from "@component/ClipLoaderComponent";
import useWindowDimensions from "@hook/useWindowDimensions";


function TakePaymentPopup({brandId, amount, uuidPayment}) {
    const {width, height} = useWindowDimensions();
    const amountNoComma = (amount * 100).toFixed(0)
    const [sourceHtml, setSourceHtml] = useState(null)
    useEffect(() => {
        // Create an scoped async function in the hook
        async function load() {
            let res = await axios.get(`${takePaymentIframeUrl()}/${brandId}/${uuidPayment}/${amountNoComma}`);
            setSourceHtml(res.data);
        }    // Execute the created function directly
        load();
    }, []);


    return (
        <div>
            {/*<p>{isIFrameLoaded ? 'y' : 'n'}</p>*/}
            {/*<p>{brandId}</p>*/}
            {/*<p>{amount}</p>*/}
            {/*<p>{sourceHtml}</p>*/}

            {sourceHtml ?
                <iframe src={sourceHtml}
                        height={height - 63} width="100%"
                ></iframe>
                :
                <ClipLoaderComponent/>
            }
        </div>
    );
}

export default TakePaymentPopup;
