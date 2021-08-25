import Image from '@component/BazarImage'
import FlexBox from '@component/FlexBox'
import { Span } from '@component/Typography'
import { useAppContext } from '@context/app/AppContext'
import {Avatar, Button, IconButton} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import Remove from '@material-ui/icons/Remove'
import { Box } from '@material-ui/system'
import Link from 'next/link'
import React, { useCallback } from 'react'
import ProductCard7Style from './ProductCard7Style'
import useAuth from "@hook/useAuth";
import {decreaseCartQte, deleteItemInCart, getPriceWithOptions, increaseCartQte} from '../../util/cartUtil'
import {formatProductAndSkuName, getImgUrlFromProductsWithExtRef} from "../../util/displayUtil";
import localStrings from "../../localStrings";

export interface ProductCard7Props {
  id: string | number
  name: string
  qty: number
  price: number
  products: any
  item: any,
  currency: string
  modeOrder: boolean
}

const ProductCard7: React.FC<ProductCard7Props> = ({
  id,
  name,
  qty,
  price,
  products,
  item,
  currency,
  modeOrder
}) => {

  const {getOrderInCreation, setOrderInCreation} = useAuth();
  let product = products.find(p => p.id === item.productId);
  let imgUrl = "/assets/images/Icon_Sandwich.png";
  //alert("product " + product)
  if (!product) {
    //try to find with extRef in skus
    product = products.find(p => p.skus && p.skus.some(sku => sku.extRef === item.extRef));
  }
  //alert("product " + product)
  if (product && product.files && product.files.length > 0) {
    imgUrl = product.files[0].url;
  }


  if (!imgUrl) {
    imgUrl = imgUrl;
  }

  return (
    <ProductCard7Style>
      {modeOrder ?
          <Avatar
              src={imgUrl}
              sx={{height: 80, width: 80, mt: 1, ml: 2, mb: 1}}
          />
          :

          <Image
              src={imgUrl}
              height={140}
              width={140}
              display="block"
              alt={name}
          />
      }
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
              {formatProductAndSkuName(item)}
            </Span>

            <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
              {" " + parseFloat(item.price).toFixed(2)  + " " + currency }
            </Span>
          </a>
        </Link>
        {/*{JSON.stringify(item.options)}*/}
        {
          item.options && item.options.map((option, key) =>
            // <h1>{option.name}</h1>
              <FlexBox flexWrap="wrap" alignItems="center">
                <Span color="grey.600" fontSize="14px"  mr={1}>
                 {option.name}
                </Span>
                <Span color="grey.600" fontSize="14px"  mr={1}>
                  {option.price +  " " + currency} x {item.quantity}
                </Span>
                <Span fontWeight={600} color="primary.main" fontSize="14px" mr={2}>
                  {(parseFloat(option.price) * item.quantity).toFixed(2) + " " + currency}
                </Span>
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
            onClick={() => deleteItemInCart(getOrderInCreation, setOrderInCreation, item.uuid)}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
        }

        <FlexBox
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <FlexBox flexWrap="wrap" alignItems="center">
            <Span color="grey.600" mr={1}>
              {getPriceWithOptions(item, true).toFixed(2) + " " + currency} x {item.quantity}
            </Span>
            <Span fontWeight={600} color="primary.main" mr={2}>
              {" " + localStrings.total + ": " +  (getPriceWithOptions(item, true) *  item.quantity).toFixed(2) + " " + currency}
            </Span>
          </FlexBox>
          {!modeOrder &&
            <FlexBox alignItems="center">
            <Button
                variant="outlined"
                color="primary"
                disabled={item.quantity === 1}
                sx={{p: '5px'}}
                onClick={() => decreaseCartQte(getOrderInCreation, setOrderInCreation, item.uuid)}
            >
              <Remove fontSize="small"/>
            </Button>

            <Span mx={1} fontWeight="600" fontSize="15px">
              {item.quantity}
            </Span>

            <Button
                variant="outlined"
                color="primary"
                // padding="5px"
                // size="none"
                // borderColor="primary.light"
                sx={{p: '5px'}}
                onClick={() => increaseCartQte(getOrderInCreation, setOrderInCreation, item.uuid)}
            >
              <Add fontSize="small"/>
            </Button>


          </FlexBox>
          }
        </FlexBox>
      </FlexBox>
    </ProductCard7Style>
  )
}

export default ProductCard7
