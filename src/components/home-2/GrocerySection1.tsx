import AppStore from '@component/AppStore'
import BazarCard from '@component/BazarCard'
import FlexBox from '@component/FlexBox'
import LazyImage from '@component/LazyImage'
import {H1, H5, H6} from '@component/Typography'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import React from 'react'

const useStyles = makeStyles(({ breakpoints }: MuiThemeProps) => ({
  root: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: '15px',
    '& .card__inner-box': {
      padding: '40px 0px 97px 72px',
    },

    '& .carousel-dot': {
      position: 'absolute',
      bottom: '40px',
      left: '72px',
    },

    [breakpoints.down('sm')]: {
      '& .card__inner-box': {
        padding: '1rem 1rem 4rem',
      },

      '& .carousel-dot': {
        position: 'absolute',
        bottom: '0.75rem',
        left: '1rem',
      },
    },
  },
}))

const GrocerySection1 = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      {/*<Carousel*/}
      {/*  totalSlides={3}*/}
      {/*  visibleSlides={1}*/}
      {/*  showDots={true}*/}
      {/*  showArrow={false}*/}
      {/*  autoPlay={false}*/}
      {/*  dotClass="carousel-dot"*/}
      {/*  dotColor="white"*/}
      {/*  spacing="0px"*/}
      {/*>*/}
        {[...new Array(1)].map((_item, ind) => (
          <BazarCard
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 0,
              position: 'relative',
            }}
            key={ind}
          >
            <FlexBox alignItems="center" flexWrap="wrap">
              <Box className="card__inner-box" color="white" flex="1 1 0">
                <H1 maxWidth="280px" mb={1} lineHeight="1.27">
                  Get Your Grocery Within 40 Minutes
                </H1>
                <H6 maxWidth="470px" color="inherit" fontWeight="400" mb={5}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu sed
                  pellentesque nibh tortor.
                </H6>

                <H5 fontSize="18px" fontWeight="700" mb={2.5}>
                  Try our mobile app!
                </H5>

                <AppStore />
              </Box>
              <Box flex="1 1 0" minWidth="285px" height="250px" position="relative">
                <LazyImage
                  src="/assets/images/heart-shape-sliced-pepperoni-pizza-on-white-backg.jpg"
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </FlexBox>
          </BazarCard>
        ))}
      {/*</Carousel>*/}
    </Box>
  )
}

export default GrocerySection1
