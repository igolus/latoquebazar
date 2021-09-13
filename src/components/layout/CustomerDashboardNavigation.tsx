import FlexBox from '@component/FlexBox'
import CustomerService from '@component/icons/CustomerService'
import { Typography } from '@material-ui/core'
import CreditCard from '@material-ui/icons/CreditCard'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Person from '@material-ui/icons/Person'
import Place from '@material-ui/icons/Place'
import ShoppingBagOutlined from '@material-ui/icons/ShoppingBagOutlined'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { DashboardNavigationWrapper, StyledDashboardNav } from './DashboardStyle'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";

const CustomerDashboardNavigation = () => {
  const { pathname } = useRouter()
  const {orderCount, dbUser} = useAuth()
  return (

    <>
      {dbUser &&
      <DashboardNavigationWrapper sx={{px: '0px', pb: '1.5rem', color: 'grey.900'}}>
        {linkList.map((item, key) => (
            <Fragment key={key}>
              {item.title &&
              <Typography p="26px 30px 1rem" color="grey.600" fontSize="12px">
                {item.title}
              </Typography>
              }
              {item.list.map((item, key) => (
                  <StyledDashboardNav
                      isCurrentPath={pathname.includes(item.href)}
                      href={item.href}
                      key={item.title}
                  >
                    <FlexBox alignItems="center">
                      <item.icon
                          className="nav-icon"
                          fontSize="small"
                          color="inherit"
                          sx={{mr: '10px'}}
                      />

                      <span>{item.title}</span>
                    </FlexBox>
                    {key === 0 &&
                    <span>{orderCount}</span>
                    }
                  </StyledDashboardNav>
              ))}
            </Fragment>
        ))}
      </DashboardNavigationWrapper>
      }
    </>
  )
}

const linkList = [
  {
    title: " ",
    list: [
      {
        href: '/orders',
        title: localStrings.orders,
        icon: ShoppingBagOutlined,
        //count: 5,
      },
      {
        href: '/profile',
        title: localStrings.profileInformation,
        icon: Person,
      },
      {
        href: '/address',
        title: localStrings.myAddresses,
        icon: Place,
      },
      // {
      //   href: '/wish-list',
      //   title: 'Wishlist',
      //   icon: FavoriteBorder,
      //   count: 19,
      // },
      // {
      //   href: '/support-tickets',
      //   title: 'Support Tickets',
      //   icon: CustomerService,
      //   count: 1,
      // },
    ],
  },
  // {
  //   title: localStrings.myAccount,
  //   list: [
  //     {
  //       href: '/profile',
  //       title: localStrings.profileInformation,
  //       icon: Person,
  //       count: 3,
  //     },
  //   ],
  // },
]

export default CustomerDashboardNavigation
