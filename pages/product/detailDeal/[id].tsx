import NavbarLayout from '@component/layout/NavbarLayout'
import {Box, Tab, Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import DealSelector from '../../../src/components/products/DealSelector'
import useAuth from "@hook/useAuth";
import {getProductsQueryNoApollo} from "../../../src/gqlNoApollo/productGqlNoApollo";
import {getDealsQueryNoApollo} from "../../../src/gqlNoApollo/dealGqlNoApollo";
import localStrings from "../../../src/localStrings";
import ReactMarkdown from "react-markdown";
import {StyledTabs} from "../detail/[id]";

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

    const [selectedOption, setSelectedOption] = useState(0)
    const {getContextDataAuth} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().deals.find(d => d.id === id)) {
            return getContextDataAuth()
        }
        return contextData;
    }

    const router = useRouter();
    const [selectedDeal, setSelectedDeal] = useState(null);
    //const { getContextData } = useAuth()
    const { id } = router.query

    useEffect(() => {
        setSelectedDeal((getContextData() && getContextData().deals) ? getContextData().deals.find(d => d.id === id) : null)
    }, [id])

    const handleOptionClick = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedOption(newValue)
    }

    return (
        <NavbarLayout contextData={getContextData()}>
            {selectedDeal &&
            <DealSelector deal={selectedDeal} contextData={getContextData()}/>
            }

            {selectedDeal && (selectedDeal.description !== "" || selectedDeal.additionalInformation !== "") &&
            <>
                {/*<p>{JSON.stringify(selectedDeal)}</p>*/}
                {/*<p>{selectedDeal.description}</p>*/}
                {/*<p>{selectedDeal.additionalInformation}</p>*/}

                <StyledTabs
                    value={selectedOption}
                    onChange={handleOptionClick}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {selectedDeal.description !== "" &&
                    <Tab className="inner-tab" label={localStrings.description}/>
                    }
                    {selectedDeal.additionalInformation !== "" &&
                    <Tab className="inner-tab" label={localStrings.additionalInformation}/>
                    }
                </StyledTabs>

                <Box mb={6}>
                    {selectedOption === 0 && selectedDeal.description !== "" &&
                    <ReactMarkdown>{selectedDeal.description}</ReactMarkdown>
                    }
                    {selectedOption === (selectedDeal.description !== "" ? 1 : 0)
                    && selectedDeal.additionalInformation !== "" &&
                    <ReactMarkdown>{selectedDeal.additionalInformation}</ReactMarkdown>
                    }
                </Box>
            </>
            }

        </NavbarLayout>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    const config = require("../../../src/conf/config.json")
    const resDeals = await getDealsQueryNoApollo(config.brandId);
    let deals = [];

    if (resDeals && resDeals.getDealsByBrandId) {
        deals = resDeals.getDealsByBrandId;
    }

    let paths = []
    deals.forEach(deal => {
        paths.push({ params: { id: deal.id } })
    })

    return {
        paths: paths, //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default DealDetail
