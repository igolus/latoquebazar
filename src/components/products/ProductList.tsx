import FlexBox from '@component/FlexBox'
import NavbarLayout from '@component/layout/NavbarLayout'
import ProductCard1List from '@component/products/ProductCard1List'
import ProductFilterCard from '@component/products/ProductFilterCard'
import {H5, Paragraph} from '@component/Typography'
import useWindowSize from '@hook/useWindowSize'
import {Card, Grid, MenuItem, Select, TextField} from '@material-ui/core'
import {Box} from '@material-ui/system'
import React, {useCallback, useState} from 'react'
import localStrings from '../../localStrings';
import useAuth from "@hook/useAuth";
import {convertCatName} from "../../util/displayUtil";

export interface ProductList {
    category: string
    contextData: any
}


export const PRICE_ASC = 'PriceAsc';
export const PRICE_DESC = 'PriceDesc';

const ProductList: React.FC<ProductList> = ({category, contextData}) => {
    let params = {};
    let query;
    try {
        params = new URLSearchParams(window.location.search)
        query = params?.get("query");
        //alert("query " + query);
    }
    catch (err) {

    }

    const {getContextDataAuth} = useAuth();

    //const query = params?.get("query");
    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().products) {
            return getContextDataAuth()
        }
        return contextData;
    }

    function buildTitle() {
        let categoryName = category;
        if (category === "all") {
            categoryName = localStrings.allCat;
        }
        return localStrings.formatString(localStrings.categoryTitleDef, getContextData().brand.brandName, categoryName);
    }

    function buildDescription() {
        let categoryName = category;
        if (category === "all") {
            categoryName = localStrings.allCat;
        }
        return localStrings.formatString(localStrings.categoryDescriptionDef, getContextData().brand.brandName, categoryName);
    }

    const [tagsSelected, setTagsSelected] = useState([]);
    const [sortOption, setSortOption] = useState("priceAsc");
    const [view, setView] = useState('grid')
    const [filter, setFilter]  = useState({
        selectedCategory: null,
        selectedTags: [],
    })

    const width = useWindowSize()
    const isTablet = width < 1024

    const toggleView = useCallback(
        (v) => () => {
            setView(v)
        },
        []
    )

    const changeFilter = useCallback(
        (filterValue) => {
            setFilter({...filter,  ...filterValue})
        },
        []
    )

    return (
        <>
            {getContextData() &&
            <NavbarLayout
                title={buildTitle()}
                description={buildDescription()}
                descr
                contextData={getContextData()}>
                {/*<p>PLIST</p>*/}
                <Box pt={2.5}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: '55px',
                            p: {
                                xs: '1.25rem 1.25rem 0.25rem',
                                sm: '1rem 1.25rem',
                                md: '0.5rem 1.25rem',
                            },
                        }}
                        elevation={1}
                    >
                        <div>
                            {query ?
                                <H5>{localStrings.formatString(localStrings.searchResults, query)}</H5>
                                :
                                <H5>{localStrings.ourProducts}</H5>
                            }
                            {/*<Paragraph color="grey.600">48 results found</Paragraph>*/}
                        </div>
                        <FlexBox alignItems="center" flexWrap="wrap" my="0.5rem">
                            <FlexBox alignItems="center" flex="1 1 0">
                                <Paragraph color="grey.600" mr={2} whiteSpace="pre">
                                    {localStrings.sortBy}
                                </Paragraph>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Short by"
                                    select
                                    defaultValue={sortOptions[0].value}
                                    fullWidth
                                    sx={{
                                        flex: '1 1 0',
                                        mr: '1.75rem',
                                        minWidth: '150px',
                                    }}
                                >
                                    {/*<Select*/}
                                    {/*    value={sortOption}*/}
                                    {/*    onChange={(event) => setSortOption(event.target.value)}>*/}
                                    {sortOptions.map((item) => (
                                        <MenuItem value={item.value} key={item.value}
                                                  selected={item.value === sortOption}
                                                  onClick={(event) => {
                                                      setSortOption(item.value)
                                                  }
                                                  }
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                    {/*</Select>*/}
                                </TextField>
                            </FlexBox>

                        </FlexBox>
                    </Card>

                    <Grid container spacing={3}>
                        <Grid
                            item
                            lg={3}
                            xs={12}
                            sx={{
                                '@media only screen and (max-width: 1024px)': {
                                    display: 'none',
                                },
                            }}
                        >
                            {getContextData() &&
                            <ProductFilterCard tags={getContextData().tags}
                                               deals={getContextData().deals}
                                               tagsSelected={tagsSelected} setTagsSelected={setTagsSelected}
                                               products={getContextData().products}
                                               categories={getContextData().categories}/>
                            }
                        </Grid>

                        <Grid item lg={9} xs={12}>
                            <ProductCard1List
                                sortOption={sortOption}
                                filter={filter} query={query}
                                tagsSelected={tagsSelected}
                                category={category} contextData={getContextData()}/>
                        </Grid>
                    </Grid>
                </Box>
            </NavbarLayout>
            }
        </>
    )
}

const sortOptions = [
    { label: localStrings.priceAsc, value: PRICE_ASC },
    { label: localStrings.priceDesc, value: PRICE_DESC },
]

export default ProductList
