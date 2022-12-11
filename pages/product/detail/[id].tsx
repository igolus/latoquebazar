import NavbarLayout from '@component/layout/NavbarLayout'
import ProductIntro from '@component/products/ProductIntro'
import {Box, Tab, Tabs, Typography} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react'
import {GetStaticPaths, GetStaticProps} from "next";
import localStrings from "../../../src/localStrings";
import {getStaticPropsUtil} from "../../../src/nextUtil/propsBuilder";
import {getBrandCurrency} from "../../../src/util/displayUtil";
import {SEP} from "../../../src/util/constants";
import {getCurrentService} from "@component/form/BookingSlots";
import useAuth from "@hook/useAuth";
import {getProductsQueryNoApollo} from "../../../src/gqlNoApollo/productGqlNoApollo";
import {getProductReviewsQueryNoApollo} from "../../../src/gqlNoApollo/productReviewGqlNoApollo";
//const { markdownToTxt } = require('markdown-to-txt');
import markdownToTxt from 'markdown-to-txt';
import ProductReview from "@component/products/ProductReview";

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginTop: 10,
    marginBottom: 10,
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
    productReviews?: any
}

//const config = require('../../../src/conf/config.json');

const ProductDetails:React.FC<ProductDetailsProps> = ({contextData, productReviews}) => {
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
            //console.log("case1")
            return getContextDataAuth()
        }
        //console.log("case2" + contextData.establishments)
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
        else {
            skuIndex = 0;
        }
    }

    const selectedProduct = (getContextData() && getContextData().products) ? (getContextData().products || []).find(p => p.id === productId) : null;

    useEffect(() => {
        if (selectedProduct && selectedProduct.description && selectedProduct.description.trim() !== "") {
            setSelectedOption("description")
        }

    }, [])

    const [selectedOption, setSelectedOption] = useState("allergens" )

    const handleOptionClick = (_event: React.ChangeEvent<{}>, newValue: string) => {
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
            let prices = (selectedProduct?.skus || []).map(sku => parseFloat(sku.price));
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

    function getAllergenIcon(allergen) {

        // gluten: "Gluten",
        //     shellfish: "Crustacés",
        //     egg: "Oeuf",
        //     fishes: "Poissons",
        //     peanuts: "Arachides",
        //     soy: "Soja",
        //     milk: "Lait",
        //     nuts: "Fruits à coques",
        //     celery: "Celeri",
        //     mustard: "Moutarde",
        //     sesameSeeds: "Graines de sésame",
        //     sulfurDioxideSulphites: "Anhydride sulfureux et sulfites",
        //     lupine: "Lupin",
        //     molluscs: "Mollusques"
        const base = "/assets/images/allergensIcons/";
        if (allergen === "gluten") {
            return base + "gluten.svg";
        }
        if (allergen === "shellfish") {
            return base + "crustacean_shellfish.svg";
        }
        if (allergen === "egg") {
            return base + "egg.svg";
        }
        if (allergen === "fishes") {
            return base + "fish.svg";
        }
        if (allergen === "peanuts") {
            return base + "peanuts.svg";
        }
        if (allergen === "soy") {
            return base + "soybeans.svg";
        }
        if (allergen === "milk") {
            return base + "dairy.svg";
        }
        if (allergen === "nuts") {
            return base + "almonds.svg";
        }
        if (allergen === "celery") {
            return base + "celery.svg";
        }
        if (allergen === "mustard") {
            return base + "mustard.svg";
        }
        if (allergen === "sesameSeeds") {
            return base + "sesame.svg";
        }
        if (allergen === "sulfurDioxideSulphites") {
            return base + "sulfate.svg";
        }
        if (allergen === "lupine") {
            return base + "lupins.svg";
        }
        if (allergen === "molluscs") {
            return base + "mollusk.svg";
        }

    }

    function getAllergenDesc() {
        // return (<p>{selectedProduct.allergens}</p>)

        if (!selectedProduct?.allergens || selectedProduct?.allergens.length == 0) {
            return (
                <Typography fontWeight="700" >
                    {localStrings.noAllergens}
                </Typography>
            )
        }

        return (
            <>
                <Typography fontWeight="700">
                    {localStrings.allergensList}
                </Typography>
                <br/>
                <ul>
                    {selectedProduct.allergens.map((allergen, key) =>
                        <li key={key}>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >

                            {/*{localStrings.allergensList[allergen]}*/}
                                <Typography variant="body1" >
                                    {localStrings.allergenTypes[allergen]}
                                </Typography>

                                <img width={"15px"} src={getAllergenIcon(allergen)} style={{marginLeft: "10px"}}/>
                            </Box>
                        </li>
                    )
                    }
                </ul>
            </>
        )
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
                          firstEsta={getContextData()?.establishments[0]}
                          brand={getContextData().brand}
                          currentService={getCurrentService(currentEstablishment(), bookingSlotStartDate, getOrderInCreation()?.deliveryMode)}
                          faceBookShare={getContextData().brand?.config?.socialWebConfig?.enableShareOnFacebookButton}
                          routeToCart={true}
                          skuIndex={skuIndex}
                          options={getContextData().options} currency={getBrandCurrency(getContextData().brand)}/>
            }

            {/*{selectedProduct && (selectedProduct.description !== "" || selectedProduct.additionalInformation !== "") &&*/}
            <>
                {/*<p>{JSON.stringify(selectedProduct || {})}</p>*/}
                <StyledTabs
                    value={selectedOption}
                    onChange={handleOptionClick}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab className="inner-tab" label={localStrings.allergens} value="allergens"/>
                    {selectedProduct?.description.trim() !== "" &&
                    <Tab className="inner-tab" label={localStrings.description} value="description"/>
                    }
                    {selectedProduct?.additionalInformation.trim() !== "" &&
                    <Tab className="inner-tab" label={localStrings.additionalInformation} value="additionalInformation"/>
                    }
                    <Tab className="inner-tab" label={localStrings.reviews} value="reviews"/>
                    {/*ProductReview*/}
                </StyledTabs>

                <Box mb={6}>
                    {selectedOption === "allergens" &&
                    <Box mt={2}>
                        {getAllergenDesc()}
                    </Box>
                    }
                    {selectedOption === "reviews" &&
                    <>
                        <ProductReview productReviews={productReviews} productId={productId}/>
                    </>
                    }
                    {selectedOption === "description" && selectedProduct && selectedProduct.description &&
                    (typeof selectedProduct.description === "string") &&
                    <>
                        <p>{selectedProduct.description}</p>
                        {/*<p>{typeof selectedProduct.description}</p>*/}
                    </>
                        // <MdRender content={selectedProduct.description}/>
                    }
                    {selectedOption=== "additionalInformation" && selectedProduct && selectedProduct.additionalInformation &&
                    (typeof selectedProduct.additionalInformation === "string") &&
                        <p>{selectedProduct.additionalInformation}</p>
                    // <MdRender content={selectedProduct.additionalInformation}/>
                    }

                </Box>
            </>


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
            paths.push({ params: { id: product.id } })
            //paths.push({ params: { id: product.id } })
        }
    })

    return {
        paths: paths, //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params;
    let productId = id;
    const split = id.split("-");
    if (split.length > 1) {
        productId = split[0];
    }
    const config = require("../../../src/conf/config.json")
    const productReviews = await getProductReviewsQueryNoApollo(config.brandId, productId);
    const propsUtil = await getStaticPropsUtil()
    propsUtil.props["productReviews"] = productReviews;
    return propsUtil;

}

export default ProductDetails
