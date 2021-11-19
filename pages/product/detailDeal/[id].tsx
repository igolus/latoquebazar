import NavbarLayout from '@component/layout/NavbarLayout'
import {Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import DealSelector from '../../../src/components/products/DealSelector'
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
    //contextData?: any
}

const ProductDetails:React.FC<ProductDetailsProps> = () => {

    const router = useRouter();
    const [selectedDeal, setSelectedDeal] = useState(null);
    const { getContextData } = useAuth()
    const { id } = router.query

    useEffect(() => {
        setSelectedDeal((getContextData() && getContextData().deals) ? getContextData().deals.find(d => d.id === id) : null)
    }, [id])
    //const { selectedSku } = router.query
    //alert(" ---------------------- selectedSku -------------- " +  contextData.req.url);
    //console.log(" ---------- contextData.req.url " +  JSON.stringify(contextData.url, null, 2));

    //const selectedDeal = (contextData && contextData.deals) ? contextData.deals.find(d => d.id === id) : null;

    return (
        <NavbarLayout contextData={getContextData()}>
            {selectedDeal &&
                <DealSelector deal={selectedDeal} contextData={getContextData()}/>
            }

            {/*{selectedDeal && (selectedDeal.description !== "" || selectedDeal.additionalInformation !== "") &&*/}
            {/*<>*/}
            {/*    <StyledTabs*/}
            {/*        value={selectedOption}*/}
            {/*        onChange={handleOptionClick}*/}
            {/*        indicatorColor="primary"*/}
            {/*        textColor="primary"*/}
            {/*    >*/}
            {/*        {selectedDeal.description !== "" &&*/}
            {/*        <Tab className="inner-tab" label={localStrings.description}/>*/}
            {/*        }*/}
            {/*        {selectedDeal.additionalInformation !== "" &&*/}
            {/*        <Tab className="inner-tab" label={localStrings.additionalInformation}/>*/}
            {/*        }*/}
            {/*    </StyledTabs>*/}

            {/*    <Box mb={6}>*/}
            {/*        {selectedOption === 0 && selectedDeal.description !== "" &&*/}
            {/*            <ReactMarkdown>{selectedDeal.description}</ReactMarkdown>*/}
            {/*        }*/}
            {/*        {selectedOption === (selectedDeal.description !== "" ? 1 : 0)*/}

            {/*        && selectedDeal.additionalInformation !== "" &&*/}
            {/*        <ReactMarkdown>{selectedDeal.additionalInformation}</ReactMarkdown>*/}
            {/*        }*/}
            {/*    </Box>*/}
            {/*</>*/}
            {/*}*/}

            {/*<FrequentlyBought />*/}

            {/*<AvailableShops />*/}

            {/*<RelatedProducts />*/}
        </NavbarLayout>
    )
}

// export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
//     return {
//         paths: [], //indicates that no page needs be created at build time
//         fallback: true //indicates the type of fallback
//     }
//
//     // return getStaticPathsUtil()
// }
//
// export const getStaticProps: GetStaticProps = async (context) => {
//     return await getStaticPropsUtil();
// }

export default ProductDetails
