import localStrings from "../localStrings";

const navbarNavigations = (dbUser, extraPages) => {

  function getItems() {
    return [
    {
      title: localStrings.homePageTitle,
      url: '/',
    },
    // {
    //   title: 'Grocery',
    //   url: '/home-2',
    // },
    //{
    // title: 'Pages',
    // child: [
    // {
    //   title: 'Sale Page',
    //   child: [
    //     {
    //       title: 'Version 1',
    //       url: '/sale-page-1',
    //     },
    //     {
    //       title: 'Version 2',
    //       url: '/sale-page-2',
    //     },
    //   ],
    // },
    // {
    //   title: 'Vendor',
    //   child: [
    //     {
    //       title: 'All vendors',
    //       url: '/shops',
    //     },
    //     {
    //       title: 'Vendor store',
    //       url: '/shop/34324',
    //     },
    //   ],
    // },
    // {
    //   title: localStrings.shopPageTitle,
    //   child: [
    //     {
    //       title: 'Search product',
    //       url: '/product/search/mobile phone',
    //     },
    //     {
    //       title: 'Single product',
    //       url: '/product/34324321',
    //     },
    //     {
    //       title: 'Cart',
    //       url: '/cart',
    //     },
    //     {
    //       title: 'Checkout',
    //       url: '/checkout',
    //     },
    //     {
    //       title: 'Alternative Checkout',
    //       url: '/checkout-alternative',
    //     },
    //   ],
    // },
    //   ],
    // },
    // {
    //   title: 'User Account',
    //   child: [
    //     {
    //       title: 'Orders',
    //       child: [
    //         {
    //           title: 'Order List',
    //           url: '/orders',
    //         },
    //         {
    //           title: 'Order Details',
    //           url: '/orders/5452423',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Profile',
    //       child: [
    //         {
    //           title: 'View Profile',
    //           url: '/profile',
    //         },
    //         {
    //           title: 'Edit Profile',
    //           url: '/profile/edit',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Address',
    //       child: [
    //         {
    //           title: 'Address List',
    //           url: '/address',
    //         },
    //         {
    //           title: 'Add Address',
    //           url: '/address/512474',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Support tickets',
    //       child: [
    //         {
    //           title: 'All tickets',
    //           url: '/support-tickets',
    //         },
    //         {
    //           title: 'Ticket details',
    //           url: '/support-tickets/512474',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Wishlist',
    //       url: '/wish-list',
    //     },
    //   ],
    // },
    // {
    //   title: 'Vendor Account',
    //   child: [
    //     {
    //       title: 'Dashboard',
    //       url: '/vendor/dashboard',
    //     },
    //     {
    //       title: 'Products',
    //       child: [
    //         {
    //           title: 'All products',
    //           url: '/vendor/products',
    //         },
    //         {
    //           title: 'Add/Edit product',
    //           url: '/vendor/products/248104',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Orders',
    //       child: [
    //         {
    //           title: 'All orders',
    //           url: '/vendor/orders',
    //         },
    //         {
    //           title: 'Order details',
    //           url: '/vendor/orders/248104',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Profile',
    //       url: '/vendor/account-settings',
    //     },
    //   ],
    // },
    // {
    //   title: 'Track My Orders',
    //   url: '/orders',
    // },
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
  if (dbUser) {
    items.push({
      title: localStrings.profilePageTitle,
      child: [
        {
          title: localStrings.myOrders,
          url: '/orders'
        },
        {
          title: localStrings.myAccount,
          url: '/profile'
        },
        {
          title: localStrings.myAddresses,
          url: '/address'
        }
      ]
    })
  }
  return items;
}

export default navbarNavigations
