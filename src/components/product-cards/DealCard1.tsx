import BazarCard from '@component/BazarCard'
import LazyImage from '@component/LazyImage'
import {H3} from '@component/Typography'
import {useAppContext} from '@context/app/AppContext'
import {Box, Button, Chip,} from '@material-ui/core'
import {CSSProperties, makeStyles} from '@material-ui/styles'
import {CartItem} from '@reducer/cartReducer'
import {MuiThemeProps} from '@theme/theme'
import Link from 'next/link'
import React from 'react'
import FlexBox from '../FlexBox'
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {getFirstRestrictionItem, getPriceDeal} from "../../util/displayUtil";
import useWindowSize from "@hook/useWindowSize";
import {WIDTH_DISPLAY_MOBILE} from "../../util/constants";
import Image from "@component/BazarImage";

export interface DealCard1Props {
  className?: string
  style?: CSSProperties
  rating?: number
  hoverEffect?: boolean
  imgUrl: string
  title: string
  price: number
  off?: number
  id: string | number
  deal: any
  options: any
  currency: string
  currentService: any
}

const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    margin: 'auto',
    overflow: 'hidden',
    transition: 'all 250ms ease-in-out',
    borderRadius: '8px',

    '&:hover': {
      '& $imageHolder': {
        '& .extra-icons': {
          display: 'flex',
        },
      },
    },

    '@media only screen and (max-width: 768px)': {
      '& $imageHolder': {
        '& .extra-icons': {
          display: 'flex',
        },
      },
    },
  },
  imageHolder: {
    position: 'relative',
    display: 'inlin-block',
    textAlign: 'center',

    '& .extra-icons': {
      display: 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '7px',
      right: '15px',
      cursor: 'pointer',
      zIndex: 2,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  offerChip: {
    //position: 'absolute',
    opacity:0.8,
    fontSize: '15px',
    fontWeight: 600,
    paddingLeft: 3,
    paddingRight: 3,

    zIndex: 999,
  },
  details: {
    padding: '1rem',

    '& .title, & .categories': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    '& .icon-holder': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },

    '& .favorite-icon': {
      cursor: 'pointer',
    },
  },
  dialogContent: {
    paddingBottom: '1.25rem',
  },
}))

const DealCard1: React.FC<DealCard1Props> = ({
                                               id,
                                               imgUrl,
                                               title,
                                               price= 200,
                                               off = 0,
                                               rating,
                                               hoverEffect,
                                               deal,
                                               options,
                                               currency,
                                               currentService,
                                               fullView
                                             }) => {

  const width = useWindowSize()

  if (!deal) {
    deal = {
      name: title,

    }
  }
  const {getOrderInCreation, setOrderInCreation, currentEstablishment} = useAuth();

  const classes = useStyles({ hoverEffect })
  const { state, dispatch } = useAppContext()
  const cartItem: CartItem | undefined = state.cart.cartList.find(
      (item) => item.id === id
  )


  let url = "/assets/images/Icon_Sandwich.png";
  if (deal && deal.files && deal.files.length > 0) {
    url = deal.files[0].url;
  }
  else if (imgUrl) {
    url = imgUrl;
  }

  //computeItemRestriction(deal, currentEstablishment, currentService, getOrderInCreation())

  function buildProductDetailRef() {
    return `/product/detailDeal/${deal.id}`;
  }

  function getDealPresentationAndInteration() {
    return (
        <Box>
          {!fullView && width <= WIDTH_DISPLAY_MOBILE && deal.tags && deal.tags.map((tag, key) =>
              <Box key={key} ml='3px' mt='6px' mr='3px'>
                <Chip
                    className={classes.offerChip}
                    color="primary"
                    size="small"
                    label={tag.tag}
                />
              </Box>
          )}
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr={1}>
            <Link href={buildProductDetailRef()}>
              <a>
                <H3
                    className="title"
                    fontSize="14px"
                    textAlign="left"
                    fontWeight="600"
                    color="text.secondary"
                    mb={1}
                    title={deal.name}

                >
                  {deal.name}
                </H3>
              </a>
            </Link>

            <FlexBox alignItems="center" mt={0.5}>
              <Box pr={1} fontWeight="600" color="primary.main">
                {getPriceDeal(deal).toFixed(2)} {currency}
              </Box>
            </FlexBox>

          </Box>

          <FlexBox
              className="add-cart"
              flexDirection="row"
              alignItems="center"
              justifyContent={!!cartItem?.qty ? 'space-between' : 'flex-start'}
              //width="65px"
          >
            <Link href={buildProductDetailRef()}>
              <Button
                  disabled={getFirstRestrictionItem(deal)}
                  variant="outlined"
                  color="primary"
                  sx={{padding: '3px', ml: '5px', mr: '5px'}}
              >
                {getFirstRestrictionItem(deal) || localStrings.choose}
              </Button>
            </Link>
          </FlexBox>
        </FlexBox>
        </Box>
    );
  }

  return (
      <BazarCard className={classes.root} hoverEffect={hoverEffect}>
        {/*<p>{JSON.stringify(deal || {})}</p>*/}

        <div className={classes.imageHolder}>
          <Box
              display="flex"
              flexWrap="wrap"
              sx={{position: 'absolute', zIndex: 999, mr: '35px', mt: '4px'}}
          >
            {(fullView || width > WIDTH_DISPLAY_MOBILE) && deal.tags && deal.tags.map((tag, key) =>
                <Box key={key} ml='3px' mt='6px' mr='3px'>
                  <Chip
                      className={classes.offerChip}
                      color="primary"
                      size="small"
                      label={tag.tag}
                  />
                </Box>
            )}
          </Box>

          {(fullView || width > WIDTH_DISPLAY_MOBILE) &&
          <Link href={buildProductDetailRef()}>
            <a>
              <LazyImage
                  src={url}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  alt={deal.name}
              />
            </a>
          </Link>
          }
        </div>

        <div className={classes.details}>
          {(!fullView && width <= WIDTH_DISPLAY_MOBILE) ?
              <Box
                  mr={.5}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
              >
                <Box sx={{maxWidth: "100px"}} mr={1}>
                  <Link href={buildProductDetailRef()}>
                    <a>
                      <Image
                          style={{objectFit: "cover"}}
                          src={imgUrl}
                          height={100}
                          width={100}
                          display="block"
                          alt={deal.name}
                      />
                    </a>
                  </Link>
                </Box>

                <Box sx={{flexGrow: 1}}>
                  {getDealPresentationAndInteration()}
                </Box>

              </Box>


              :
              <>
                {getDealPresentationAndInteration()}
              </>
          }
        </div>

      </BazarCard>
  )
}

DealCard1.defaultProps = {
  // id: '324321',
  // title: 'ASUS ROG Strix G15',
  imgUrl: '/assets/images/Icon_Sandwich.png',
  price: 450,
  rating: 0,
  //off: 20,
}

export default DealCard1
