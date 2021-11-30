import React, {createContext, useEffect, useReducer, useState} from 'react';
import firebase from '../lib/firebase';
import localStrings from "../localStrings";
import {CURRENCY_EUR} from "../util/Currencies";
import {useToasts} from "react-toast-notifications";
import filterDataGql, {executeQueryUtil, executeQueryUtilSync} from "../apolloClient/gqlUtil";
import '@firebase/messaging';
import {getSiteUserByIdQuery} from "../gql/siteUserGql";
import moment from "moment";
import {establishmentsQuery} from "../gql/establishmentGql";
import {getBrandByIdQuery} from "../gql/brandGql";
import {BRAND_COLLECTION, ORDER_DELIVERY_MODE_DELIVERY, RELOAD_COLLECTION} from "../util/constants"
import {makeStyles} from "@material-ui/styles";
import {getActivationMailLink, getResetMailLink, sendMailMessage} from "../util/mailUtil";
import {getCustomerOrdersOnlyIdQuery} from "../gql/orderGql";
import cloneDeep from "clone-deep";
import {processOrderCharge, processOrderInCreation} from "../util/cartUtil";
import {getCurrentService} from "@component/form/BookingSlots";
import {Button, Dialog, DialogActions, DialogContent} from "@material-ui/core";
import Router from 'next/router'
import {getBrandCurrency} from "../util/displayUtil";
import {getContextData, getContextDataApollo, getStaticPropsUtil, sortChainList} from "../nextUtil/propsBuilder";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {getBookingSlotsOccupancyQueryNoApollo} from "../gqlNoApollo/bookingSlotsOccupancyGqlNoApollo";
import {getProductsByIdQuery} from "../gql/productGql";
import {getOptionListByOptionListIdQuery} from "../gql/productOptionListGql";
import {getCategoriesByIdQuery} from "../gql/productCategoryGql";

const CURRENCY = 'CURRENCY';
const BOOKING_SLOT_START_DATE = 'BOOKING_SLOT_START_DATE';
const BRAND = 'BRAND';
const BRAND_ID = 'BRAND_ID';
const DB_USER = 'DB_USER';
const USER = 'USER';
const ESTABLISHMENT = 'ESTABLISHMENT';
const ESTABLISHMENT_LIST = 'ESTABLISHMENT_LIST';
const AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGED';
const ORDER_IN_CREATION = 'ORDER_IN_CREATION';
const DEAL_EDIT = 'DEAL_EDIT';
const MAX_DISTANCE_REACHED = 'MAX_DISTANCE_REACHED';
const LOGIN_DIALOG_OPEN = 'LOGIN_DIALOG_OPEN';
const LOGIN_ON_GOING = 'LOGIN_ON_GOING';
const JUST_CREATED_ORDER = 'JUST_CREATED_ORDER';
const ORDER_COUNT = 'ORDER_COUNT';
const GLOBAL_DIALOG = 'GLOBAL_DIALOG';
const CONTEXT_DATA = 'CONTEXT_DATA';

const encKey = 'dcb21c08-03ed-4496-b67e-94202038a07d';
var encryptor = require('simple-encryptor')(encKey);

const useStyles = makeStyles(() => ({
  dialogContent: {
    paddingBottom: '1.25rem',
  },
}))

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
  establishmentList: [],
  sortCategory: null,
  sortTags: [],
  sortOption: null,
  language: localStrings?.getLanguage() || "fr",
  currency: CURRENCY_EUR,
  totalCartPrice: -1,
  globalProductVariants: null,
  dealEdit: null,
  // orderInCreation: {
  //   deliveryMode: ORDER_DELIVERY_MODE_DELIVERY,
  //   order: {
  //     items: [],
  //     deals: []
  //   },
  //   customer: null,
  //   payments: null,
  //   deliveryAddress: null,
  //   bookingSlot: null,
  //   additionalInfo: null,
  // },
  bookingSlotStartDate: moment(),
  maxDistanceReached: false,
  loginDialogOpen: false,
  justCreatedOrder: null,
  loginOnGoing: false,
  orderCount: 0,
  brandId: 0,
  globalDialog: null,
  contextData: null,
};

const firebaseConfig = {
  apiKey: "AIzaSyDKBt5pdqJ5K3qMZXc4v_HnUxAChI9WSyU",
  authDomain: "latoque-b23f1.firebaseapp.com",
  databaseURL: "https://latoque-b23f1.firebaseio.com",
  projectId: "latoque-b23f1",
  storageBucket: "latoque-b23f1.appspot.com",
  messagingSenderId: "399587571823",
  appId: "1:399587571823:web:f46e56774ddfe1a886759a",
  measurementId: "G-9YPCFBQH7Z"
};

// admin.initializeApp({
//   credential: admin.credential.cert(require('./latoque-b23f1-firebase-adminsdk-o5hes-e83acaf80e.json'))
// });

//const db = firebase.firestore();

// const admin = require('firebase-admin');
// admin.initializeApp(firebaseConfig);
// const db = admin.firestore();

//admin.initializeApp(firebaseConfig);
//const db = admin.firestore();

const config = require('../conf/config.json');
const reducer = (state, action) => {
  switch (action.type) {

    case GLOBAL_DIALOG: {
      const { globalDialog } = action.payload;
      return {
        ...state,
        globalDialog: globalDialog
      };
    }

    case CONTEXT_DATA: {
      const { contextData } = action.payload;
      return {
        ...state,
        contextData: contextData
      };
    }

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

    case ESTABLISHMENT_LIST: {
      const { establishmentList } = action.payload;
      return {
        ...state,
        establishmentList: establishmentList
      };
    }

    case ORDER_IN_CREATION: {
      const { orderInCreation } = action.payload;
      return {
        ...state,
        orderInCreation: orderInCreation,
      };
    }

    case DEAL_EDIT: {
      const { dealEdit } = action.payload;
      return {
        ...state,
        dealEdit: dealEdit,
      };
    }

    case BOOKING_SLOT_START_DATE: {
      const { bookingSlotStartDate } = action.payload;
      return {
        ...state,
        bookingSlotStartDate: bookingSlotStartDate,
      };
    }

    case MAX_DISTANCE_REACHED: {
      const { maxDistanceReached } = action.payload;
      return {
        ...state,
        maxDistanceReached: maxDistanceReached,
      };
    }

    case LOGIN_DIALOG_OPEN: {
      const { loginDialogOpen } = action.payload;
      return {
        ...state,
        loginDialogOpen: loginDialogOpen,
      };
    }

    case LOGIN_ON_GOING: {
      const { loginOnGoing } = action.payload;
      return {
        ...state,
        loginOnGoing: loginOnGoing,
      };
    }

    case JUST_CREATED_ORDER: {
      const { justCreatedOrder } = action.payload;
      return {
        ...state,
        justCreatedOrder: justCreatedOrder,
      };
    }

    case ORDER_COUNT: {
      const { orderCount } = action.payload;
      return {
        ...state,
        orderCount: orderCount,
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
  signInWithFaceBook: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getDbUser: () => {},
  setDbUser: () => {},

  getCurrency: () => {},
  setCurrency: () => {},

  // bookingSlotStartDate: () => {},
  setBookingSlotStartDate: () => {},

  currentBrand: () => {},
  getBrandId: () => {},
  currentEstablishment: () => {},
  setEstablishment: () => {},

  setOrderInCreation: () => {},
  getOrderInCreation: () => {},
  resetOrderInCreation: () => {},

  setMaxDistanceReached:() => {},

  setDealEdit: () => {},

  setLoginDialogOpen: () => {},
  setLoginOnGoing: () => {},

  setJustCreatedOrder: () => {},

  increaseOrderCount: () => {},

  setGlobalDialog: () => {},
  resetGlobalDialog: () => {},

  setContextDataAuth: () => {},
  getContextDataAuth: () => {},

  setRedirectPageGlobal: () => {},
});

const expireTimeSeconds = 1800;
export const reloadId = "1";

const categoryType= "category";
const productType= "product";
const dealType= "deal";
const tagType= "tag";
const optionType= "option";
const brandType= "brand"
const updateAction= "update";
const deleteAction= "delete";
const createAction= "create";

export const AuthProvider = ({ children }) => {
  const [contextDataState, setContextDataState] = useState(null)

  function updateItem(dataType, getFunc, res, contextDataParam) {
    if (!contextDataParam) {
      return;
    }
    let contextCopy = cloneDeep(contextDataParam);
    let index = contextCopy[dataType].findIndex(item => item.id === getFunc(res).id);

    console.log("index " + index);
    //console.log(" contextCopy[dataType] " + JSON.stringify(contextCopy[dataType]));
    console.log(" contextCopy[dataType].length " + contextCopy[dataType].length);
    //console.log("getFunc(res) " + JSON.stringify(getFunc(res)));
    if (getFunc(res) && index!==-1) {
      contextCopy[dataType].splice(index, 1, getFunc(res))
    }
    else {
      return;
    }
    console.log(" contextCopy[dataType] " + JSON.stringify(contextCopy[dataType]));
    console.log(" contextCopy[dataType].length " + contextCopy[dataType].length);

    //contextCopy[dataType] = sortChainList(contextCopy[dataType])

    setContextDataAuth(contextCopy);
  }

  function deleteItem(dataType, contextDataParam, id) {

    if (!contextDataParam) {
      return;
    }
    let contextCopy = cloneDeep(contextDataParam);
    let index = contextCopy[dataType].findIndex(item => item.id === id);

    if (index !== -1) {
      contextCopy[dataType].splice(index, 1)
    }
    else {
      return;
    }

    contextCopy[dataType] = sortChainList(contextCopy[dataType])

    setContextDataAuth(contextCopy, true);
  }

  function createItem(dataType, getFunc, res, contextDataParam) {
    console.log("CreateItem " + dataType)
    console.log("state.contextData " + contextDataParam);

    if (!contextDataParam) {
      return;
    }
    let contextCopy = cloneDeep(contextDataParam);
    if (getFunc(res)) {
      contextCopy[dataType].push(getFunc(res))
      //contextCopy[dataType].splice(index, 1, getFunc(res))
    }
    contextCopy[dataType] = sortChainList(contextCopy[dataType])

    setContextDataAuth(contextCopy, true);
  }

  function reloadContext(reload, contextDataParam) {
    if (!reload) {
      return;
    }
    // console.log("reloadContext " + JSON.stringify(reload))
    // console.log("contextDataP " + contextDataParam)
    const id = reload.id;
    if (!id) {
      return;
    }
    if (reload.dataType === productType) {
      if (reload.actionType === updateAction) {
        executeQueryUtilSync(getProductsByIdQuery(config.brandId, id)).then(res => {
          // console.log("update product")
          //console.log("res " + JSON.stringify(res));
          updateItem("products", res => {
            return ({
              ...res.data.getProductByProductId,
              type: "product"
            })
          }, res, contextDataParam);
        })
      }
      if (reload.actionType === createAction) {
        executeQueryUtilSync(getProductsByIdQuery(config.brandId, id)).then(res => {
          // console.log("create product")
          //console.log("res " + JSON.stringify(res));
          createItem("products", res => {
                return ({
                  ...res.data.getProductByProductId,
                  type: "product"
                })
              },
              res, contextDataParam);
        })
      }
      if (reload.actionType === deleteAction) {
        console.log("delete product")
        deleteItem("products", contextDataParam, reload.id)
      }
    }

    if (reload.dataType === categoryType) {
      if (reload.actionType === updateAction) {
        executeQueryUtilSync(getCategoriesByIdQuery(config.brandId, id)).then(res => {
          console.log("update cat")
          //console.log("res " + JSON.stringify(res));
          updateItem("categories", res => res.data.getProductCategoryByCategoryId, res, contextDataParam);
        })
      }
      if (reload.actionType === createAction) {
        executeQueryUtilSync(getCategoriesByIdQuery(config.brandId, id)).then(res => {
          console.log("create cat ")
          //console.log("res " + JSON.stringify(res));
          createItem("categories", res => res.data.getProductCategoryByCategoryId, res, contextDataParam);
        })
      }
      if (reload.actionType === deleteAction) {
        console.log("delete cat ");
        deleteItem("categories", contextDataParam, reload.id)
      }
    }

    if (reload.dataType === optionType) {
      if (reload.actionType === updateAction) {
        executeQueryUtilSync(getOptionListByOptionListIdQuery(config.brandId, id)).then(res => {
          console.log("update option ")
          //console.log("res " + JSON.stringify(res));
          updateItem("options", res => res.data.getOptionListByOptionListIdQuery, res, contextDataParam);
        })
      }
      if (reload.actionType === createAction) {
        executeQueryUtilSync(getOptionListByOptionListIdQuery(config.brandId, id)).then(res => {
          console.log("create option ")
          //console.log("res " + JSON.stringify(res));
          createItem("options", res => res.data.getOptionListByOptionListIdQuery, res, contextDataParam);
        })
      }
      if (reload.actionType === deleteAction) {
        console.log("delete option ")
        deleteItem("options", contextDataParam, reload.id)
      }
    }

    if (reload.dataType === brandType) {
      if (reload.actionType === updateAction) {
        executeQueryUtilSync(getBrandByIdQuery(config.brandId)).then(res => {
          console.log("update Brand")

          let contextCopy = cloneDeep(contextDataParam);
          if (res.data?.getBrand) {
            contextCopy.brand = res.data.getBrand;
            setContextDataAuth(contextCopy, true);
          }
        })
      }
    }
  }



  // useEffect(() => {
  //   try {
  //
  //     //if (state && state.contextData) {
  //       // db.collection("brands")
  //       //     .doc("0S93n0HvHamy7TP5vEYF")
  //       //     .collection("reload")
  //       //     .doc("8cWLnecWQkyUi3n24ZFC")
  //       //if (currentBrand()) {
  //       // const db = firebase.firestore();
  //       // db.collection(BRAND_COLLECTION)
  //       //     .doc(config.brandId)
  //       //     .collection(RELOAD_COLLECTION)
  //       //     .doc("1")
  //       //     .onSnapshot((doc) => {
  //       //       console.log("state.contextData " + state.contextData);
  //       //       console.log("contextDataState " + contextDataState);
  //       //       console.log("Current data ------ : ", JSON.stringify(doc.data()));
  //       //       reloadContext(doc.data());
  //       //
  //       //     });
  //
  //       // }
  //     //}
  //
  //   }
  //   catch (err) {
  //     console.log("error ------ : ", err);
  //   }
  //
  //
  // }, [contextDataState])
  // const [deliveryItems, loading, error] = useCollectionData(
  //     db
  //         .collection(BRAND_COLLECTION).doc(currentBrand().id)
  //         .collection(RELOAD_COLLECTION).doc("1")
  //         .collection(DELIVERY_COLLECTION)
  //         .where('startDate', '>=', getStartDateSeconds())
  //         .where('startDate', '<=', getEndDateSeconds())
  //     ,
  //     {
  //       snapshotListenOptions: { includeMetadataChanges: true },
  //     }
  // );

  useEffect(() => {
    // Create an scoped async function in the hook
    async function loadContextData() {
      const contextData = await getContextDataApollo();
      setContextDataAuth(contextData);
      console.log("load context !!!!");

      const db = firebase.firestore();
      db.collection(BRAND_COLLECTION)
          .doc(config.brandId)
          .collection(RELOAD_COLLECTION)
          .doc(reloadId)
          .onSnapshot((doc) => {
            //console.log("state.contextData " + state.contextData);
            //console.log("contextDataState " + contextData);
            //console.log("Current data ------ : ", JSON.stringify(doc.data()));
            reloadContext(doc.data(), contextData);

          });

    }    // Execute the created function directly
    loadContextData();
  }, []);

  // useEffect(async () => {
  //   const interval = setInterval(async () => {
  //     const contextData = await getContextDataApollo();
  //     setContextData(contextData);
  //     console.log("reload context !!!!")
  //     // return contextData;
  //   },  (parseInt(process.env.REVALIDATE_DATA_TIME) || 60) * 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const [adressDialogOpen, setAdressDialogOpen] = useState(false)
  const [redirectPage, setRedirectPage] = useState(null);

  const classes = useStyles();
  firebase.auth().useDeviceLanguage();
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const { addToast } = useToasts();

  // useEffect(() => {
  //   // Create an scoped async function in the hook
  //   async function loadContextData() {
  //     if (!state.contextData) {
  //       const data = await getStaticPropsUtil();
  //       setContextData(data.props.contextData);
  //     }
  //   }    // Execute the created function directly
  //   loadContextData();
  // }, []);

  useEffect(() => {
    if(redirectPage ){
      Router.push(redirectPage)
    }
  }, [redirectPage])

  // useEffect(() => {
  //   let interval = setInterval(async () => {
  //     const data = await getStaticPropsUtil();
  //     setContextData(data.props.contextData);
  //   }, 60000);
  //
  //   // returned function will be called on component unmount
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, [])


  useEffect(() => {
    let interval = setInterval(() => {
      setBookingSlotStartDate(moment())
    }, 60000);

    // returned function will be called on component unmount
    return () => {
      clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    async function setOrder() {

      if (localStorage.getItem(CART_KEY)) {
        let orderInCreationSource = encryptor.decrypt(localStorage.getItem(CART_KEY));
        //let orderInCreationSource = localStorage.getItem(CART_KEY);
        if (!orderInCreationSource) {
          //resetOrderInCreation()
          localStorage.removeItem(CART_KEY);
          resetOrderInCreation()
        }
        else {
          try {
            let orderInCreationParsed = JSON.parse(orderInCreationSource);
            if (orderInCreationParsed.updateDate && (moment().unix() - parseFloat(orderInCreationParsed.updateDate)) < expireTimeSeconds) {
              await setOrderInCreation(orderInCreationParsed, true);
            }
            else {
              resetOrderInCreation();
            }
          } catch (err) {
            alert("badParse")
            localStorage.removeItem(CART_KEY);
            resetOrderInCreation()
          }
        }
      }
      else {
        resetOrderInCreation()
      }
    }    // Execute the created function directly
    setOrder();



  }, []);

  useEffect(async () => {

    const brandId = state.brand ? state.brand.id : 0;
    //alert("brandId " + brandId)

    if (brandId && state.dbUser) {
      let result = await executeQueryUtil(getCustomerOrdersOnlyIdQuery(brandId, state.dbUser.id));
      if (result && result.data) {
        let count = result.data.getSiteUser.orders.length;
        dispatch({
          type: ORDER_COUNT,
          payload: {
            orderCount: count,
          }
        });
      }
    }
    else {
      dispatch({
        type: ORDER_COUNT,
        payload: {
          orderCount: 0,
        }
      });
    }

    // if (!localStorage.getItem(DIST_INFO)) {
    //   setAdressDialogOpen(true);
    // }
  }, [state.brand, state.dbUser]);



  const createUserWithEmailAndPassword = async (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const signInWithEmailAndPassword = (email, password) => {
    setLoginOnGoing(true)
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const sendEmailVerification = async (brand, establishment) => {
    var user = firebase.auth().currentUser;
    //alert("user for sendEmailVerification " + user.email)
    if (user) {
      let link = await getActivationMailLink(user.email)
      //alert("link " + link);
      console.log("link " + link);
      //await sendMailMessage(brand, establishment, link, emailAddress);

      //let link = await getResetMailLink(emailAddress);
      let message = localStrings.formatString(localStrings.emailTemplate.activateEmail, link, brand.brandName)
      await sendMailMessage(brand, establishment, message,
          localStrings.formatString(localStrings.emailTemplate.activateEmailSubject, brand.brandName),
          user.email);
    }
  };

  const resetPassword = async (brand, establishment, emailAddress) => {
    let link = await getResetMailLink(emailAddress);
    let message = localStrings.formatString(localStrings.emailTemplate.passwordReset,
        link, brand.brandName)
    await sendMailMessage(brand, establishment, message,
        localStrings.formatString(localStrings.emailTemplate.passwordResetSubject, brand.brandName),
        emailAddress);
  };

  const signInWithGoogle = () => {
    try {
      setLoginOnGoing(true);
      const provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithPopup(provider);
    }
    catch (err) {
      setGlobalDialog(<AlertHtmlLocal
              title={localStrings.loginError}
              content={err.message}
          >
          </AlertHtmlLocal>
      )
    }
  };

  const signInWithFaceBook = () => {
    try {
      setLoginOnGoing(true);
      const provider = new firebase.auth.FacebookAuthProvider();
      return firebase.auth().signInWithPopup(provider);
    }
    catch (err) {
      setGlobalDialog(<AlertHtmlLocal
          title={localStrings.loginError}
          content={err.message}
      >
      </AlertHtmlLocal>
      )
    }
  };

  const logout = async () => {
    await setDbUser(null);
    localStorage.removeItem("authToken");
    dispatch({
      type: ORDER_IN_CREATION,
      payload: {
        orderInCreation: {
          deliveryMode: ORDER_DELIVERY_MODE_DELIVERY,
          order: {
            items: [],
            deals: []
          },
          customer: null,
          payments: null,
          deliveryAddress: null,
          bookingSlot: null,
          additionalInfo: null,
        },
      }
    });

    // dispatch({
    //   type: ORDER_IN_CREATION,
    //   payload: {
    //     isAuthenticated: false,
    //     user: null
    //   }
    // });


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

  const setContextDataAuth = (contextData) => {
    dispatch({
      type: CONTEXT_DATA,
      payload: {
        contextData: contextData,
      }
    });
    // if (!noUpdate) {
    setContextDataState(contextData);
    // }
  }

  const getContextDataAuth = () => {
    return state.contextData;
  }

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

    if (dbUser == null) {
      dispatch({
        type: ORDER_COUNT,
        payload: {
          orderCount: 0,
        }
      });
      return;
    }
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

  function setGlobalDialog(content) {
    dispatch({
      type: GLOBAL_DIALOG,
      payload: {
        globalDialog: content,
      }
    });
  }

  function resetGlobalDialog() {
    dispatch({
      type: GLOBAL_DIALOG,
      payload: {
        globalDialog: null,
      }
    });
  }

  function setRedirectPageGlobal(page) {
    setRedirectPage(page)
  }

  const bookingSlotStartDate = () => {
    return state.bookingSlotStartDate;
  }

  const setBookingSlotStartDate = (bookingSlotStartDate) => {
    dispatch({
      type: BOOKING_SLOT_START_DATE,
      payload: {
        bookingSlotStartDate: bookingSlotStartDate,
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
    let res = await executeQueryUtil(establishmentsQuery(brand.id));

    //alert("res setBrand" + JSON.stringify(res))
    let estas = res.data.getEstablishmentByBrandId;
    if (estas && estas.length > 0) {
      dispatch({
        type: ESTABLISHMENT_LIST,
        payload: {
          establishmentList: estas,
        }
      });
      setEstablishment(estas[0]);
    }
    //alert("dispatch brand " + JSON.stringify(brand))
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

  const setEstablishmentList = async (establishmentList) => {
    dispatch({
      type: ESTABLISHMENT_LIST,
      payload: {
        establishmentList: establishmentList,
      }
    });
  }

  const currentUser = () => {
    var user = firebase.auth().currentUser;
    return user;
  };

  const CART_KEY = "orderInCreation";

  const getOrderInCreation = () => {
    // if (state.orderInCreation.initial && localStorage)
    // {
    //   let storareOrder = localStorage.getItem(CART_KEY);
    //   if (storareOrder) {
    //     let orderFromStorage = JSON.parse(storareOrder);
    //     setOrderInCreation(orderFromStorage);
    //     return orderFromStorage;
    //   }
    // }
    return state.orderInCreation;
  }

  const setOrderInCreation = async (orderInCreation, doNotupdateLocalStorage) => {
    //currentEstablishment, currentService, orderInCreation

    const currentService = getCurrentService(currentEstablishment(), state.bookingSlotStartDate)
    processOrderInCreation(currentEstablishment, currentService, orderInCreation, setGlobalDialog, setRedirectPageGlobal,
      getBrandCurrency(currentBrand()));
    await processOrderCharge(currentEstablishment, currentService, orderInCreation, setGlobalDialog, setRedirectPageGlobal,
        getBrandCurrency(currentBrand()), currentBrand()?.id);

    dispatch({
      type: ORDER_IN_CREATION,
      payload: {
        orderInCreation: orderInCreation,
      }
    });
    if (localStorage && !doNotupdateLocalStorage && orderInCreation.order) {

      let orderInCreationCopy = cloneDeep(orderInCreation)
      delete orderInCreationCopy["bookingSlot"]
      orderInCreationCopy.updateDate = moment().unix();

      //alert("orderInCreation " + JSON.stringify(orderInCreation));
      localStorage.setItem(CART_KEY, encryptor.encrypt(JSON.stringify(orderInCreationCopy)));
      //localStorage.setItem(CART_KEY, JSON.stringify(orderInCreationCopy));
    }
  }

  const resetOrderInCreation = () => {
    dispatch({
      type: ORDER_IN_CREATION,
      payload: {
        orderInCreation: {
          deliveryMode: ORDER_DELIVERY_MODE_DELIVERY,
          order: {
            items: [],
            deals: []
          },
          payments: null,
          customer: null,
          deliveryAddress: null,
          bookingSlot: null,
          additionalInfo: null,

          //productAndSkusLines: []
        }
      }
    });
  }

  const setDealEdit = (dealEdit) => {
    dispatch({
      type: DEAL_EDIT,
      payload: {
        dealEdit: dealEdit,
      }
    });
  }

  const setMaxDistanceReached = (value) => {
    dispatch({
      type: MAX_DISTANCE_REACHED,
      payload: {
        maxDistanceReached: value,
      }
    });
  }


  const setLoginDialogOpen = (value) => {
    dispatch({
      type: LOGIN_DIALOG_OPEN,
      payload: {
        loginDialogOpen: value,
      }
    });
  }

  const setLoginOnGoing = (value) => {
    dispatch({
      type: LOGIN_ON_GOING,
      payload: {
        loginOnGoing: value,
      }
    });
  }



  const setJustCreatedOrder = (value) => {
    dispatch({
      type: JUST_CREATED_ORDER,
      payload: {
        justCreatedOrder: value,
      }
    });
  }

  const increaseOrderCount = (value) => {
    dispatch({
      type: ORDER_COUNT,
      payload: {
        orderCount: state.orderCount + 1,
      }
    });
  }

  useEffect(async () => {
    let res = await executeQueryUtil(getBrandByIdQuery(config.brandId));
    //alert("useEffect getBrand" + JSON.stringify(res))
    // alert("useEffect getBrand" + JSON.stringify(res.data))
    if (res && res.data) {
      setBrand(res.data.getBrand)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          try {

            if (user) {
              // Here you should extract the complete user profile to make it available in your entire app.
              // The auth state only provides basic information.
              //console.log("User unsubscribe" + JSON.stringify(user, null, 2))

              let token = await firebase.auth().currentUser.getIdToken(true)
              localStorage.setItem("authToken", token)
              localStorage.setItem("genTimeToken", moment().unix())
              //alert("user " + JSON.stringify(user))
              executeQueryUtilSync(getSiteUserByIdQuery(getBrandId(), user.uid)).then(result => {
                //alert("result.data.getSiteUser " + JSON.stringify(result.data.getSiteUser))
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
          }
          catch (err) {
            console.log(err)
          }
        }

    );

    return unsubscribe;
  }, [dispatch]);

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
            signInWithFaceBook,

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

            setOrderInCreation,
            getOrderInCreation,
            resetOrderInCreation,
            setDealEdit,
            setBookingSlotStartDate,
            setMaxDistanceReached,
            setLoginDialogOpen,
            setLoginOnGoing,
            setJustCreatedOrder,
            increaseOrderCount,

            setGlobalDialog,
            resetGlobalDialog,

            setRedirectPageGlobal,

            setContextDataAuth,
            getContextDataAuth,
          }}
      >

        {state.globalDialog &&
        <Dialog open={state.globalDialog} maxWidth="sm"
        >
          <DialogContent className={classes.dialogContent}>
            {state.globalDialog.content}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => resetGlobalDialog()} color="primary">
              {localStrings.close}
            </Button>

            {(state.globalDialog.actions || []).map((action, key) =>
                <Button onClick={() => {
                  resetGlobalDialog();
                  action.action();
                }} color="primary">
                  {action.title}
                </Button>
            )}
          </DialogActions>
        </Dialog>
        }

        {children}
      </AuthContext.Provider>
  );
};

export default AuthContext;
