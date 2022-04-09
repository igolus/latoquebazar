import localStrings from "../localStrings";
import {MenuItem} from "@material-ui/core";
import Link from "next/link";
import React from "react";

const navbarNavigations = (dbUser, extraPages, profileSideBar) => {

  function getItems() {
    if (profileSideBar) {


      // <MenuItem>
      //     <Link href={"/profile"}>
      // {localStrings.myAccount}
      // </Link>
      // </MenuItem>
      // <MenuItem>
      // <Link href={"/orders"}>
      // {localStrings.myOrders}
      // </Link>
      // </MenuItem>
      // <MenuItem>
      // <Link href={"/address"}>
      //     {localStrings.myAddresses}
      //     </Link>
      //     </MenuItem>
      //     <MenuItem onClick={handleLogout}>
      //     {localStrings.logout}
      //     </MenuItem>
      return [
        {
          title: localStrings.myAccount,
          url: '/profile',
        },
        {
          title: localStrings.myOrders,
          url: '/orders',
        },
        {
          title: localStrings.myAddresses,
          url: '/address',
        },
      ]
    }

    return [
      {
        title: localStrings.homePageTitle,
        url: '/',
      },
      {
        title: localStrings.shopPageTitle,
        url: '/product/shop/all',
        regExpMatch: '\/product\/shop(.*)'
      },

      {
        title: localStrings.contactInfoPageTitle,
        url: '/contactInfo',
        id: "contactInfo",
      },

      {
        title: localStrings.cartPageTitle,
        url: '/cart',
      },
      // {
      //   title: 'Back to Demos',
      //   url: '/landing',
      // },
      // {
      //   title: "Documentation",
      //   url:
      //     "https://docs.google.com/document/d/13Bnyugzcty75hzi9GdbVh01YV75a7AhViZws0qGf5yo/edit?usp=sharing",
      //   extLink: true,
      // },
    ]
  }


  let items = getItems();

  function getPathFromPage(page: any) {
    return {
      title: page.title,
      url: '/specialPage/' + page.id
    };
  }

  if (!profileSideBar && extraPages && extraPages.length > 0) {
    let firstPage = extraPages.find(page => page.id === "1" && page.active);
    let secondPage = extraPages.find(page => page.id === "2" && page.active);
    let thirdPage = extraPages.find(page => page.id === "3" && page.active);
    let currentIndex = 2;
    if (firstPage && !firstPage.displayInUtil) {
      items.splice(currentIndex, 0, getPathFromPage(firstPage));
      currentIndex++;
    }
    if (secondPage && !secondPage.displayInUtil) {
      items.splice(currentIndex, 0, getPathFromPage(secondPage));
      currentIndex++;
    }
    if (thirdPage && !thirdPage.displayInUtil) {
      items.splice(currentIndex, 0, getPathFromPage(thirdPage));
      currentIndex++;
    }
  }
  //if (dbUser) {
  if (!profileSideBar) {
    items.push({
      title: localStrings.profilePageTitle,
      url: '/profile',
      regExpMatch: '\/orders|\/profile|\/address'
    })
  }
  return items;
}

export default navbarNavigations
