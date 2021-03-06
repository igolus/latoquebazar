import {Box, MenuItem} from '@material-ui/core'
import ChevronRight from '@material-ui/icons/ChevronRight'
import {makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import Link from 'next/link'
import React from 'react'
import BazarImage from "@component/BazarImage";

interface CategoryMenuItemProps {
  href: string
  icon?: any
  title: string
  caret?: boolean
}

const useStyles = makeStyles(({ palette }: MuiThemeProps) => ({
  root: {
    '& .category-dropdown-link': {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '0px 1rem',
      height: 40,
      minWidth: '278px',
      whiteSpace: 'pre',
      transition: 'all 250ms ease-in-out',

      '& .title': {
        paddingLeft: '0.75rem',
        flexGrow: 1,
      },
    },

    '&:hover': {
      '& > .category-dropdown-link': {
        color: palette.primary.main,
        background: palette.primary.light,
      },

      '& > .mega-menu': {
        display: 'block',
      },
    },
  },
  // small: {
  //   width: spacing(3),
  //   height: spacing(3),
  // },

}))

const CategoryMenuItem: React.FC<CategoryMenuItemProps> = ({
  href,
  title,
  caret,
  children,
  ...rest
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Link href={href}>
        <MenuItem className="category-dropdown-link">
          {/*{rest.icon && <rest.icon fontSize="small" color="inherit" />}*/}
          {rest.icon && <BazarImage width={35} src={rest.icon}/>}
          <span className="title">{title}</span>
          {caret && <ChevronRight fontSize="small" />}
        </MenuItem>
      </Link>
      {children}
    </Box>
  )
}

CategoryMenuItem.defaultProps = {
  caret: false,
}

export default CategoryMenuItem
