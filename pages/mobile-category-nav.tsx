import Header from '@component/header/Header'
import MobileCategoryNavStyle from '@component/mobile-category-nav/MobileCategoryNavStyle'
import MobileNavigationBar from '@component/mobile-navigation/MobileNavigationBar'
import {Box, Typography} from '@material-ui/core'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../src/nextUtil/propsBuilder";
import BazarImage from "@component/BazarImage";
import localStrings from "../src/localStrings";
import {convertCatName, filterCat} from "../src/util/displayUtil";
import SeoHead from "@component/seo/SeoHead";

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
      <>
        <SeoHead
            metaDesc={localStrings.mobileCategory}
            metaTitle={localStrings.mobileCategory}/>

        <MobileCategoryNavStyle>
          <Header className="header" contextData={contextData}/>

          <div className="main-category-holder">

            <Link href={"/product/shop/all"}>
              <Box
                  className="main-category-box"
                  borderLeft="3px solid"
              >
                <BazarImage width={55} height={55} src={"/assets/images/icons/icons8-four-squares-48.png"}/>
                <Typography
                    className="ellipsis"
                    textAlign="center"
                    fontSize="15px"
                    lineHeight="1"
                >
                  {localStrings.allCategories}
                </Typography>
              </Box>
            </Link>


            {/*<p>{JSON.stringify(contextData)}</p>*/}
            {contextData && filterCat(contextData.categories, contextData.products, contextData.deals).map((item) => {

              let icon = "";
              if (item.files && item.files.length > 0) {
                icon = item.files[0].url;
              }

              return (
                  <Link href={"/product/shop/" + convertCatName(item.category)}>
                    <Box
                        className="main-category-box"
                        borderLeft={`${category?.href === item.href ? '3' : '0'}px solid`}
                        key={item.category}
                    >
                      <BazarImage width={55} height={55} src={icon} />
                      <Typography
                          className="ellipsis"
                          textAlign="center"
                          fontSize="15px"
                          lineHeight="1"
                      >
                        {item.category}
                      </Typography>
                    </Box>
                  </Link>
              )})}
          </div>
          <MobileNavigationBar />
        </MobileCategoryNavStyle>
      </>
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
