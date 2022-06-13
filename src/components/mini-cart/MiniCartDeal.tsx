import BazarAvatar from '@component/BazarAvatar'
import FlexBox from '@component/FlexBox'
import {H5, Span} from '@component/Typography'
import {Box, Button} from '@material-ui/core'
import {useTheme} from '@material-ui/core/styles'
import React from 'react'
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {formatProductAndSkuName, getProductFirstImgUrl} from "../../util/displayUtil";
import {isMobile} from "react-device-detect";

type MiniCartProps = {
  toggleSidenav?: () => void
  contextData: any
  setterLine?: any
  updateMode?: boolean
  closeCallBack?: () => void
}

const MiniCartDeal: React.FC<MiniCartProps> = ({ toggleSidenav ,
                                                 updateMode, contextData, setterLine, closeCallBack}) => {
  const { palette } = useTheme()
  const { dealEdit, getOrderInCreation } = useAuth();

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
      {/*<p>{JSON.stringify(dealEdit)}</p>*/}
      {/*<br/>*/}
      {/*<p>{JSON.stringify(getOrderInCreation())}</p>*/}
    <Box width={isMobile ? "270px" : "380px"} ml={0}>
        {dealEdit && dealEdit.productAndSkusLines && dealEdit.productAndSkusLines.map((item, index) => (
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
                        </FlexBox>
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
