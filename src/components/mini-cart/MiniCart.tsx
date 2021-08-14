import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import BazarIconButton from '@component/BazarIconButton'
import FlexBox from '@component/FlexBox'
import ShoppingBagOutlined from '@component/icons/ShoppingBagOutlined'
import LazyImage from '@component/LazyImage'
import {H5, Span, Tiny} from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import { Box, Divider } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import { CartItem } from '@reducer/cartReducer'
import Link from 'next/link'
import React, {useCallback, useEffect, useState} from 'react'
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {
  decreaseCartQte, decreaseDealCartQte,
  deleteItemInCart,
  getCartItems,
  getPriceWithOptions,
  increaseCartQte, increaseDealCartQte, getItemNumberInCart, deleteDealInCart
} from "../../util/cartUtil";
import {
  computePriceDetail, formatProductAndSkuName,
  getBrandCurrency, getImgUrlFromProducts,
  getProductFirstImgUrl,
  getTotalPriceOrderInCreation
} from "../../util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";

type MiniCartProps = {
  toggleSidenav?: () => void
  contextData: any
}

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav , contextData}) => {
  const { palette } = useTheme()
  const { state, dispatch } = useAppContext()
  const { cartList } = state.cart
  const { getOrderInCreation, setOrderInCreation} = useAuth();
  const [itemNumber, setItemNumber] = useState(0);
  const [currency, setcurrency] = useState("");

  useEffect(() => {
    setItemNumber(getItemNumberInCart(getOrderInCreation))
    if (contextData) {
      setcurrency(getBrandCurrency(contextData.brand));
    }
  }, [getOrderInCreation, contextData])

  const handleCartAmountChange = useCallback(
    (amount, product) => () => {
      dispatch({
        type: 'CHANGE_CART_AMOUNT',
        payload: {
          ...product,
          qty: amount,
        },
      })
    },
    []
  )

  const getTotalPrice = () => {
    return getTotalPriceOrderInCreation(getOrderInCreation)
    //
    // return (
    //   cartList.reduce(
    //     (accumulator, item) => accumulator + item.price * item.qty,
    //     0
    //   ) || 0
    // )
  }

  function getImgUrl(item) {
    if (!contextData || !contextData.products) {
      return null;
    }
    if (item.type === TYPE_DEAL) {
      return getProductFirstImgUrl(item.deal);
    }

    let product = contextData.products.find(p=>p.id === item.productId);
    //if (product && product.files && product.files.leng)
    if (product) {
      return getProductFirstImgUrl(product);
    }
    return null;
  }

  return (
    <Box width="380px">

      {/*{JSON.stringify(orderInCreation())}*/}
      <Box
        overflow="auto"
        height={`calc(100vh - ${getItemNumberInCart(getOrderInCreation) > 0 ? '80px - 3.25rem' : '0px'})`}
      >
        <FlexBox
          alignItems="center"
          m="0px 20px"
          height="74px"
          color="secondary.main"
        >
          <ShoppingBagOutlined color="inherit" />
          <Box fontWeight={600} fontSize="16px" ml={1}>
            {localStrings.formatString(localStrings.cartItemNumber, itemNumber)}
          </Box>
        </FlexBox>

        <Divider />

        {itemNumber == 0 && (
          <FlexBox
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="calc(100% - 90px)"
          >
            <LazyImage
              src="/assets/images/logos/shopping-bag.svg"
              width="90px"
              height="100%"
            />
            <Box
              component="p"
              mt={2}
              color="grey.600"
              textAlign="center"
              maxWidth="200px"
            >
              {localStrings.emptyBasket}
            </Box>
          </FlexBox>
        )}
        {getCartItems(getOrderInCreation).map(item => (
            // <p>{JSON.stringify(item)}</p>
          <FlexBox
            alignItems="center"
            py={2}
            px={2.5}
            borderBottom={`1px solid ${palette.divider}`}
            key={item.id}
          >
            <FlexBox alignItems="center" flexDirection="column">
              <BazarButton
                variant="outlined"
                color="primary"
                sx={{
                  height: '32px',
                  width: '32px',
                  borderRadius: '300px',
                }}
                onClick={() => {
                  if (item.type === TYPE_DEAL) {
                    increaseDealCartQte(getOrderInCreation, setOrderInCreation, item.uuid)
                  }
                  else {
                    increaseCartQte(getOrderInCreation, setOrderInCreation, item.uuid)
                  }
                }}
              >
                <Add fontSize="small" />
              </BazarButton>
              <Box fontWeight={600} fontSize="15px" my="3px">
                {item.quantity}
              </Box>
              <BazarButton
                variant="outlined"
                color="primary"
                sx={{
                  height: '32px',
                  width: '32px',
                  borderRadius: '300px',
                }}
                onClick={() => {
                  if (item.type === TYPE_DEAL) {
                    decreaseDealCartQte(getOrderInCreation, setOrderInCreation, item.uuid)
                  }
                  else {
                    decreaseCartQte(getOrderInCreation, setOrderInCreation, item.uuid)
                  }
                }}
                disabled={item.quantity === 1}
              >
                <Remove fontSize="small" />
              </BazarButton>
            </FlexBox>

            <Link href={`/product/${item.id}`}>
              <a>
                <BazarAvatar
                  src={getImgUrlFromProducts(item, contextData?.products)}
                  mx={2}
                  alt={item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                  height={76}
                  width={76}
                />
              </a>
            </Link>

            <Box flex="1 1 0">
              {/*<Link href={`/product/${item.id}`}>*/}
              {/*  <a>*/}
                  <H5 className="title" fontSize="14px">
                    {item.type === TYPE_PRODUCT ? formatProductAndSkuName(item) : item.deal.name}
                  </H5>
              {/*  </a>*/}
              {/*</Link>*/}

              {/*{*/}
              {/*  item.productAndSkusLines && item.productAndSkusLines.map((productAndSkusLine, key) =>*/}
              {/*      // <h1>{option.name}</h1>*/}
              {/*      <>*/}
              {/*        <FlexBox flexWrap="wrap" alignItems="center">*/}
              {/*          <Span color="grey.600" fontSize="14px"  mr={1}>*/}
              {/*            {formatProductAndSkuName(productAndSkusLine)}*/}
              {/*          </Span>*/}
              {/*          <Span color="grey.600" fontSize="14px"  mr={1}>*/}
              {/*            {productAndSkusLine.price +  " " + currency} x {item.quantity}*/}
              {/*          </Span>*/}
              {/*          <Span color="grey.600" fontSize="14px" color="primary.main"  mr={2}>*/}
              {/*            {(parseFloat(productAndSkusLine.price) * item.quantity).toFixed(2) + " " + currency}*/}
              {/*          </Span>*/}
              {/*        </FlexBox>*/}

              {/*        {*/}
              {/*          productAndSkusLine.options && productAndSkusLine.options.map((option, key) =>*/}
              {/*                  // <h1>{option.name}</h1>*/}
              {/*                  <FlexBox flexWrap="wrap" alignItems="center">*/}
              {/*                    <Span color="grey.700" fontSize="12px"  mr={1}>*/}
              {/*                      {option.name}*/}
              {/*                    </Span>*/}
              {/*                    <Span color="grey.700" fontSize="12px"  mr={1}>*/}
              {/*                      {option.price +  " " + currency} x {item.quantity}*/}
              {/*                    </Span>*/}
              {/*                    <Span fontWeight={600} color="primary.main" fontSize="12px" mr={2}>*/}
              {/*                      {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + currency}*/}
              {/*                    </Span>*/}
              {/*                  </FlexBox>*/}

              {/*              //   <Span key={key} className="title" fontWeight="200" fontSize="14px" mb={1}>*/}
              {/*              //   {option.name} {}*/}
              {/*              // </Span>*/}

              {/*          )*/}
              {/*        }*/}

              {/*      </>*/}
              {/*  )}*/}


              {/*<p>{JSON.stringify(item)}</p>*/}
              <Tiny color="grey.600">
                {item.type === TYPE_DEAL &&
                  getPriceWithOptions(item, false).toFixed(2) + " " + currency + " x" + item.quantity
                }
                {item.type === TYPE_PRODUCT &&
                  getPriceWithOptions(item, true).toFixed(2) + " " + currency + " x" + item.quantity
                }
              </Tiny>
              <Box fontWeight={600} fontSize="14px" color="primary.main" mt={0.5}>
                {item.type === TYPE_DEAL &&
                (getPriceWithOptions(item, false) * item.quantity).toFixed(2) + " " + currency
                }
                {item.type === TYPE_PRODUCT &&
                (getPriceWithOptions(item, true) * item.quantity).toFixed(2)  + " " + currency
                }
              </Box>
            </Box>

            <BazarIconButton
              ml={2.5}
              size="small"
              onClick={() => {
                if (item.type === TYPE_DEAL) {
                  deleteDealInCart(getOrderInCreation, setOrderInCreation, item.uuid)
                }
                if (item.type === TYPE_PRODUCT) {
                  deleteItemInCart(getOrderInCreation, setOrderInCreation, item.uuid)
                }
              }}
            >
              <Close fontSize="small" />
            </BazarIconButton>
          </FlexBox>
        ))}
      </Box>

      {getItemNumberInCart(getOrderInCreation) > 0 && (
        <Box p={2.5}>

          <Link href="/checkout">
            <BazarButton
                variant="contained"
                color="primary"
                sx={{
                  mb: '0.75rem',
                  height: '40px',
                }}
                fullWidth
                onClick={toggleSidenav}
            >
              {localStrings.checkOutNow} ({computePriceDetail(getOrderInCreation()).total.toFixed(2) + " " + getBrandCurrency(contextData ? contextData.brand : null)})
              {/*{localStrings.checkOutNow}*/}
            </BazarButton>
          </Link>

          <Link href="/cart">
            <BazarButton
              color="primary"
              variant="outlined"
              sx={{ height: 40 }}
              fullWidth
              onClick={toggleSidenav}
            >
              {localStrings.viewCart}
            </BazarButton>
          </Link>
        </Box>
      )}
    </Box>
  )
}

MiniCart.defaultProps = {
  toggleSidenav: () => {},
}

export default MiniCart
