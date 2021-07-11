import NavLink, {NavLinkProps} from '@component/nav-link/NavLink'
import {styled} from '@material-ui/core/styles'
import React from 'react'
import {Paragraph} from "@component/Typography";


type StyledCategoryNavProps = {
  isSelected: boolean
  title: string
  id: string
}

export const StyledCategory = styled<
  React.FC<StyledCategoryNavProps & NavLinkProps>
>(({ title, id, ...rest }) => (
    <NavLink {...rest}>{title}</NavLink>
))<StyledCategoryNavProps>(({ theme, isSelected }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderLeft: '4px solid',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  marginBottom: '1.25rem',
  borderColor: isSelected ? theme.palette.primary.main : 'transparent',

  '& .nav-icon': {
    color: isSelected ? theme.palette.primary.main : theme.palette.grey[600],
  },

  '&:hover': {
    borderColor: theme.palette.primary.main,

    '& .nav-icon': {
      color: theme.palette.primary.main,
    },
  },
}))
