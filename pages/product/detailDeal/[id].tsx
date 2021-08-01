import NavbarLayout from '@component/layout/NavbarLayout'
import {Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import DealSelector from '../../../src/components/products/DealSelector'

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

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData}) => {

    const router = useRouter();

    const { id } = router.query


    //const { selectedSku } = router.query
    //alert(" ---------------------- selectedSku -------------- " +  contextData.req.url);
    //console.log(" ---------- contextData.req.url " +  JSON.stringify(contextData.url, null, 2));

    const selectedDeal = (contextData && contextData.deals) ? contextData.deals.find(d => d.id === id) : null;

    //const [selectedOption, setSelectedOption] = useState(0)

    // const handleOptionClick = (_event: React.ChangeEvent<{}>, newValue: number) => {
    //     setSelectedOption(newValue)
    // }

    return (
        <NavbarLayout contextData={contextData}>
            {selectedDeal &&
                <DealSelector deal={selectedDeal} contextData={contextData}/>
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

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }

    // return getStaticPathsUtil()
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ProductDetails
