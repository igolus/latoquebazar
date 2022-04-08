import FlexBox from '@component/FlexBox'
import {H6, Span} from '@component/Typography'
import {Card, Checkbox, Divider, FormControlLabel,} from '@material-ui/core'
import React from 'react'
import localStrings from "../../localStrings";
import {StyledDashboardNav} from "@component/layout/DashboardStyle";
import {useRouter} from "next/router";
import {ALL_CAT} from "@component/products/ProductCard1List";
import {convertCatName, filterCat} from "../../util/displayUtil";

export type FilterProps = {
    selectedCategory: string
}

export type ProductFilterCardProps = {
    categories: [string],
    products: any,
    deals: any,
    tags: any,
    tagsSelected: any,
    setTagsSelected: any,
}


const ProductFilterCard: React.FC<ProductFilterCardProps> = ({categories, products, deals, tags, tagsSelected, setTagsSelected}) => {
    const { asPath } = useRouter()

    const filteredCat = filterCat(categories, products, deals)
    return (
        <Card sx={{ p: '18px 27px', overflow: 'auto' }} elevation={1}>
            {/*{asPath.split("/").slice(-1)}*/}
            {/*<p>{JSON.stringify(categories || {})}</p>*/}
            {/*<p>{JSON.stringify(filteredCat || {})}</p>*/}
            <H6 mb={1.25}>{localStrings.categories}</H6>
            {/*{tagsSelected && JSON.stringify(tagsSelected)}*/}
            <StyledDashboardNav
                isCurrentPath={asPath.includes(ALL_CAT)}
                href={"/product/shop/all"}
                // key={item.id}
            >
                <FlexBox alignItems="center">
                    <span>{localStrings.allCategories}</span>
                </FlexBox>
                {/*<span>{item.count}</span>*/}
            </StyledDashboardNav>

            {(filteredCat || []).map((item) => {
                    //alert(asPath)
                    return ( <StyledDashboardNav
                            isCurrentPath={decodeURI(convertCatName(asPath.split("/").slice(-1)[0])) === convertCatName(item.category)}
                            // isCurrentPath={asPath === convertCatName(item.category)}
                            href={"/product/shop/" + convertCatName(item.category)}
                            key={item.category}
                        >
                            <FlexBox alignItems="center">
                                <span>{item.category}</span>
                            </FlexBox>
                        </StyledDashboardNav>
                    )
                }
                // <StyledCategory
                //     isSelected={selectedCat === item.id}
                //     title={item.title}
                //     key={item.id}
                //     id={item.id}
                //     sx={{ cursor: 'pointer' }}
                //     onClick={() => {
                //         //alert(callBackFilter)
                //         setSelectedCat(item.id);
                //
                //         if (callBackFilter) {
                //             callBackFilter( { selectedCategory : item.id});
                //         }
                //     }}
                // >
                // </StyledCategory>

            )}

            <Divider sx={{ mt: '18px', mb: '24px' }} />

            {/*<H6 mb={2}>Price Range</H6>*/}
            {/*<FlexBox justifyContent="space-between" alignItems="center">*/}
            {/*    <TextField placeholder="0" type="number" size="small" fullWidth />*/}
            {/*    <H5 color="grey.600" px={1}>*/}
            {/*        -*/}
            {/*    </H5>*/}
            {/*    <TextField placeholder="250" type="number" size="small" fullWidth />*/}
            {/*</FlexBox>*/}

            <Divider sx={{ my: '1.5rem' }} />

            {tags && tags.length > 0 &&
            <H6 mb={2}>{localStrings.tags}</H6>
            }
            {tags.map((tag) => (
                <FormControlLabel
                    control={<Checkbox
                        size="small"
                        color="secondary"
                        onChange={e => {
                            if (e.target.checked) {
                                setTagsSelected([...tagsSelected, tag])
                            }
                            else {
                                setTagsSelected([...tagsSelected].filter(item => item.tag !== tag.tag));
                            }
                        }}
                    />}
                    label={<Span color="inherit">{tag.tag}</Span>}
                    sx={{ display: 'flex' }}
                    key={tag.tag}
                />
            ))}
        </Card>
    )
}

export default ProductFilterCard
