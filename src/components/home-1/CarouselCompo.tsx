import CarouselCard1 from '@component/carousel-cards/CarouselCard1'
import Carousel from '@component/carousel/Carousel'
import Navbar from '@component/navbar/Navbar'
import {Box, Container} from '@material-ui/core'
import React, {Fragment} from 'react'
import useAuth from "@hook/useAuth";
import Fade from 'react-reveal/Fade';

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
  const carouselAsList = getContextData()?.brand?.config.carouselAsList;
  return (
      <Fragment>
        <Navbar contextData={getContextData()}/>

        {carouselItems && carouselItems.length > 0 &&
        // <Box bgcolor="white" mb={7.5}>
        //   <Container sx={{py: '2rem'}}>
            <>
            {!carouselAsList ?

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
                :
                <>
                  {carouselItems.map((carouselItem, key) =>
                      <Fade left={parseInt(key) % 2 === 0} right={parseInt(key) % 2 !== 0}>
                        {/*<p>{JSON.stringify(carouselItem)}</p>*/}
                        <Box bgcolor={parseInt(key) % 2 !== 0 ? "grey.200"  : "white" } pb={4} pt={4}>
                          <CarouselCard1 {...carouselItem} odd={parseInt(key) % 2 === 0} marginBottom={"75px"}/>
                        </Box>
                      </Fade>
                  )}
                </>
            }
            </>
        //   </Container>
        // </Box>
        }
      </Fragment>
  )
}

export default CarouselCompo
