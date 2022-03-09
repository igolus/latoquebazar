import Light from '@component/icons/Light'
import useWindowSize from '@hook/useWindowSize'
import {Box} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import Carousel from '../carousel/Carousel'
import CategorySectionCreator from '../CategorySectionCreator'
import ProductCard1 from '@component/product-cards/ProductCard1'
import DealCard1 from "@component/product-cards/DealCard1";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";
import {getBrandCurrency} from "../../util/displayUtil";
import Category from "@component/icons/Category";
import Food from "@component/icons/Food";
import localStrings from "../../localStrings";

export interface Section2Props {
  contextData?: any
}

const Section2:React.FC<Section2Props> = ({contextData}) => {
  const starWebProductIds = contextData?.brand?.config?.starWebProducts;
  const [visibleSlides, setVisibleSlides] = useState(4)
  const width = useWindowSize()
  const [productDisplay, setProductDisplay] = React.useState([]);



  const getProductsAndDeals = () => {
    return contextData.products.concat(contextData.deals)
    //return contextData.products;
  }

  useEffect( () => {
    //let filteredProduct = [];
    let productsLoaded = contextData ? (getProductsAndDeals() || []) : [];
    setProductDisplay(productsLoaded.filter(item => starWebProductIds.includes(item.id)) );

  }, [contextData])

  useEffect(() => {
    if (width < 500) setVisibleSlides(1)
    else if (width < 650) setVisibleSlides(2)
    else if (width < 950) setVisibleSlides(3)
    else setVisibleSlides(4)
  }, [width])

  return (
      <Box mt={2}>
        <CategorySectionCreator

            icon={<Food color="primary" />}
            title={localStrings.starProducts}
            seeMoreLink="/product/shop/all"
            seeMoreTitle={localStrings.viewAllCat}
        >
          {/*<p>{productDisplay?.length}</p>*/}
          <Box mt={2} mb={-0.5}>
            <Carousel
                totalSlides={productDisplay.length}
                visibleSlides={visibleSlides}
                showArrow={productDisplay.length > visibleSlides}
                infinite={true}
            >
              {productDisplay.map((item, ind) => {

                let url = "/assets/images/Icon_Sandwich.png";

                if (item.files && item.files.length > 0) {
                  url = item.files[0].url;
                }

                let itemShop = {
                  id: item.id,
                  imgUrl: url,
                  title: item.name,
                  price: 200,
                  hoverEffect: true
                }

                return(


                    //{productList.map((item, ind) => {
                    // (
                    <Box py={0.5} key={ind}>
                      {/*<p>{JSON.stringify(item)}</p>*/}
                      {item.type === TYPE_PRODUCT &&
                      <ProductCard1
                          {...itemShop}
                          brand={contextData.brand}
                          product={item}
                          options={contextData.options}
                          currency={getBrandCurrency(contextData.brand)}/>
                      }
                      {item.type === TYPE_DEAL &&
                      <DealCard1
                          {...itemShop}
                          deal={item}
                          options={contextData.options}
                          currency={getBrandCurrency(contextData.brand)}/>
                      }
                      {/*<ProductCard1*/}
                      {/*  id={ind}*/}
                      {/*  imgUrl={item.imgUrl}*/}
                      {/*  title="Smart watch black"*/}
                      {/*  rating={4}*/}
                      {/*  price={250}*/}
                      {/*  off={20}*/}
                      {/*/>*/}
                    </Box>
                )})}
            </Carousel>
          </Box>
        </CategorySectionCreator>
      </Box>
  )
}


export default Section2
