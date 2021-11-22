import CarouselCard1 from '@component/carousel-cards/CarouselCard1'
import Carousel from '@component/carousel/Carousel'
import Navbar from '@component/navbar/Navbar'
import { Box, Container } from '@material-ui/core'
import React, { Fragment } from 'react'
import {IndexPageProps} from "../../../pages";
import CarouselCard2 from "@component/carousel-cards/CarouselCard2";
import {isMobile} from "react-device-detect";
import Image from "@component/BazarImage";
import useAuth from "@hook/useAuth";

export interface CarouselCompoProps {
  contextData?: any
}


const CarouselCompo:React.FC<CarouselCompoProps> = ({contextData}) => {

  const {getContextDataAuth} = useAuth();

  function getContextData() {
    if (getContextDataAuth() && getContextDataAuth().brand) {
      return getContextDataAuth()
    }
    return contextData;
  }

  const carouselItems = getContextData()?.brand?.config?.carouselWebConfig || [];

  return (
      <Fragment>
        <Navbar contextData={getContextData()}/>

        {carouselItems && carouselItems.length > 0 &&
        <Box bgcolor="white" mb={7.5}>
          <Container sx={{py: '2rem'}}>
            <Carousel
                interval={8000}
                totalSlides={carouselItems.length}
                visibleSlides={1}
                infinite={true}
                autoPlay={true}
                showDots={carouselItems.length > 1}
                showArrow={false}
                spacing="0px"
            >

              {carouselItems.map((carouselItem, key) =>
                  <CarouselCard1 {...carouselItem} />
              )}
            </Carousel>
          </Container>
        </Box>
        }
      </Fragment>
  )
}

export default CarouselCompo
