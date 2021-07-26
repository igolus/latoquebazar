import NavbarLayout from '@component/layout/NavbarLayout'
import ProductIntro from '@component/products/ProductIntro'
import {Box, Tab, Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React, {useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import ReactMarkdown from "react-markdown";
import localStrings from "../../../src/localStrings";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../../../src/util/displayUtil";
import {SEP} from "../../../src/util/constants";

const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginTop: 80,
    marginBottom: 24,
    minHeight: 0,
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
    '& .inner-tab': {
        fontWeight: 600,
        minHeight: 40,
        textTransform: 'capitalize',
    },
}))


export interface ProductDetailsProps {
    contextData?: any
}

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData}) => {

    const router = useRouter();

    const { id } = router.query
    let productId = id;
    let skuIndex;
    let split;
    if (id) {

        split = id.split(SEP)
        //alert("split" + split)
        productId = split[0];

        if (split.length > 1) {
            //alert("skuRef" + split[1])
            skuIndex = split[1];
        }
    }


    //const { selectedSku } = router.query
    //alert(" ---------------------- selectedSku -------------- " +  contextData.req.url);
    //console.log(" ---------- contextData.req.url " +  JSON.stringify(contextData.url, null, 2));

    const selectedProduct = (contextData && contextData.products) ? contextData.products.find(p => p.id === productId) : null;

    const [selectedOption, setSelectedOption] = useState(0)

    const handleOptionClick = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedOption(newValue)
    }

    return (
        <NavbarLayout contextData={contextData}>
            {selectedProduct &&
            <ProductIntro product={selectedProduct}
                          skuIndex={skuIndex}
                          options={contextData.options} currency={getBrandCurrency(contextData.brand)}/>
            }

            {selectedProduct && (selectedProduct.description !== "" || selectedProduct.additionalInformation !== "") &&
            <>
                <StyledTabs
                    value={selectedOption}
                    onChange={handleOptionClick}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {selectedProduct.description !== "" &&
                    <Tab className="inner-tab" label={localStrings.description}/>
                    }
                    {selectedProduct.additionalInformation !== "" &&
                    <Tab className="inner-tab" label={localStrings.additionalInformation}/>
                    }
                </StyledTabs>

                <Box mb={6}>
                    {selectedOption === 0 && selectedProduct.description !== "" &&
                        <ReactMarkdown>{selectedProduct.description}</ReactMarkdown>
                    }
                    {selectedOption === (selectedProduct.description !== "" ? 1 : 0)

                    && selectedProduct.additionalInformation !== "" &&
                    <ReactMarkdown>{selectedProduct.additionalInformation}</ReactMarkdown>
                    }
                </Box>
            </>
            }

            {/*<FrequentlyBought />*/}

            {/*<AvailableShops />*/}

            {/*<RelatedProducts />*/}
        </NavbarLayout>
    )
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
    return getStaticPathsUtil()
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ProductDetails
