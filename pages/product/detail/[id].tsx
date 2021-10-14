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

//const config = require('../../../src/conf/config.json');

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData}) => {
    const config = require('../../../src/conf/config.json');
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

    const selectedProduct = (contextData && contextData.products) ? (contextData.products || []).find(p => p.id === productId) : null;

    const [selectedOption, setSelectedOption] = useState(0)

    const handleOptionClick = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedOption(newValue)
    }

    function buildTitle(selectedProduct: any, brandName: string) {
        let ret = "";
        if (selectedProduct?.category?.category) {
            ret+=selectedProduct.category?.category + " > "
        }
        if (selectedProduct?.name) {
            ret+=selectedProduct.name + " ";
        }
        if (selectedProduct?.skus) {
            let prices = (selectedProduct?.skus || []).map(sku => parseInt(sku.price));
            // prices.sort((a,b) => a-b);
            if (prices && prices.length > 0) {
                prices.sort((a,b) => a-b);
                ret+=prices[0].toFixed(2)
                    + " " +
                    getBrandCurrency(contextData ? contextData.brand : null);
            }
        }
        if (brandName) {
            ret+= " | " + brandName;
        }

        if (ret.length === 0) {
            ret = config.appName;
        }
        return ret;
    }

    function buildDescription(selectedProduct: any) {
        return selectedProduct?.shortDescription;
    }

    function buildOgImage(selectedProduct: any) {
        if (selectedProduct?.files && selectedProduct?.files.length > 0) {
            return selectedProduct.files[0].url
        }
        return null;
    }

    return (
        <NavbarLayout contextData={contextData}
                      title={buildTitle(selectedProduct, contextData?.brand?.brandName)}
                      ogImage={buildOgImage(selectedProduct)}
                      description={buildDescription(selectedProduct)}
        >
            {selectedProduct &&
            <ProductIntro product={selectedProduct}
                          faceBookShare={contextData.brand?.config?.socialWebConfig?.enableShareOnFacebookButton}
                          routeToCart={true}
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
