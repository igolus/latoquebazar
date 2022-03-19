import {bgcolor, borderRadius, BordersProps, compose, spacing, SpacingProps, styled,} from '@material-ui/system'
import NextImage, {ImageProps} from 'next/image'
import React from 'react'

const LazyImage = styled<React.FC<ImageProps & BordersProps & SpacingProps>>(
  ({ borderRadius, ...rest }) =>
      // <Box
      //     sx={{
      //       position: 'relative',
      //       '& img': {
      //         transition: 'all .2s ease-in-out',
      //       },
      //       transform: 'scale .7',
      //       overflow: 'hidden',
      //       borderRadius: 2,
      //       '&:hover': {
      //         '& img': {
      //           transform: 'scale(1.2)',
      //         },
      //       },
      //       '& .lazy-load-image-loaded': {
      //         display: 'flex !important',
      //       },
      //     }}
      // >
      <NextImage {...rest} />
      // </Box>
)(compose(spacing, borderRadius, bgcolor))

export default LazyImage
