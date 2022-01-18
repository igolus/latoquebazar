import navigations from '@data/navigations'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MuiThemeProps } from '@theme/theme'
import React from 'react'
import CategoryMenuItem from './CategoryMenuItem'
import MegaMenu1 from './mega-menu/MegaMenu1'
import MegaMenu2 from './mega-menu/MegaMenu2'
import localStrings from "../../localStrings";
import {convertCatName, filterCat} from "../../util/displayUtil";

export interface CategoryMenuCardProps {
  open?: boolean
  position?: 'absolute' | 'relative'
  contextData: any,
}

const useStyles = makeStyles(({ palette, shadows }: MuiThemeProps) => ({
  root: (props: CategoryMenuCardProps) => ({
    position: props.position || 'unset',
    padding: '0.5rem 0px',
    left: 0,
    right: 'auto',
    top: props.position === 'absolute' ? 'calc(100% + 0.7rem)' : '0.5rem',
    borderRadius: 4,
    transform: props.open ? 'scaleY(1)' : 'scaleY(0)',
    transformOrigin: 'top',
    backgroundColor: palette.background.paper,
    boxShadow: shadows[2],
    transition: 'all 250ms ease-in-out',
    zIndex: 98,

  }),
}))

const CategoryMenuCard: React.FC<CategoryMenuCardProps> = (props) => {
  const classes = useStyles(props)
  //alert("CategoryMenuCard " + props.contextData.categories)
  // const megaMenu: any = {
  //   MegaMenu1,
  //   MegaMenu2,
  // }

  //console.log("categories " + JSON.stringify(props.contextData.categories, null, 2));
  return (
    <Box className={classes.root}>

      <CategoryMenuItem
          title={localStrings.allCategories}
          href={"/product/shop/all"}
          icon={"/assets/images/icons/icons8-four-squares-48.png"}
          caret={false}
      >
        {/*<MegaMenu data={item.menuData || {}} />*/}
      </CategoryMenuItem>


      {/*<p>TOTO</p>*/}
      {/*<p>{props.contextData ? JSON.stringify(props.contextData) : "NO contextData"}</p>*/}



      {/*<p>{props.contextData.categories.map(cat => cat.category)}</p>*/}
      {/*<p>{JSON.stringify(filterCat(props.contextData.categories, props.contextData.products, props.contextData.deals))}</p>*/}

      {props.contextData && filterCat(props.contextData.categories, props.contextData.products, props.contextData.deals).map((item) => {
        //let MegaMenu = megaMenu[item.menuComponent]
        let icon = "";
        if (item.files && item.files.length > 0) {
          icon = item.files[0].url;
        }

        return (
          <CategoryMenuItem
            title={item.category}
            href={"/product/shop/" + convertCatName(item.category)}
            icon={icon}
            caret={false}
            key={item.category}
          >
            {/*<MegaMenu data={item.menuData || {}} />*/}
          </CategoryMenuItem>
        )
      })}
    </Box>
  )
}

CategoryMenuCard.defaultProps = {
  position: 'absolute',
}

export default CategoryMenuCard
