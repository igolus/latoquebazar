import Image from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import {Span, Tiny2} from '@component/Typography'
import {Avatar, Button, Dialog, DialogContent, IconButton, Tooltip} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import EditIcon from '@material-ui/icons/Edit';
import {Box} from '@material-ui/system'
import Link from 'next/link'
import React, {useState} from 'react'
import ProductCard7Style from './ProductCard7Style'
import useAuth from "@hook/useAuth";
import {decreaseCartQte, deleteItemInCart, getPriceWithOptions, increaseCartQte} from '../../util/cartUtil'
import {formatProductAndSkuName} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import {itemHaveRestriction, itemRestrictionMax} from "@component/mini-cart/MiniCart";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import ProductIntro from "@component/products/ProductIntro";
import {makeStyles} from "@material-ui/styles";
import {MuiThemeProps} from "@theme/theme";

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

    //zIndex: 998,
  },
  details: {
    padding: '1rem',
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
    backgroundColor: palette.background.default
    //maxWidth: "750px"
  },
  backDrop: {
    backdropFilter: "blur(5px)",
    backgroundColor:'rgba(0,0,30,0.4)'
  },
}))


function getStyleForUpdate(item: any) {
  if (item.optionListExtIds && item.optionListExtIds.length > 0) {
    return {objectFit: "cover", cursor:"pointer"};
  }
  return null;
}

export interface ProductCard7Props {
  id: string | number
  name: string
  qty: number
  price: number
  products: any
  item: any,
  currency: string
  modeOrder: boolean
  contextData: any
}

const ProductCard7: React.FC<ProductCard7Props> = ({
                                                     id,
                                                     name,
                                                     qty,
                                                     price,
                                                     products,
                                                     item,
                                                     currency,
                                                     modeOrder,
                                                     contextData
                                                   }) => {

  const classes = useStyles()
  const {getOrderInCreation, setOrderInCreation,
    currentBrand,
    setGlobalDialog, checkDealProposal, currentEstablishment} = useAuth();
  const [openProductDetail, setOpenProductDetail] = useState(false);
  let product = products.find(p => p.id === item.productId);
  let imgUrl = "/assets/images/Icon_Sandwich.png";
  if (!product) {
    //try to find with extRef in skus
    product = products.find(p => p.skus && p.skus.some(sku => sku.extRef === item.extRef));
  }
  //alert("product " + product)
  if (product && product.files && product.files.length > 0 && product.files[0].url) {
    imgUrl = product.files[0].url;
  }

  const displayProductDetail =  () => {
    if (item.optionListExtIds && item.optionListExtIds.length > 0) {
      setOpenProductDetail(true);
    }
  }

  if (!imgUrl) {
    imgUrl = imgUrl;
  }

  return (
      <>
        <Dialog
            open={openProductDetail}
            maxWidth={false}
            onClose={() => setOpenProductDetail(false)}>
          <DialogContent className={classes.dialogContent}>
            <ProductIntro imgUrl={[imgUrl]} title={"t"} price={price}
                          disableFacebook={true}
                          brand={currentBrand()}
                          initialItem={item}
                          //faceBookShare={faceBookShare}
                          //skuIndex={selectedSkuIndex}
                          product={product}
                          options={contextData.options}
                          currency={currency}
                          addCallBack={() => {
                            setOpenProductDetail(false)
                          }}
            />
            <IconButton
                sx={{position: 'absolute', top: '0', right: '0'}}
                onClick={() => setOpenProductDetail(false)}
            >
              <Close className="close" fontSize="small" color="primary"/>
            </IconButton>
          </DialogContent>
        </Dialog>
          <ProductCard7Style>
            {modeOrder ?
                <Avatar
                    src={imgUrl}
                    sx={{height: 80, width: 80, mt: 1, ml: 2, mb: 1}}
                />
                :
                // <Link href={"/product/detail/" + product?.id}>
                <Image
                    onClick={displayProductDetail}
                    style={getStyleForUpdate(item)}
                    src={imgUrl}
                    height={140}
                    width={140}
                    display="block"
                    alt={name}
                />
              // </Link>
            }
            <FlexBox
                className="product-details"
                flexDirection="column"
                justifyContent="space-between"
                minWidth="0px"
                width="100%"
            >
              {/*<Link href={"/product/detail/" + product?.id}>*/}
                <div style={getStyleForUpdate(item)} onClick={displayProductDetail}>
                  <Span className="title" fontWeight="600" fontSize="18px" mb={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                    {formatProductAndSkuName(item)}
                  </Span>
                  {!itemHaveRestriction(item) &&
                      <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                        {" " + parseFloat(item.price).toFixed(2) + " " + currency}
                      </Span>
                  }
                </div>
              {/*</Link>*/}
              {/*{JSON.stringify(item.options)}*/}
              {
                  item.options && item.options.map((option, key) =>
                          // <h1>{option.name}</h1>
                          <FlexBox flexWrap="wrap" alignItems="center">
                            <Span color="grey.600" fontSize="14px"  mr={1} style={{ textDecoration : itemHaveRestriction(item) ? 'line-through' : 'none'}}>
                              {option.name}
                            </Span>
                            {! itemHaveRestriction(item) &&
                                <>
                                  <Span color="grey.600" fontSize="14px"  mr={1}>
                                    {option.price +  " " + currency} x {item.quantity}
                                  </Span>
                                  <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                                    {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + currency}
                                  </Span>
                                </>
                            }
                          </FlexBox>

                      //   <Span key={key} className="title" fontWeight="200" fontSize="14px" mb={1}>
                      //   {option.name} {}
                      // </Span>

                  )
              }

              {!modeOrder &&
                  <Box position="absolute" right="1rem" top="1rem">
                    <IconButton
                        size="small"
                        sx={{
                          padding: '4px',
                          ml: '12px',
                        }}
                        onClick={() => deleteItemInCart(setGlobalDialog, getOrderInCreation, setOrderInCreation, item.uuid)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
              }

              <FlexBox
                  justifyContent="space-between"
                  alignItems="flex-end"
              >
                {!itemHaveRestriction(item) &&
                    <FlexBox flexWrap="wrap" alignItems="center">
                      <Span color="grey.600" mr={1}>
                        {getPriceWithOptions(item, true).toFixed(2) + " " + currency} x {item.quantity}
                      </Span>
                      <Span fontWeight={600} color="primary.main" mr={2}>
                        {" " + localStrings.total + ": " + (getPriceWithOptions(item, true) * item.quantity).toFixed(2) + " " + currency}
                      </Span>
                    </FlexBox>
                }
                {(itemHaveRestriction(item) || itemRestrictionMax(item)) &&
                    <AlertHtmlLocal title={localStrings.productRestricted}>
                      <ul>
                        {item.restrictionsApplied.map((restriction, key) => {
                          return (
                              <li>
                                <Tiny2 color="grey.600" key={key}>
                                  {restriction.local || restriction.type}
                                </Tiny2>
                              </li>
                          )
                        })}
                      </ul>
                    </AlertHtmlLocal>
                }

                {!modeOrder &&
                    <FlexBox alignItems="center">
                      {/*<p>{JSON.stringify(item)}</p>*/}
                      {item.optionListExtIds && item.optionListExtIds.length > 0 &&
                          <Tooltip title={localStrings.editOptions}>
                            <Button
                                sx={{p: '5px', mr: '5px'}}
                                variant="outlined"
                                color="primary"
                                onClick={displayProductDetail}
                            >
                              <EditIcon fontSize="small"/>
                            </Button>
                          </Tooltip>
                      }
                      <Button
                          variant="outlined"
                          color="primary"
                          disabled={item.quantity === 0 || itemHaveRestriction(item)}
                          sx={{p: '5px'}}
                          onClick={() => decreaseCartQte(setGlobalDialog, getOrderInCreation(), setOrderInCreation,
                              item.uuid, checkDealProposal, currentEstablishment)}
                      >
                        <Remove fontSize="small"/>
                      </Button>

                      <Span mx={1} fontWeight="600" fontSize="15px">
                        {item.quantity}
                      </Span>

                      <Button
                          variant="outlined"
                          color="primary"
                          disabled={item.quantity === 0 || itemHaveRestriction(item) || itemRestrictionMax(item)}
                          sx={{p: '5px'}}
                          onClick={async () => await increaseCartQte(setGlobalDialog, getOrderInCreation(),
                              setOrderInCreation, item.uuid, null, checkDealProposal, currentEstablishment, currentBrand())}
                      >
                        <Add fontSize="small"/>
                      </Button>
                    </FlexBox>
                }
              </FlexBox>
            </FlexBox>
          </ProductCard7Style>
        </>
        )
        }

        export default ProductCard7
