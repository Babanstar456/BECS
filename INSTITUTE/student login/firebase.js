// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5Ur6-mq9uE4fU0HOaQQhKk3nayTiQCfk",
  authDomain: "becs-370ab.firebaseapp.com",
  projectId: "becs-370ab",
  storageBucket: "becs-370ab.firebasestorage.app",
  messagingSenderId: "265733015540",
  appId: "1:265733015540:web:fddcee2dc226ad9be85ba1",
  measurementId: "G-0ECNR1HQLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);