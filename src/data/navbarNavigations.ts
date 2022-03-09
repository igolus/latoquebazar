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
        id: "contactInfo",
      },

      {
        title: localStrings.cartPageTitle,
        url: '/cart',
      },
    ]
  }


  let items = getItems();

  function getPathFromPage(page: any) {
    return {
      title: page.title,
      url: '/specialPage/' + page.id
    } ;
  }

  if (extraPages && extraPages.length > 0) {
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
  items.push({
    title: localStrings.profilePageTitle,
    url: '/profile',
    regExpMatch: '\/orders|\/profile|\/address'
  })
  return items;
}

export default navbarNavigations
