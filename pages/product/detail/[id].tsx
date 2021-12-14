import NavbarLayout from '@component/layout/NavbarLayout'
import ProductIntro from '@component/products/ProductIntro'
import {Box, Tab, Tabs} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import ReactMarkdown from "react-markdown";
import localStrings from "../../../src/localStrings";
import {getStaticPathsUtil, getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../../../src/util/displayUtil";
import {SEP} from "../../../src/util/constants";
import {getCurrentService} from "@component/form/BookingSlots";
import useAuth from "@hook/useAuth";
import {getProductsQueryNoApollo} from "../../../src/gqlNoApollo/productGqlNoApollo";
import {config} from "@fortawesome/fontawesome-svg-core";
//const { markdownToTxt } = require('markdown-to-txt');
import markdownToTxt from 'markdown-to-txt';

export const StyledTabs = styled(Tabs)(({ theme }) => ({
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

    const {currentEstablishment, bookingSlotStartDate, getContextDataAuth, getOrderInCreation} = useAuth();


    // const [selectedProduct, setSelectedProduct] = useState(null);

    // useEffect(() => {
    //     const selectedProductFind = (getContextData() && getContextData().products) ? (getContextData().products || []).find(p => p.id === productId) : null;
    //     setSelectedProduct(selectedProductFind)
    // }, [getContextDataAuth()])

    // console.log("process.env.REVALIDATE_DATA_TIME " + process.env.REVALIDATE_DATA_TIME )

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().products.find(p => p.id === id)) {
            return getContextDataAuth()
        }
        return contextData;
    }


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

    const selectedProduct = (getContextData() && getContextData().products) ? (getContextData().products || []).find(p => p.id === productId) : null;

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
                    getBrandCurrency(getContextData() ? getContextData().brand : null);
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
        if (selectedProduct?.shortDescription) {
            return markdownToTxt(selectedProduct?.shortDescription)
        }
        return null;
    }

    function buildOgImage(selectedProduct: any) {
        if (selectedProduct?.files && selectedProduct?.files.length > 0) {
            return selectedProduct.files[0].url
        }
        return null;
    }

    return (
        <NavbarLayout contextData={getContextData()}
                      title={buildTitle(selectedProduct, getContextData()?.brand?.brandName)}
                      ogImage={buildOgImage(selectedProduct)}
                      description={buildDescription(selectedProduct)}
        >
            {/*<p>{JSON.stringify(selectedProduct || {})}</p>*/}

            {selectedProduct &&
            <ProductIntro product={selectedProduct}
                          firstEsta={getContextData().establishments[0]}
                          brand={getContextData().brand}
                          currentService={getCurrentService(currentEstablishment(), bookingSlotStartDate, getOrderInCreation()?.deliveryMode)}
                          faceBookShare={getContextData().brand?.config?.socialWebConfig?.enableShareOnFacebookButton}
                          routeToCart={true}
                          skuIndex={skuIndex}
                          options={getContextData().options} currency={getBrandCurrency(getContextData().brand)}/>
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
    const config = require("../../../src/conf/config.json")
    const resProducts = await getProductsQueryNoApollo(config.brandId);
    let products = [];

    if (resProducts && resProducts.getProductsByBrandId) {
        products = resProducts.getProductsByBrandId;
    }

    let paths = []
    products.forEach(product => {
        if (product.skus && product.skus.length === 1) {
            paths.push({ params: { id: product.id } })
        }
        else if (product.skus && product.skus.length > 1) {
            for (let i = 0; i < product.skus.length; i++) {
                paths.push({ params: { id: product.id + "-" + i } })
            }
            //paths.push({ params: { id: product.id } })
        }
    })

    return {
        paths: paths, //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default ProductDetails
