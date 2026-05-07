import { initializeApp } from "firebase/app";

import {
  getAuth
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyB8oRiNmOXNLNbIZxaoCONEtC3LbYNHKxA",

  authDomain:
    "recruitmind-ab9a7.firebaseapp.com",

  projectId:
    "recruitmind-ab9a7",

  storageBucket:
    "recruitmind-ab9a7.firebasestorage.app",

  messagingSenderId:
    "1058441324000",

  appId:
    "1:1058441324000:web:14ae82b529d9749b9cb785"
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);