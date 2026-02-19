// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPwo1fHTO1tkCDN6QZlwDj11VG4c3O3Ec",
  authDomain: "lab06-ionic-firebase-e7ea5.firebaseapp.com",
  projectId: "lab06-ionic-firebase-e7ea5",
  storageBucket: "lab06-ionic-firebase-e7ea5.firebasestorage.app",
  messagingSenderId: "702090503498",
  appId: "1:702090503498:web:668811525ca4dfeb64cdb3",
  measurementId: "G-5BNSD1LPJN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

