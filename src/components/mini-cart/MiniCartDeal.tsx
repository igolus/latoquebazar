import BazarAvatar from '@component/BazarAvatar'
import BazarButton from '@component/BazarButton'
import BazarIconButton from '@component/BazarIconButton'
import FlexBox from '@component/FlexBox'
import ShoppingBagOutlined from '@component/icons/ShoppingBagOutlined'
import LazyImage from '@component/LazyImage'
import {H5, Span, Tiny} from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import {Box, Button, Divider} from '@material-ui/core'
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
  getBrandCurrency, getCroppedStringSize,
  getProductFirstImgUrl,
  getTotalPriceOrderInCreation
} from "../../util/displayUtil";
import {TYPE_DEAL, TYPE_PRODUCT} from "../../util/constants";
import {isMobile} from "react-device-detect";

type MiniCartProps = {
  toggleSidenav?: () => void
  contextData: any
  setterLine?: any
  closeCallBack?: () => void
}

const MiniCartDeal: React.FC<MiniCartProps> = ({ toggleSidenav , contextData, setterLine, closeCallBack}) => {
  const { palette } = useTheme()
  const { dealEdit } = useAuth();
  //const [itemNumber, setItemNumber] = useState(0);
  const [currency, setcurrency] = useState("");

  // useEffect(() => {
  //   setItemNumber(getItemNumberInCart(orderInCreation))
  //   if (contextData) {
  //     setcurrency(getBrandCurrency(contextData.brand));
  //   }
  // }, [orderInCreation, contextData])
  //
  // const handleCartAmountChange = useCallback(
  //   (amount, product) => () => {
  //     dispatch({
  //       type: 'CHANGE_CART_AMOUNT',
  //       payload: {
  //         ...product,
  //         qty: amount,
  //       },
  //     })
  //   },
  //   []
  // )

  const getTotalPrice = () => {
    return getTotalPriceOrderInCreation(orderInCreation)
    //
    // return (
    //   cartList.reduce(
    //     (accumulator, item) => accumulator + item.price * item.qty,
    //     0
    //   ) || 0
    // )
  }

  // function getImgUrl(item) {
  //   if (!contextData || !contextData.products) {
  //     return null;
  //   }
  //   if (item.type === TYPE_DEAL) {
  //     return getProductFirstImgUrl(item.deal);
  //   }
  //
  //   let product = contextData.products.find(p=>p.id === item.productId);
  //   //if (product && product.files && product.files.leng)
  //   if (product) {
  //     return getProductFirstImgUrl(product);
  //   }
  //   return null;
  // }

  function modifyDealLine(line) {
    //alert("modifyDealLine " + line)
    setterLine(line);
    closeCallBack();

  }

  function getImgUrl(item) {
    if (contextData && contextData.products) {
      const product = contextData.products.find(p => p.id === item.productId);
      return getProductFirstImgUrl(product)
    }
    return null;
  }

  return (
    <>
      {/*<p>{JSON.stringify(dealEdit || {})}</p>*/}
      {/*<p>{JSON.stringify(contextData ? contextData.products : {})}</p>*/}

    <Box width={isMobile ? "270px" : "380px"} ml={0}>

      {/*{JSON.stringify(orderInCreation())}*/}
      {/*<Box*/}
      {/*  overflow="auto"*/}
      {/*  height={`calc(100vh - ${getItemNumberInCart(orderInCreation) > 0 ? '80px - 3.25rem' : '0px'})`}*/}
      {/*>*/}
        {/*<FlexBox*/}
        {/*  alignItems="center"*/}
        {/*  m="0px 20px"*/}
        {/*  height="74px"*/}
        {/*  color="secondary.main"*/}
        {/*>*/}
        {/*  <ShoppingBagOutlined color="inherit" />*/}
        {/*  <Box fontWeight={600} fontSize="16px" ml={1}>*/}
        {/*    {localStrings.formatString(localStrings.cartItemNumber, itemNumber)}*/}
        {/*  </Box>*/}
        {/*</FlexBox>*/}

        {/*<Divider />*/}

        {/*{itemNumber == 0 && (*/}
        {/*  <FlexBox*/}
        {/*    flexDirection="column"*/}
        {/*    alignItems="center"*/}
        {/*    justifyContent="center"*/}
        {/*    height="calc(100% - 90px)"*/}
        {/*  >*/}
        {/*    <LazyImage*/}
        {/*      src="/assets/images/logos/shopping-bag.svg"*/}
        {/*      width="90px"*/}
        {/*      height="100%"*/}
        {/*    />*/}
        {/*    <Box*/}
        {/*      component="p"*/}
        {/*      mt={2}*/}
        {/*      color="grey.600"*/}
        {/*      textAlign="center"*/}
        {/*      maxWidth="200px"*/}
        {/*    >*/}
        {/*      {localStrings.emptyBasket}*/}
        {/*    </Box>*/}
        {/*  </FlexBox>*/}
        {/*)}*/}


        {dealEdit && dealEdit.productAndSkusLines.map((item, index) => (
          <FlexBox
            key={index}
            alignItems="center"
            py={2}
            //px={2.5}
            borderBottom={`1px solid ${palette.divider}`}
            key={item.id}
          >
            <FlexBox alignItems="center" flexDirection="column" p={0}>
              {/*<Box fontWeight={600} fontSize="15px" my="3px">*/}

              {/*</Box>*/}

              <BazarAvatar
                  src={getImgUrl(item) || "/assets/images/Icon_Sandwich.png"}
                  mx={2}
                  //alt={item.type === TYPE_PRODUCT ? item.name : item.deal.name}
                  height={76}
                  width={76}
              />

            </FlexBox>

            <Box flex="1 1 0" style={{marginRight:"5px"}}>
              <H5 className="title" fontSize="14px">
                {formatProductAndSkuName(item)}
              </H5>
              {
                item.options && item.options.map((option, key) =>
                        // <h1>{option.name}</h1>
                        <FlexBox flexWrap="wrap" alignItems="center">
                          <Span color="grey.600" fontSize="14px"  mr={1}>
                            {option.name}
                          </Span>
                          {/*<Span color="grey.600" fontSize="14px"  mr={1}>*/}
                          {/*  {option.price +  " " + currency} x {item.quantity}*/}
                          {/*</Span>*/}
                          {/*<Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>*/}
                          {/*  {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + currency}*/}
                          {/*</Span>*/}
                        </FlexBox>

                    //   <Span key={key} className="title" fontWeight="200" fontSize="14px" mb={1}>
                    //   {option.name} {}
                    // </Span>

                )
              }

            </Box>



            <Box alignItems="flex-end">
              <Button variant="contained" color="primary" onClick={() => modifyDealLine(item.lineNumber)}>
                {localStrings.modify}
              </Button>

            </Box>
          </FlexBox>
        ))}


    </Box>
    </>
  );
};

// MiniCartDeal.defaultProps = {
//   toggleSidenav: () => {},
// }

export default MiniCartDeal
