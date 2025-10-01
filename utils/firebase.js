// utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8nhUbls8bnrJaXQPdA5XBQrg_HOosqFg",
  authDomain: "foodnextdoor-84ad3.firebaseapp.com",
  projectId: "foodnextdoor-84ad3",
  storageBucket: "foodnextdoor-84ad3.firebasestorage.app",
  messagingSenderId: "621183642126",
  appId: "1:621183642126:web:31c8eb8b74d4737eb8ea5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  //  getAuth
export const db = getFirestore(app);