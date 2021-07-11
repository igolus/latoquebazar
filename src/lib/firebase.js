import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '../config';
import 'firebase/storage'
import 'firebase/analytics'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
}else {
  firebase.app(); // if already initialized, use that one
}

if (!firebase.analytics.length) {
  firebase.analytics();
}
// else {
//   //firebase.analytics();
// }

//firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

export {
  storage, firebase as default
}

