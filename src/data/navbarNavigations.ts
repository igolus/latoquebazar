import localStrings from "../localStrings";

const navbarNavigations = (dbUser, extraPages) => {

  function getItems() {
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

  if (extraPages && extraPages.length > 0) {
    let firstPage = extraPages.find(page => page.id === "1" && page.active);
    let secondPage = extraPages.find(page => page.id === "2" && page.active);
    let thirdPage = extraPages.find(page => page.id === "3" && page.active);
    let currentIndex = 2;
    if (firstPage) {
      items.splice(currentIndex, 0, getPathFromPage(firstPage));
      currentIndex++;
    }
    if (secondPage) {
      items.splice(currentIndex, 0, getPathFromPage(secondPage));
      currentIndex++;
    }
    if (thirdPage) {
      items.splice(currentIndex, 0, getPathFromPage(thirdPage));
      currentIndex++;
    }
  }
  //if (dbUser) {
    items.push({
      title: localStrings.profilePageTitle,
      url: '/profile',
      regExpMatch: '\/orders|\/profile|\/address'
      // child: [
      //   {
      //     title: localStrings.myOrders,
      //     url: '/orders'
      //   },
      //   {
      //     title: localStrings.myAccount,
      //     url: '/profile'
      //   },
      //   {
      //     title: localStrings.myAddresses,
      //     url: '/address'
      //   }
      // ]
    })
  // }
  // else {
  //   items.push({
  //     title: localStrings.profilePageTitle,
  //     url: '/profile',}
  //   )
  // }
  return items;
}

export default navbarNavigations
