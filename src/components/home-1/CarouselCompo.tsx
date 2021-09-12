import CarouselCard1 from '@component/carousel-cards/CarouselCard1'
import Carousel from '@component/carousel/Carousel'
import Navbar from '@component/navbar/Navbar'
import { Box, Container } from '@material-ui/core'
import React, { Fragment } from 'react'
import {IndexPageProps} from "../../../pages";
import CarouselCard2 from "@component/carousel-cards/CarouselCard2";
import {isMobile} from "react-device-detect";
import Image from "@component/BazarImage";

export interface CarouselCompoProps {
    contextData?: any
}


const CarouselCompo:React.FC<CarouselCompoProps> = ({contextData}) => {
  const carouselItems = contextData?.brand?.config?.carouselWebConfig || [];
    return (
    <Fragment>
      <Navbar contextData={contextData}/>


      {isMobile &&
          <div style={{width:"100%"}}>
            {/*<Box mt={-0.5} mb={-0.5} display="flex" justifyContent="center">*/}
              <Box>
                <Image mt={1} src={contextData?.brand?.logoUrl}/>
              </Box>
            {/*</Box>*/}
          </div>
      }
        {/*<p>{JSON.stringify(contextData.categories)}</p>*/}
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

                    {/*<CarouselCard2/>*/}
                    {/*<CarouselCard1 />*/}
                    {/* <CarouselCard1 /> */}
                    {/* <CarouselCard1 /> */}
                    {/* <CarouselCard1 /> */}
                </Carousel>
            </Container>
        </Box>
        }
    </Fragment>
  )
}

export default CarouselCompo
