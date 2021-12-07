import {isMobile} from "react-device-detect";
import LazyImage from "../LazyImage";
import {Box} from "@material-ui/core";
import localStrings from "../../localStrings";
import FlexBox from "../FlexBox";
import React from "react";


const EmptyBasket = () => {
    return (<FlexBox
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        //mt="calc(100% - 74px)"
        height={isMobile ? "none" : "calc(100% - 74px)"}
    >
        <LazyImage
            src="/assets/images/logos/shopping-bag.svg"
            width="200px"
            height="100%"
        />
        <Box
            component="p"
            mt={2}
            color="grey.600"
            textAlign="center"
            maxWidth="200px"
        >
            {localStrings.emptyBasket}
        </Box>
    </FlexBox>)
}

export default EmptyBasket
