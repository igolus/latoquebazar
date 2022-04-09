import FlexBox from '@component/FlexBox'
import Sidenav from '@component/sidenav/Sidenav'
import {H2} from '@component/Typography'
import useWindowSize from '@hook/useWindowSize'
import {styled} from '@material-ui/core/styles'
import Menu from '@material-ui/icons/Menu'
import {Box} from '@material-ui/system'
import React from 'react'
import {DashboardNavigationWrapper} from './DashboardStyle'
import CustomerDashboardNavigation from "@component/layout/CustomerDashboardNavigation";

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',

  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(3),
  '& .headerHold': {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  [theme.breakpoints.up('md')]: {
    '& .sidenav': {
      display: 'none',
    },
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    '& .headerHold': {},
  },
}))

export interface DashboardPageHeaderProps {
  icon?: any
  title?: string
  button?: any
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  title,
  button,
  ...props
}) => {
  const width = useWindowSize()
  const isTablet = width < 1025

  return (
    <StyledBox>
      <FlexBox mt={2} className="headerHold">
        <FlexBox alignItems="center">
          {props.icon && <props.icon color="primary" />}
          <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
            {title}
          </H2>
        </FlexBox>

        <Box className="sidenav">
          <Sidenav profileSideBar position="left" handle={<Menu fontSize="small" />}>
            <DashboardNavigationWrapper>
              <CustomerDashboardNavigation/>

            </DashboardNavigationWrapper>
          </Sidenav>
        </Box>

        {!isTablet && button}
      </FlexBox>

      {isTablet && !!button && <Box mt={2}>{button}</Box>}
    </StyledBox>
  )
}

export default DashboardPageHeader
