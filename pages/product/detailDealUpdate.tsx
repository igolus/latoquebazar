import NavbarLayout from '@component/layout/NavbarLayout'
import React, {useEffect, useState} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import DealSelector from '../../src/components/products/DealSelector'
import useAuth from "@hook/useAuth";

// const StyledTabs = styled(Tabs)(({ theme }) => ({
//     marginTop: 80,
//     marginBottom: 24,
//     minHeight: 0,
//     borderBottom: `1px solid ${theme.palette.text.disabled}`,
//     '& .inner-tab': {
//         fontWeight: 600,
//         minHeight: 40,
//         textTransform: 'capitalize',
//     },
// }))


export interface ProductDetailsProps {
    contextData?: any
}

const DealDetail:React.FC<ProductDetailsProps> = ({contextData}) => {

    let params = {};
    let uuid;
    try {
        params = new URLSearchParams(window.location.search)
        uuid = params?.get("uuid");
    }
    catch (err) {
        console.log(err);
    }

    const [selectedOption, setSelectedOption] = useState(0)
    const {getContextDataAuth, getOrderInCreation} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().deals.find(d => d.id === uuid)) {
            return getContextDataAuth()
        }
        return contextData;
    }
    const [selectedDeal, setSelectedDeal] = useState(null);
    useEffect(() => {
            //get it from getOrderInCreation
        let dealFromDealList = (getOrderInCreation()?.order?.deals || []).find(d => d.uuid === uuid);
        setSelectedDeal(dealFromDealList)
    }, [uuid])

    return (
        <NavbarLayout contextData={getContextData()}>
            {selectedDeal &&
            <DealSelector deal={selectedDeal} contextData={getContextData()}/>
            }

        </NavbarLayout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default DealDetail
