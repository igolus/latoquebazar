import BazarCard from '@component/BazarCard'
import Category from '@component/icons/Category'
import LazyImage from '@component/LazyImage'
import {Box, Container, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import Link from 'next/link'
import React from 'react'
import CategorySectionHeader from '../CategorySectionHeader'
import localStrings from "../../localStrings";
import {convertCatName, filterCat, getProductFirstImgUrl} from "../../util/displayUtil";
import useAuth from "@hook/useAuth";

const useStyles = makeStyles(({ shadows }: MuiThemeProps) => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: 8,
    transition: 'all 250ms ease-in-out',

    '&:hover': {
      boxShadow: shadows[3],
    },
  },
}))

export interface SectionCategoriesProps {
  contextData: any,
  // categories: any,
  // products: any,
  // deals: any,
}


const SectionCategories: React.FC<SectionCategoriesProps> = ({contextData}) => {
  const classes = useStyles();

    const {getContextDataAuth} = useAuth();

    //const query = params?.get("query");
    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().products) {
            return getContextDataAuth()
        }
        return contextData;
    }

  const filteredCat = filterCat(getContextData().categories, getContextData().products, getContextData().deals)

  return (
    <div style={{width: '100%'}}>
      <Container sx={{ mb: '70px', mt: '15px' }}>
      <CategorySectionHeader
        title={localStrings.categories}
        icon={<Category color="primary" />}
        seeMoreLink="/product/shop/all"
        seeMoreTitle={localStrings.viewAllCat}
      />

      <Grid container  spacing={3} justifyContent='center'>
        {/*<p>{JSON.stringify(categories)}</p>*/}
        {/*  <Box*/}
        {/*      spacing={3}*/}
        {/*      display="flex"*/}
        {/*      justifyContent="center"*/}
        {/*      alignItems="center"*/}
        {/*      minHeight="100vh"*/}
        {/*  >*/}
        {filteredCat.map((item, ind) => (
          <Grid item lg={2} md={3} sm={4} xs={12} key={ind}>
            <Link href={"/product/shop/" + convertCatName(item.category)}>
              <a>
                <BazarCard className={classes.card} elevation={1}>
                  {getProductFirstImgUrl(item) &&
                  <LazyImage
                      src={getProductFirstImgUrl(item)}
                      alt="fashion"
                      height="52px"
                      width="52px"
                      objectFit="contain"
                      borderRadius="8px"
                  />
                  }
                  <Box fontWeight="600" ml={1.25}>
                    {item.category}
                  </Box>
                </BazarCard>
              </a>
            </Link>
          </Grid>
        ))}
          {/*</Box>*/}
      </Grid>
    </Container>
    </div>
  )
}


export default SectionCategories
