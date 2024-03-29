import {getFullNameProduct} from "../../src/util/cartUtil";

export const pageview = (url, gid) => {
  if (process.env.NODE_ENV === 'production') {
    window.gtag('config', gid, {
      page_path: url,
    })
  }

}

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params)
}

export const gaAddToCart = (id, name, qte, price, brand) => {
  if (process.env.NODE_ENV !== 'production' || analyticsNoSet(brand)) {
    return;
  }
  let items = {
    "items": [
      {
        "id": id,
        "name": name,
        "quantity": qte,
        "price": price
      }
    ]

  };
  console.log("gaAddToCart " + JSON.stringify(items, null, 2))
  window.gtag('event', 'add_to_cart', items)
}

export const gaRemoveFromCart = (id, name, qte, price, brand) => {
  if (process.env.NODE_ENV !== 'production' || analyticsNoSet(brand)) {
    return;
  }
  let items = {
    "items": [
      {
        "id": id,
        "name": name,
        "quantity": qte,
        "price": price
      }
    ]

  };
  console.log("gaRemoveFromCart " + JSON.stringify(items, null, 2))
  window.gtag('event', 'remove_from_cart', items)
}

function getItemsGa(orderInCreation) {
  let items = [];

  let itemsStandard = orderInCreation?.order?.items || [];
  itemsStandard.forEach(item => {
    items.push({
      id: item.id,
      quantity: item.quantity,
      name: getFullNameProduct(item.productName, item.name),
      price: item.price
    })
  })

  let itemsDeal = orderInCreation?.order?.deals || [];
  itemsDeal.forEach(deal => {
    items.push({
      id: deal.deal.id,
      quantity: deal.deal.quantity,
      name: deal.deal.name,
      price: deal.deal.price
    })
  })
  return items;
}

function analyticsNoSet(brand) {
  return !brand?.config?.analyticsGoogleId || brand?.config?.analyticsGoogleId === "";
}

export const gaCheckout = (orderInCreation, brand) => {
  if (process.env.NODE_ENV !== 'production' || analyticsNoSet(brand)) {
    return;
  }
  let items = getItemsGa(orderInCreation);

  let itemForGa = {
    "items": items,
  }

  console.log("gaCheckout " + JSON.stringify(itemForGa, null, 2))
  window.gtag('event', 'begin_checkout', itemForGa)
}

export const gaPurchase = (order, brand) => {
  //brand?.config?.analyticsGoogleId
  if (process.env.NODE_ENV !== 'production'|| analyticsNoSet(brand)) {
    return;
  }
  let items = getItemsGa(order);

  let itemForGa = {
    "transaction_id": order.id,
    "value": 23.07,
    "currency": "EUR",
    "items": items,
  }

  console.log("gaPurchase " + JSON.stringify(itemForGa, null, 2))
  window.gtag('event', 'purchase', itemForGa)
}