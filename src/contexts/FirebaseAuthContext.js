import React, {createContext, useEffect, useReducer, useState} from 'react';
import firebase from '../lib/firebase';
import localStrings from "../localStrings";
import {CURRENCY_EUR} from "../util/Currencies";
import {useToasts} from "react-toast-notifications";
import {executeQueryUtil, executeQueryUtilSync} from "../apolloClient/gqlUtil";
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
import {
  addDealToCart,
  computeItemRestriction,
  processOrderCharge,
  processOrderDiscount,
  processOrderInCreation
} from "../util/cartUtil";
import {getCurrentService} from "@component/form/BookingSlots";
import {Button, Dialog, DialogActions, DialogContent} from "@material-ui/core";
import Router from 'next/router'
import {computePriceDetail, getBrandCurrency} from "../util/displayUtil";
import {getContextDataApollo, sortChainList, updateBrandBase64HomPage} from "../nextUtil/propsBuilder";
import AlertHtmlLocal from "@component/alert/AlertHtmlLocal";
import {getProductsByIdQuery} from "../gql/productGql";
import {getOptionListByOptionListIdQuery} from "../gql/productOptionListGql";
import {getCategoriesByIdQuery} from "../gql/productCategoryGql";
import Box from "@material-ui/core/Box";
import {applyDealPrice} from "@component/products/DealSelector";
import {isDealValuable} from "@component/products/UpSellDeal";

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
const ESTA_NAV_OPEN = 'ESTA_NAV_OPEN';
const DEAL_CANDIDATES = 'DEAL_CANDIDATES';
// const PREFFERED_DEAL_TO_APPLY = 'PREFFERED_DEAL_TO_APPLY';

const encKey = 'dcb21c08-03ed-4496-b67e-94202038a07d';
var encryptor = require('simple-encryptor')(encKey);


// const useStyles = makeStyles(() => ({
//   dialogContent: {
//     paddingBottom: '1.25rem',
//     backgroundColor: palette.background.default
//     //maxWidth: "750px"
//   },
// }))

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
  bookingSlotStartDate: moment(),
  maxDistanceReached: true,
  loginDialogOpen: false,
  justCreatedOrder: null,
  loginOnGoing: false,
  orderCount: 0,
  brandId: 0,
  globalDialog: null,
  contextData: null,
  estanavOpen: false,
  dealCandidates: [],
  prefferedDealToApply: null,
};

const config = require('../conf/config.json');
const reducer = (state, action) => {
  switch (action.type) {
      // case PREFFERED_DEAL_TO_APPLY: {
      //   const { prefferedDealToApply } = action.payload;
      //   return {
      //     ...state,
      //     prefferedDealToApply: prefferedDealToApply
      //   };
      // }

    case DEAL_CANDIDATES: {
      const { dealCandidates } = action.payload;
      return {
        ...state,
        dealCandidates: dealCandidates
      };
    }


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

    case ESTA_NAV_OPEN: {
      const { estanavOpen } = action.payload;
      return {
        ...state,
        estanavOpen: estanavOpen,
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
  checkDealProposal: () => {},
  setOrderInCreationNoLogic: () => {},
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

  setEstanavOpen: () => {},

  setDealCandidates: () => {},

  // setPrefferedDealToApply: () => {}
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

const localStorageEstaKey = "defaultEstaId";
export const AuthProvider = ({ children }) => {
  const [contextDataState, setContextDataState] = useState(null)
  const [candidateDeal, setCandidateDeal] = useState(null)

  function updateItem(dataType, getFunc, res, contextDataParam) {
    if (!contextDataParam) {
      return;
    }
    let contextCopy = cloneDeep(contextDataParam);
    let index = contextCopy[dataType].findIndex(item => item.id === getFunc(res).id);

    console.log("index " + index);
    console.log(" contextCopy[dataType].length " + contextCopy[dataType].length);
    if (getFunc(res) && index!==-1) {
      contextCopy[dataType].splice(index, 1, getFunc(res))
    }
    else {
      return;
    }

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
            updateBrandBase64HomPage(contextCopy.brand);
            setContextDataAuth(contextCopy, true);
          }
        })
      }
    }
  }

  useEffect(() => {
    // Create an scoped async function in the hook
    async function loadContextData() {
      const contextData = await getContextDataApollo();
      setContextDataAuth(contextData);
      //alert("load context !!!!")
      console.log("load context !!!!");

      const db = firebase.firestore();
      db.collection(BRAND_COLLECTION)
          .doc(config.brandId)
          .collection(RELOAD_COLLECTION)
          .doc(reloadId)
          .onSnapshot((doc) => {
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
              await setOrderInCreation(orderInCreationParsed, true, null);
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

  const setEstanavOpen = (estanavOpen) => {
    dispatch({
      type: ESTA_NAV_OPEN,
      payload: {
        estanavOpen: estanavOpen,
      }
    });
  }

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
    if (!brand) {
      return
    }
    let res = await executeQueryUtil(establishmentsQuery(brand.id));

    //alert("res setBrand" + JSON.stringify(res))
    let estas = res.data.getEstablishmentByBrandId;
    console.log("estas setBrand " + JSON.stringify(res.data.getEstablishmentByBrandId));
    if (estas && estas.length > 0) {
      dispatch({
        type: ESTABLISHMENT_LIST,
        payload: {
          establishmentList: estas,
        }
      });
      console.log("setEstablishment " + estas[0].id);
      let estaToSet = estas[0];
      let localEstId = localStorage.getItem(localStorageEstaKey);
      if (localEstId) {
        estaToSet = estas.find(esta => esta.id === localEstId);
      }
      await setEstablishment(estaToSet || estas[0]);
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
    if (getOrderInCreation()) {
      let orderInCreationCopy = cloneDeep(getOrderInCreation())
      orderInCreationCopy.bookingSlot = null;
      setOrderInCreation(orderInCreationCopy, false, () => establishment);
    }

    localStorage.setItem(localStorageEstaKey , establishment.id);

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

  const setOrderInCreationNoLogic = async (orderInCreation) => {
    dispatch({
      type: ORDER_IN_CREATION,
      payload: {
        orderInCreation: orderInCreation,
      }
    })
  }

  function processDealMerge(currentEstablishment, currentService, orderInCreation, currency, brand, prefferedDealToApply) {
    if (!brand?.config?.proposeDeal) {
      return null;
    }

    const oldPrice = computePriceDetail(orderInCreation);
    const deals = (state.contextData?.deals || []).filter(deal => deal.visible);
    let candidateDeals = [];
    for (let j = 0; j < deals.length; j++) {
      const dealToCheck = deals[j];


      if (dealToCheck.lines && dealToCheck.lines.length > 0) {
        let itemsInCart = cloneDeep(orderInCreation.order.items);
        let itemsForDeal = [];
        const lines = cloneDeep(dealToCheck.lines);
        let matchingRemains = lines.length;
        let missingLine;
        let missingLineNumber = -1;
        let priceItemsWithoutDeal = 0;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          let itemInCart = itemsInCart.find(item => item.quantity > 0 && (line.skus || []).map(sku => sku.extRef).includes(item.extRef));

          if (itemInCart) {
            priceItemsWithoutDeal += parseFloat(itemInCart.price);
            itemsForDeal.push({
              ...itemInCart,
              lineIndex: i,
              quantity: 1,
            })
            itemInCart.takenFromCart = (itemInCart.takenFromCart || 0) + 1;
            itemInCart.quantity = itemInCart.quantity - 1;
            itemInCart.canditeDeal = true;
            itemInCart.lineIndex = i;
            matchingRemains--;
          } else {
            missingLine = line;
            missingLineNumber = i
            itemsForDeal.push({
              lineIndex: i,
              notSet: true
            })
          }
        }


        let toRemoveSkuRef = [];


        for (let i = 0; i < itemsInCart.length; i++) {
          const itemsInCartElement = itemsInCart[i];
          if (!itemsInCartElement.canditeDeal) {
            continue;
          }
          if (itemsInCartElement.quantity === 0) {
            toRemoveSkuRef.push(itemsInCartElement.extRef);
          } else {
            let toUpdateQte = itemsInCart.find(item => item.extRef === itemsInCartElement.extRef);
            toUpdateQte.quantity = itemsInCartElement.quantity;
          }
        }
        let dealClone = cloneDeep(dealToCheck);
        if (matchingRemains === 0 && (!prefferedDealToApply || dealToCheck.id === prefferedDealToApply.id)) {
          computeItemRestriction(dealClone, currentEstablishment, currentService, orderInCreation, currency);
          const restrictions = (dealClone.restrictionsApplied || [])
              .map(res => res.type).sort((a, b) => a.localeCompare(b));
          if (restrictions.length === 0) {


            // setPrefferedDealToApply(null);
            let itemsCopyForDealUpdate = itemsInCart.filter(sku => !toRemoveSkuRef.includes(sku.extRef))
            let orderInCreationClone = cloneDeep(orderInCreation);
            orderInCreationClone.order.items = itemsCopyForDealUpdate;

            let dealToAdd = {
              deal: dealClone
            }
            dealToAdd.productAndSkusLines =
                cloneDeep(itemsForDeal)
                    .sort((a, b) => a.lineIndex - b.lineIndex)

            dealToAdd.productAndSkusLines.forEach(productAndSkusLine => {
              productAndSkusLine.quantity = 1;
              delete productAndSkusLine.restrictionsApplied;
              delete productAndSkusLine.productExtName;
              delete productAndSkusLine.uuid;
              delete productAndSkusLine.discountApplied;
              delete productAndSkusLine.canditeDeal;
              delete productAndSkusLine.lineIndex;

            })
            dealToAdd = applyDealPrice(dealToAdd);
            //dealToAdd = applyDealPrice(dealToAdd);
            orderInCreationClone = addDealToCart(dealToAdd, () => orderInCreationClone, null, true)
            computeItemRestriction(dealToAdd, currentEstablishment, currentService, orderInCreation, currency);
            if (!dealToAdd.restrictionsApplied || dealToAdd.restrictionsApplied.length === 0) {
              const newPrice = computePriceDetail(orderInCreationClone);

              if (newPrice.total < oldPrice.total) {
                return {
                  dealApplied: dealToAdd,
                  newOrder: orderInCreationClone,
                  saved: oldPrice.total - newPrice.total,

                }
              }
            }
          }
        }

        if (matchingRemains === 1 && missingLine && missingLineNumber !== -1 && brand?.config?.proposeDeal) {
          computeItemRestriction(dealClone, currentEstablishment, currentService, orderInCreation, currency);
          const restrictions = (dealClone.restrictionsApplied || [])
              .map(res => res.type).sort((a, b) => a.localeCompare(b));
          if (restrictions.length == 0) {
            let dealCandidate = {
              deal: dealClone,
              productAndSkusLines: []
            }

            dealCandidate.productAndSkusLines =
                cloneDeep(itemsForDeal)
                    .sort((a, b) => a.lineIndex - b.lineIndex)
            dealCandidate = applyDealPrice(dealCandidate);

            if (isDealValuable({
              candidate: dealCandidate,
              missingLine: missingLine,
              missingLineNumber: missingLineNumber,
              priceItemsWithoutDeal: priceItemsWithoutDeal
            }), getContextDataAuth()) {
              candidateDeals.push({
                candidate: dealCandidate,
                missingLine: missingLine,
                missingLineNumber: missingLineNumber,
                priceItemsWithoutDeal: priceItemsWithoutDeal
              })
            }
          }
        }
      }
    }
    return {
      candidateDeals: candidateDeals,
      newOrder: orderInCreation
    }
  }

  async function checkDealProposal(orderInCreation, getEstaFunc) {
    const getEstaFun = getEstaFunc || currentEstablishment
    const currentService = getCurrentService(getEstaFun(), state.bookingSlotStartDate, orderInCreation?.deliveryMode)

    let updatedOrderMerge = await processDealMerge(currentEstablishment, currentService, orderInCreation,
        getCurrency(), currentBrand());


    if (updatedOrderMerge) {
      setDealCandidates(updatedOrderMerge.candidateDeals)
    }

    return updatedOrderMerge?.candidateDeals;

    // if (updatedOrderMerge.candidateDeals && updatedOrderMerge.candidateDeals.length == 1 && getContextDataAuth()) {
    //   setCandidateDeal(updatedOrderMerge.candidateDeals[0])
    //   setDialogDealProposalContent(true);
    //   console.log("updatedOrderMerge candidate " + JSON.stringify(updatedOrderMerge, null, 2))
    // }

  }

  const setOrderInCreation = async (orderInCreation, doNotupdateLocalStorage, getEstaFunc, dbUser, prefferedDealToApply) => {
    const getEstaFun = getEstaFunc || currentEstablishment

    const currentService = getCurrentService(getEstaFun(), state.bookingSlotStartDate, getOrderInCreation()?.deliveryMode)
    processOrderInCreation(getEstaFun, currentService, orderInCreation, setGlobalDialog, setRedirectPageGlobal,
        getBrandCurrency(currentBrand()));
    await processOrderCharge(getEstaFun, currentService, orderInCreation, setGlobalDialog, setRedirectPageGlobal,
        getBrandCurrency(currentBrand()), currentBrand()?.id);

    if (getDbUser() && currentBrand()) {
      await processOrderDiscount(orderInCreation, currentBrand().id, getDbUser()?.id, setGlobalDialog, setOrderInCreation);
    }

    let updatedOrderMerge = await processDealMerge(currentEstablishment, currentService, orderInCreation,
        getCurrency(), currentBrand(), prefferedDealToApply);

    // if (updatedOrderMerge.candidateDeals && updatedOrderMerge.candidateDeals.length == 1 && getContextDataAuth()) {
    //   setCandidateDeal(updatedOrderMerge.candidateDeals[0])
    //   setDialogDealProposalContent(true);
    //   //console.log("updatedOrderMerge candidate " + JSON.stringify(updatedOrderMerge, null, 2))
    // }

    dispatch({
      type: ORDER_IN_CREATION,
      payload: {
        orderInCreation: updatedOrderMerge?.newOrder || orderInCreation,
      }
    });
    if (localStorage && !doNotupdateLocalStorage && orderInCreation.order) {

      let orderInCreationCopy = cloneDeep(updatedOrderMerge?.newOrder || orderInCreation)
      delete orderInCreationCopy["bookingSlot"]
      orderInCreationCopy.updateDate = moment().unix();
      localStorage.setItem(CART_KEY, encryptor.encrypt(JSON.stringify(orderInCreationCopy)));
    }

    if (updatedOrderMerge?.dealApplied) {
      setGlobalDialog({
        content: (<AlertHtmlLocal
            title={localStrings.dealApplied}
            content={localStrings.formatString(localStrings.dealAppliedDetail,
                updatedOrderMerge.dealApplied.deal.name, updatedOrderMerge.saved.toFixed(2))}
        >
          <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                borderRadius: 1,
              }}
          >
            <div style={{maxWidth: '300px'}}
                 dangerouslySetInnerHTML={{__html: `<lottie-player src="https://assets8.lottiefiles.com/packages/lf20_qdiq7qa5.json"  background="transparent"  speed="1"  style="width: 250px; height: 250px; margin-left: -50px; margin-left: 0;"  loop  autoplay></lottie-player>`}}
            />
          </Box>
        </AlertHtmlLocal>),
        actions: []
      })
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


  const setDealCandidates = (dealCandidates) => {
    dispatch({
      type: DEAL_CANDIDATES,
      payload: {
        dealCandidates: dealCandidates,
      }
    });
  }

  // const setPrefferedDealToApply = (prefferedDealToApply) => {
  //   dispatch({
  //     type: PREFFERED_DEAL_TO_APPLY,
  //     payload: {
  //       prefferedDealToApply: prefferedDealToApply,
  //     }
  //   });
  // }

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
            checkDealProposal,
            setOrderInCreationNoLogic,
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
            setEstanavOpen,
            setDealCandidates,
            contextDataState
            // setPrefferedDealToApply,
          }}
      >

        {/*<p>{JSON.stringify(candidateDeal || {})}</p>*/}


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
