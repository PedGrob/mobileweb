import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPwo1fHTO1tkCDN6QZlwDj11VG4c3O3Ec",
  authDomain: "lab06-ionic-firebase-e7ea5.firebaseapp.com",
  projectId: "lab06-ionic-firebase-e7ea5",
  storageBucket: "lab06-ionic-firebase-e7ea5.firebasestorage.app",
  messagingSenderId: "702090503498",
  appId: "1:702090503498:web:668811525ca4dfeb64cdb3",
  measurementId: "G-5BNSD1LPJN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
