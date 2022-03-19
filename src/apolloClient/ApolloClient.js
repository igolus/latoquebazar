import {ApolloClient, InMemoryCache} from '@apollo/client';
import ApolloLinkTimeout from 'apollo-link-timeout';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from '@apollo/client/link/context';
import firebase from '../lib/firebase';
import moment from 'moment';

const config = require('../conf/config.json')

const timeoutLink = new ApolloLinkTimeout(150000); // 10 second timeout

const httpLink = createHttpLink({
  uri: config.graphQlUrl,
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  const genTimeToken = localStorage.getItem('genTimeToken');

  if (moment().unix() - parseInt(genTimeToken) > 60 * 30) {
    //alert("regenerate token");
    if (firebase.auth().currentUser) {
      let newToken = await firebase.auth().currentUser.getIdToken(true);
      localStorage.setItem("authToken", newToken);
    }
  }

  localStorage.setItem("genTimeToken", moment().unix())

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const defaultOptionsNoCache = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const timeoutHttpLink = timeoutLink.concat(httpLink);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getSiteUser(_, { args, toReference }) {
          return toReference({
            __typename: 'SiteUser',
            id: args.siteUserId,
          });
        },

        getProductByProductId(_, { args, toReference }) {
          return toReference({
            __typename: 'Product',
            id: args.productId,
          });
        },

        getOptionListByOptionListIdQuery(_, { args, toReference }) {
          return toReference({
            __typename: 'ProductOptionList',
            id: args.productOptionListId,
          });
        },

        getDealByDealId(_, { args, toReference }) {
          return toReference({
            __typename: 'Deal',
            id: args.dealId,
          });
        },

        getChargeByChargeId(_, { args, toReference }) {
          return toReference({
            __typename: 'Charge',
            id: args.chargeId,
          });
        },

        getDiscountByDiscountId(_, { args, toReference }) {
          return toReference({
            __typename: 'Discount',
            id: args.discountId,
          });
        },
      }
    }
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(timeoutHttpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptionsNoCache,
    //cache: cache,
});

// const apolloClientNoCache = new ApolloClient({
//   link: authLink.concat(timeoutHttpLink),
//   cache: cache,
// });

export default apolloClient
