import axios from "axios";
const config = require('../conf/config.json')

export const postStripePayment = async (useElements, useStripe) => {

    const elements = useElements();
    const stripe = useStripe();

    const { token } = await stripe.createToken()

    const order = await axios.post(config.paymentUrl, {
        amount: "200",
        source: token.id,
        receipt_email: 'igolus@gmail.com'
    })

    if (res && res.data && res.data.rows && res.data.rows.length > 0) {
        //alert(JSON.stringify(res.data.rows[0].elements[0].distance.value))
        let distanceInfo =
            {
                distance: res.data.rows[0].elements[0].distance.value,
                duration: res.data.rows[0].elements[0].duration.value,
            }
        return distanceInfo;
    }
    return null;
}
