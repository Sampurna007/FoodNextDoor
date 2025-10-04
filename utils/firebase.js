// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8nhUbls8bnrJaXQPdA5XBQrg_HOosqFg",
  authDomain: "foodnextdoor-84ad3.firebaseapp.com",
  projectId: "foodnextdoor-84ad3",
  storageBucket: "foodnextdoor-84ad3.appspot.com", 
  appId: "1:621183642126:web:31c8eb8b74d4737eb8ea5f"
};

// Initialize Firebase safely (important in Expo hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


 export const auth = getAuth(app);
export const db = getFirestore(app);
