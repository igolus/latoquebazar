import {Box, Container} from '@material-ui/core'
import React, {ReactNode} from 'react'
import CategorySectionHeader from './CategorySectionHeader'

export interface CategorySectionCreatorProps {
  icon?: ReactNode
  title?: string
  seeMoreLink?: string
  seeMoreTitle?: string
  marginBottom?: number
}

const CategorySectionCreator: React.FC<CategorySectionCreatorProps> = ({
  icon,
  seeMoreLink,
  seeMoreTitle,
  title,
  children,
  marginBottom
}) => {
  return (
    <Box mb={marginBottom || 7.5}>
      <Container sx={{ pb: '1rem' }}>
        {title && (
          <CategorySectionHeader
            title={title}
            seeMoreLink={seeMoreLink}
            icon={icon}
            seeMoreTitle={seeMoreTitle}
          />
        )}

        {children}
      </Container>
    </Box>
  )
}

export default CategorySectionCreator
