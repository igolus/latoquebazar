import useAuth from "@hook/useAuth";
import {firstOrCurrentEstablishment, getTextStatus} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import firebase from "../../lib/firebase";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import ShoppingBag from '@material-ui/icons/ShoppingBag'
import {Box, useTheme} from '@material-ui/system'
import {executeQueryUtil} from "../../apolloClient/gqlUtil";
import {establishmentsQuery} from "../../gql/establishmentGql";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {
    BOOKING_SLOT_OCCUPANCY_COLLECTION,
    BRAND_COLLECTION,
    ESTABLISHMENT_COLLECTION,
    ORDER_COLLECTION
} from "../../util/constants";
import config from "../../conf/config.json";
import moment from "moment";
import {Card} from "@material-ui/core";
import {isMobile} from "react-device-detect";
import BazarImage from "@component/BazarImage";
import {H2, H5} from "@component/Typography";
import React from "react";

export interface OrderDetailsProps {
    contextData?: any
}

const OrderAtTableComponent:React.FC<OrderDetailsProps> = ({contextData}) => {
    //let params = {};
    // let tableId;
    // let establishmentId;
    // let params = {};
    // try {
    //     params = new URLSearchParams(window.location.search)
    //     establishmentId = params?.get("establishmentId");
    //     tableId = params?.get("tableId");
    // }
    // catch (err) {
    //
    // }

    const db = firebase.firestore();

    const {currentEstablishment, dbUser, tableId} = useAuth()

    const currentEstablishmentOrFirst = () => {
        return firstOrCurrentEstablishment(currentEstablishment, contextData);
    }

    // function getOrderId() {
    //     try {
    //         params = new URLSearchParams(window.location.search)
    //         id = params?.get("orderId");
    //         return id;
    //     }
    //     catch (error) {
    //         //console.log("error")
    //     }
    //     return "0";
    //     //return "46545";
    // }

    const [orders, loading, error] =
        useCollectionData(
            db.collection(BRAND_COLLECTION)
                .doc(config.brandId)
                .collection(ESTABLISHMENT_COLLECTION)
                .doc(currentEstablishmentOrFirst().id)
                .collection(ORDER_COLLECTION)
                .where('table.id', '==', tableId)
            //.where('endDate', '<=', getEndDateSeconds())
            ,
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            }
        );


    const theme = useTheme()
    console.log(theme.breakpoints.up('md'))

    return (
        <>
            <DashboardPageHeader
                title={localStrings.orderDetail}
                icon={ShoppingBag}
            />
            {!orders || orders.length == 0 &&
                <Card sx={{ p: '.2rem .2rem', mb: '0', ml: 2, mr:2 }}>
                    <div style={{width: '100%'}}>
                            <>
                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Box m={5}>
                                        <BazarImage width={120} height={120} src={"/assets/images/IconsDelivery/Get_box.png"}/>
                                    </Box>
                                </Box>

                                <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                    <Box mt={7}>
                                        <H2 my="0px" lineHeight="1" whiteSpace="pre">
                                            {localStrings.orderStatus}
                                        </H2>
                                        <H5 mt={0} mb={2} mt={2}>
                                            NO ORDER
                                        </H5>
                                    </Box>
                                </Box>
                            </>

                    </div>
                </Card>
            }

            <p>{JSON.stringify(orders || [])}</p>
            <h1>orderAtTable</h1>
            <p>{tableId}</p>
            <p>{currentEstablishment()?.id}</p>
        </>
    )
}

// export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
//     return getStaticPathsUtil()
// }



export default OrderAtTableComponent
