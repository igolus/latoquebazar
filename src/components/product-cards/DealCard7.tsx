import Image from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import { Span } from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import { Button, IconButton } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import { Box } from '@material-ui/system'
import Link from 'next/link'
import React, { useCallback } from 'react'
import ProductCard7Style from './ProductCard7Style'
import useAuth from "@hook/useAuth";
import {
  decreaseCartQte, decreaseDealCartQte,
  deleteDealInCart,
  deleteItemInCart,
  getPriceWithOptions,
  increaseCartQte, increaseDealCartQte
} from '../../util/cartUtil'
import {formatProductAndSkuName} from "../../util/displayUtil";

export interface DealCard7Props {
  id: string | number
  name: string
  qty: number
  price: number
  products: any
  deal: any,
  currency: string
}

const DealCard7: React.FC<DealCard7Props> = ({
  id,
  name,
  qty,
  price,
  products,
  deal,
  currency
}) => {

  const item = deal.deal;
  //console.log(" item " + JSON.stringify(item, null,2))
  const {orderInCreation, setOrderInCreation} = useAuth();
  //const { dispatch } = useAppContext()
  // const handleCartAmountChange = useCallback(
  //   (amount) => () => {
  //     dispatch({
  //       type: 'CHANGE_CART_AMOUNT',
  //       payload: {
  //         qty: amount,
  //         name,
  //         price,
  //         imgUrl,
  //         id,
  //       },
  //     })
  //   },
  //   []
  // )
  //let product = products.find(p => p.id === item.productId);
  let imgUrl = "/assets/images/Icon_Sandwich.png";
  if (item && item.files && item.files.length > 0) {
    imgUrl = item.files[0].url;
  }
  else if (imgUrl) {
    imgUrl = imgUrl;
  }

  return (
    <ProductCard7Style>
      {/*<p>{JSON.stringify(item)}</p>*/}
      <Image
        src={imgUrl}
        height={140}
        width={140}
        display="block"
        alt={name}
      />
      <FlexBox
        className="product-details"
        flexDirection="column"
        justifyContent="space-between"
        minWidth="0px"
        width="100%"
      >
        <Link href={`/product/detail/${item.productId}`}>
          <a>
            <Span className="title" fontWeight="600" fontSize="18px" mb={1}>
              {item.name}
            </Span>
          </a>
        </Link>
        {/*{JSON.stringify(item.options)}*/}
        {
          deal.productAndSkusLines && deal.productAndSkusLines.map((productAndSkusLine, key) =>
            // <h1>{option.name}</h1>
              <>
              <FlexBox flexWrap="wrap" alignItems="center">
                <Span color="grey.600" fontSize="14px"  mr={1}>
                 {formatProductAndSkuName(productAndSkusLine)}
                </Span>
                <Span color="grey.600" fontSize="14px"  mr={1}>
                  {productAndSkusLine.price +  " " + currency} x {deal.quantity}
                </Span>
                <Span color="grey.600" fontSize="14px" color="primary.main"  mr={2}>
                  {(parseFloat(productAndSkusLine.price) * deal.quantity).toFixed(2) + " " + currency}
                </Span>
              </FlexBox>

                {
                  productAndSkusLine.options && productAndSkusLine.options.map((option, key) =>
                          // <h1>{option.name}</h1>
                          <FlexBox flexWrap="wrap" alignItems="center">
                            <Span color="grey.700" fontSize="12px"  mr={1}>
                              {option.name}
                            </Span>
                            <Span color="grey.700" fontSize="12px"  mr={1}>
                              {option.price +  " " + currency} x {deal.quantity}
                            </Span>
                            <Span fontWeight={600} color="primary.main" fontSize="12px" mr={2}>
                              {(parseFloat(option.price) * deal.quantity).toFixed(2) + " " + currency}
                            </Span>
                          </FlexBox>

                      //   <Span key={key} className="title" fontWeight="200" fontSize="14px" mb={1}>
                      //   {option.name} {}
                      // </Span>

                  )
                }

              </>
          )}
                {/*<Span color="grey.600" fontSize="14px"  mr={1}>*/}
                {/*  {option.price +  " " + currency} x {item.quantity}*/}
                {/*</Span>*/}
                {/*<Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>*/}
                {/*  {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + currency}*/}
                {/*</Span>*/}

        <Box position="absolute" right="1rem" top="1rem">
          <IconButton
            size="small"
            sx={{
              padding: '4px',
              ml: '12px',
            }}
            onClick={() => deleteDealInCart(orderInCreation, setOrderInCreation, deal.uuid)}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <FlexBox
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <FlexBox flexWrap="wrap" alignItems="center">
            <Span color="grey.600" mr={1}>
              {getPriceWithOptions(deal).toFixed(2) + " " + currency} x {deal.quantity}
            </Span>
            <Span fontWeight={600} color="primary.main" mr={2}>
              {(getPriceWithOptions(deal) * deal.quantity).toFixed(2) + " " + currency}
            </Span>
          </FlexBox>

          <FlexBox alignItems="center">
            <Button
                variant="outlined"
                color="primary"
                // padding="5px"
                // size="none"
                // borderColor="primary.light"
                disabled={item.quantity === 1}
                sx={{ p: '5px' }}
                onClick={() => decreaseDealCartQte(orderInCreation, setOrderInCreation, deal.uuid)}
            >
              <Remove fontSize="small" />
            </Button>

            <Span mx={1} fontWeight="600" fontSize="15px">
              {deal.quantity}
            </Span>

            <Button
                variant="outlined"
                color="primary"
                // padding="5px"
                // size="none"
                // borderColor="primary.light"
                sx={{ p: '5px' }}
                onClick={() => increaseDealCartQte(orderInCreation, setOrderInCreation, deal.uuid)}
            >
              <Add fontSize="small" />
            </Button>

          </FlexBox>
        </FlexBox>
      </FlexBox>
    </ProductCard7Style>
  )
}

export default DealCard7
