import FlexBox from '@component/FlexBox'
import {H6, Span} from '@component/Typography'
import {Card, Checkbox, Divider, FormControlLabel,} from '@material-ui/core'
import React, {useState} from 'react'
import localStrings from "../../localStrings";
import {StyledDashboardNav} from "@component/layout/DashboardStyle";
import {useRouter} from "next/router";
import {ALL_CAT} from "@component/products/ProductCard1List";
import {filterCat} from "../../util/displayUtil";

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
            {/*<p>{JSON.stringify(deals || {})}</p>*/}
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
            {/*{haveDeals &&*/}
            {/*    <StyledDashboardNav*/}
            {/*        isCurrentPath={asPath.includes(localStrings.deals)}*/}
            {/*        href={"/product/shop/" + localStrings.deals}*/}
            {/*    >*/}
            {/*        <FlexBox alignItems="center">*/}
            {/*            <span>{localStrings.deals}</span>*/}
            {/*        </FlexBox>*/}
            {/*    </StyledDashboardNav>*/}
            {/*}*/}


            {(filteredCat || []).map((item) => {
                    //alert(asPath)
                    return ( <StyledDashboardNav
                            isCurrentPath={asPath.includes(encodeURI(item.category))}
                            href={"/product/shop/" + item.category}
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

            <H6 mb={2}>{localStrings.tags}</H6>
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

            {/*<Divider sx={{ my: '1.5rem' }} />*/}

            {/*{otherOptions.map((item) => (*/}
            {/*    <FormControlLabel*/}
            {/*        control={<Checkbox size="small" color="secondary" />}*/}
            {/*        label={<Span color="inherit">{item}</Span>}*/}
            {/*        sx={{ display: 'flex' }}*/}
            {/*        key={item}*/}
            {/*    />*/}
            {/*))}*/}

            {/*<Divider sx={{ my: '1.5rem' }} />*/}

            {/*<H6 mb={2}>Ratings</H6>*/}
            {/*{[5, 4, 3, 2, 1].map((item) => (*/}
            {/*    <FormControlLabel*/}
            {/*        control={<Checkbox size="small" color="secondary" />}*/}
            {/*        label={<Rating size="small" value={item} color="warn" readOnly />}*/}
            {/*        sx={{ display: 'flex' }}*/}
            {/*        key={item}*/}
            {/*    />*/}
            {/*))}*/}

            {/*<Divider sx={{ my: '1.5rem' }} />*/}

            {/*<H6 mb={2}>Colors</H6>*/}
            {/*<FlexBox mb={2}>*/}
            {/*    {colorList.map((item) => (*/}
            {/*        <Box*/}
            {/*            sx={{*/}
            {/*                bgcolor: item,*/}
            {/*                height: '25px',*/}
            {/*                width: '25px',*/}
            {/*                mr: '10px',*/}
            {/*                borderRadius: 300,*/}
            {/*                cursor: 'pointer',*/}
            {/*            }}*/}
            {/*            key={item}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</FlexBox>*/}
        </Card>
    )
}

const categoryList = [
    // {
    //     id:0,
    //     title: 'Bath Preparations',
    //     subCategories: ['Bubble Bath', 'Bath Capsules', 'Others'],
    // },
    {
        id:"electronics",
        title: 'electronics',
    },
    {
        id:"automotive",
        title: 'automotive',
    },
    {
        id:"fashion",
        title: 'fashion',
    },
    {
        id:"groceries",
        title: 'groceries',
    },
    {
        id:"music",
        title: 'music',
    },
]

const brandList = ['Maccs', 'Karts', 'Baars', 'Bukks', 'Luasis']
const otherOptions = ['On Sale', 'In Stock', 'Featured']
const colorList = ['#1C1C1C', '#FF7A7A', '#FFC672', '#84FFB5', '#70F6FF', '#6B7AFF']

export default ProductFilterCard
