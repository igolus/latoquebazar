import React, {
  createContext,
  useEffect,
  useReducer
} from 'react';
import firebase from '../lib/firebase';
import SplashScreen from "../components/SplashScreen";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import localStrings from "../localStrings";
import {CURRENCY_EUR} from "../utils/Currencies";
import {useToasts} from "react-toast-notifications";
import {executeQueryUtil, executeQueryUtilSync} from "../apolloClient/gqlUtil";
import {getSiteUserByIdQuery} from "../gql/siteUserGql";
import moment from "moment";

const CURRENCY = 'CURRENCY';
const BRAND = 'BRAND';
const DB_USER = 'DB_USER';
const USER = 'USER';
const ESTABLISHMENT = 'ESTABLISHMENT';
const AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGED';

const initialAuthState = {
  loginDone: false,
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  siteName: null,
  wantedUrl: null,
  jsonStyle: null,
  brand: null,
  dbUser: null,
  establishment: null,
  sortCategory: null,
  sortTags: [],
  sortOption: null,
  language: localStrings.getLanguage(),
  currency: CURRENCY_EUR,
  totalCartPrice: -1,
  globalProductVariants: null
};

const config = require('../conf/config.json');

const reducer = (state, action) => {
  switch (action.type) {

    case AUTH_STATE_CHANGE: {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }

    case USER: {
      const { user } = action.payload;
      return {
        ...state,
        user: user
      };
    }

    case BRAND: {
      const { brand } = action.payload;
      return {
        ...state,
        brand: brand
      };
    }

    case DB_USER: {
      const { dbUser } = action.payload;
      return {
        ...state,
        dbUser: dbUser
      };
    }

    case ESTABLISHMENT: {
      const { establishment } = action.payload;
      return {
        ...state,
        establishment: establishment
      };
    }

    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'FirebaseAuth',
  productValue: null,
  productLoading: null,
  productError: null,
  sortCategory: null,

  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  sendEmailVerification: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getDbUser: () => {},
  setDbUser: () => {},

  getCurrency: () => {},
  setCurrency: () => {},

  currentBrand: () => {},
  getBrandId: () => {},
  currentEstablishment: () => {},
  setEstablishment: () => {},

});

export const AuthProvider = ({ children }) => {

  firebase.auth().useDeviceLanguage();
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const { addToast } = useToasts();

  const createUserWithEmailAndPassword = async (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const sendEmailVerification = async () => {
    var user = firebase.auth().currentUser;
    if (user) {
      var ret = user.sendEmailVerification();
      addToast(localStrings.formatString(
          localStrings.notif.activationEmailSentNotif, user.email), {
        appearance: "success",
        autoDismiss: true
      });
      return ret;
    }
    return null;
  };

  const resetPassword = async (emailAddress) => {
    firebase.auth().sendPasswordResetEmail(emailAddress);

    addToast(localStrings.formatString(
        localStrings.notif.passwordResetEmailSentNotif, emailAddress), {
      appearance: "success",
      autoDismiss: true
    });
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const logout = async () => {
    await setDbUser(null);
    currentUser()
    //setLoginDone(false)
    return firebase.auth().signOut();

    dispatch({
      type: AUTH_STATE_CHANGE,
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
  };

  const getDbUser = () => {
    return state.dbUser;
  }

  const setDbUser = async (dbUser, phoneNumber) => {
    dispatch({
      type: DB_USER,
      payload: {
        dbUser: dbUser,
      }
    });
  }

  function getCurrency() {
    return state.currency;
  }

  function setCurrency(currency) {
    dispatch({
      type: CURRENCY,
      payload: {
        currency: currency,
      }
    });
  }

  const currentBrand = () => {
    return state.brand;
  }

  const getBrandId = () => {
    return config.brandId;
  }

  const setBrand = async (brand) => {
    dispatch({
      type: BRAND,
      payload: {
        brand: brand,
      }
    });
  }

  const currentEstablishment = () => {
    return state.establishment;
  }

  const setEstablishment = async (establishment) => {
    dispatch({
      type: ESTABLISHMENT,
      payload: {
        establishment: establishment,
      }
    });
  }

  const currentUser = () => {
    var user = firebase.auth().currentUser;
    return user;
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Here you should extract the complete user profile to make it available in your entire app.
        // The auth state only provides basic information.
        console.log("User" + JSON.stringify(user, null, 2))

        let token = await firebase.auth().currentUser.getIdToken(true)
        localStorage.setItem("authToken", token)
        localStorage.setItem("genTimeToken", moment().unix())

        executeQueryUtilSync(getSiteUserByIdQuery(getBrandId(), user.uid)).then(result => {
          setDbUser(result.data.getSiteUser);
        });

        dispatch({
          type: AUTH_STATE_CHANGE,
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL,
              email: user.email,
              name: user.displayName || user.email,
              tier: 'Premium'
            }
          }
        });
      } else {
        dispatch({
          type: AUTH_STATE_CHANGE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  // if (!state.isInitialised) {
  //   return <SplashScreen />;
  // }

  return (
      <AuthContext.Provider
          value={{

            ...state,
            method: 'FirebaseAuth',
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            sendEmailVerification,
            resetPassword,
            signInWithGoogle,
            logout,
            getDbUser,
            setDbUser,

            getCurrency,
            setCurrency,

            currentBrand,
            getBrandId,
            setBrand,

            currentEstablishment,
            setEstablishment,

            currentUser,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export default AuthContext;
