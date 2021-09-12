import {Box} from '@material-ui/core'
import React from 'react'
import Image from "@component/BazarImage";
import {isMobile, MobileView} from "react-device-detect";

export interface Section2Props {
  contextData?: any
}

const LogoSection:React.FC<Section2Props> = ({contextData}) => {


  return (
      <>
          {/*<p>!!!!!! MobileView !!!!!!!!!</p>*/}
        {/*<CategorySectionCreator*/}
        {/*    marginBottom={1}*/}
        {/*    icon={<ShoppingBasket color="primary"/>}*/}
        {/*    title={contextData?.brand?.brandName}*/}
        {/*    seeMoreLink="/contactInfo"*/}
        {/*    seeMoreTitle={localStrings.seeInfo}*/}
        {/*>*/}
          {isMobile &&
          <Box mt={-0.5} mb={-0.5} display="flex" justifyContent="center">
              <Box p={1}>
                  <Image mt={1} src={contextData?.brand?.logoUrl} alt="logo"/>
              </Box>
          </Box>
          }
        {/*</CategorySectionCreator>*/}
      </>
  )
};

export default LogoSection
