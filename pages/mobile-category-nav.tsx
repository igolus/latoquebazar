import Accordion from '@component/accordion/Accordion'
import AccordionHeader from '@component/accordion/AccordionHeader'
import Header from '@component/header/Header'
import MobileCategoryImageBox from '@component/mobile-category-nav/MobileCategoryImageBox'
import MobileCategoryNavStyle from '@component/mobile-category-nav/MobileCategoryNavStyle'
import MobileNavigationBar from '@component/mobile-navigation/MobileNavigationBar'
import navigations from '@data/navigations'
import { Box, Divider, Grid, Typography } from '@material-ui/core'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import {IndexPageProps} from "./index";

export interface MobileCategoryNavProps {
  contextData?: any
}

const MobileCategoryNav:React.FC<MobileCategoryNavProps> = ({contextData}) => {
  const [category, setCategory] = useState<any>(null)
  const [suggestedList, setSuggestedList] = useState<any[]>([])
  const [subCategoryList, setSubCategoryList] = useState<any[]>([])

  // const handleCategoryClick = (cat: any) => () => {
  //   let menuData = cat.menuData
  //   if (menuData) {
  //     setSubCategoryList(menuData.categories || menuData)
  //   } else setSubCategoryList([])
  //   setCategory(cat)
  // }

  useEffect(() => {
    setSuggestedList(suggestion)
  }, [])

  return (
    <MobileCategoryNavStyle>
      <Header className="header" contextData={contextData}/>

      <div className="main-category-holder">

        {/*<p>{JSON.stringify(contextData)}</p>*/}
        {contextData && contextData.categories && contextData.categories.map((item) => {

          let icon = "";
          if (item.files && item.files.length > 0) {
            icon = item.files[0].url;
          }

          return (
          <Link href={"/product/shop/" + item.category}>
          <Box
            className="main-category-box"
            borderLeft={`${category?.href === item.href ? '3' : '0'}px solid`}
            //onClick={handleCategoryClick(item)}
            key={item.category}
          >
            {/*<p>ITEM</p>*/}
            <img width={35} alt="Remy Sharp" src={icon}/>
            {/*<item.icon sx={{ fontSize: '28px', mb: '0.5rem' }} />*/}
            <Typography
              className="ellipsis"
              textAlign="center"
              fontSize="11px"
              lineHeight="1"
            >
              {item.category}
            </Typography>
          </Box>
          </Link>
        )})}
      </div>
      {/*<Box className="container">*/}



        {/*<Typography fontWeight="600" fontSize="15px" mb={2}>*/}
        {/*  Recommended Categories*/}
        {/*</Typography>*/}
        {/*<Box mb={4}>*/}
        {/*  <Grid container spacing={3}>*/}
        {/*    {suggestedList.map((item: any, ind: number) => (*/}
        {/*      <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>*/}
        {/*        <Link href="/product/search/423423">*/}
        {/*          <a>*/}
        {/*            <MobileCategoryImageBox {...item} />*/}
        {/*          </a>*/}
        {/*        </Link>*/}
        {/*      </Grid>*/}
        {/*    ))}*/}
        {/*  </Grid>*/}
        {/*</Box>*/}

        {/*{category?.menuComponent === 'MegaMenu1' ? (*/}
        {/*  subCategoryList.map((item, ind) => (*/}
        {/*    <Fragment key={ind}>*/}
        {/*      <Divider />*/}
        {/*      <Accordion>*/}
        {/*        <AccordionHeader px={0} py={1.25}>*/}
        {/*          <Typography fontWeight="600" fontSize="15px">*/}
        {/*            {item.title}*/}
        {/*          </Typography>*/}
        {/*        </AccordionHeader>*/}
        {/*        <Box mb={4} mt={1}>*/}
        {/*          <Grid container spacing={3}>*/}
        {/*            {item.subCategories?.map((item: any, ind: number) => (*/}
        {/*              <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>*/}
        {/*                <Link href="/product/search/423423">*/}
        {/*                  <a>*/}
        {/*                    <MobileCategoryImageBox {...item} />*/}
        {/*                  </a>*/}
        {/*                </Link>*/}
        {/*              </Grid>*/}
        {/*            ))}*/}
        {/*          </Grid>*/}
        {/*        </Box>*/}
        {/*      </Accordion>*/}
        {/*    </Fragment>*/}
        {/*  ))*/}
        {/*) : (*/}
        {/*  <Box mb={4}>*/}
        {/*    <Grid container spacing={3}>*/}
        {/*      {subCategoryList.map((item, ind) => (*/}
        {/*        <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>*/}
        {/*          <Link href="/product/search/423423">*/}
        {/*            <a>*/}
        {/*              <MobileCategoryImageBox {...item} />*/}
        {/*            </a>*/}
        {/*          </Link>*/}
        {/*        </Grid>*/}
        {/*      ))}*/}
        {/*    </Grid>*/}
        {/*  </Box>*/}
        {/*)}*/}
      {/*</Box>*/}

      <MobileNavigationBar />
    </MobileCategoryNavStyle>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await getStaticPropsUtil();
}

const suggestion = [
  {
    title: 'Belt',
    href: '/belt',
    imgUrl: '/assets/images/products/categories/belt.png',
  },
  {
    title: 'Hat',
    href: '/Hat',
    imgUrl: '/assets/images/products/categories/hat.png',
  },
  {
    title: 'Watches',
    href: '/Watches',
    imgUrl: '/assets/images/products/categories/watch.png',
  },
  {
    title: 'Sunglasses',
    href: '/Sunglasses',
    imgUrl: '/assets/images/products/categories/sunglass.png',
  },
  {
    title: 'Sneakers',
    href: '/Sneakers',
    imgUrl: '/assets/images/products/categories/sneaker.png',
  },
  {
    title: 'Sandals',
    href: '/Sandals',
    imgUrl: '/assets/images/products/categories/sandal.png',
  },
  {
    title: 'Formal',
    href: '/Formal',
    imgUrl: '/assets/images/products/categories/shirt.png',
  },
  {
    title: 'Casual',
    href: '/Casual',
    imgUrl: '/assets/images/products/categories/t-shirt.png',
  },
]

export default MobileCategoryNav
