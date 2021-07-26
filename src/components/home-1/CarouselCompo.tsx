import CarouselCard1 from '@component/carousel-cards/CarouselCard1'
import Carousel from '@component/carousel/Carousel'
import Navbar from '@component/navbar/Navbar'
import { Box, Container } from '@material-ui/core'
import React, { Fragment } from 'react'
import {IndexPageProps} from "../../../pages";

export interface CarouselCompoProps {
    contextData?: any
}


const CarouselCompo:React.FC<CarouselCompoProps> = ({contextData}) => {
  return (
    <Fragment>
      <Navbar contextData={contextData}/>
        {/*<p>{JSON.stringify(contextData.categories)}</p>*/}
      <Box bgcolor="white" mb={7.5}>
        <Container sx={{ py: '2rem' }}>
          <Carousel
            totalSlides={2}
            visibleSlides={1}
            infinite={true}
            autoPlay={false}
            showDots={true}
            showArrow={false}
            spacing="0px"
          >
            <CarouselCard1 />
            <CarouselCard1 />
            {/* <CarouselCard1 /> */}
            {/* <CarouselCard1 /> */}
            {/* <CarouselCard1 /> */}
          </Carousel>
        </Container>
      </Box>
    </Fragment>
  )
}

export default CarouselCompo
