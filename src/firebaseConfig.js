// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCmYqcUbUHBGrniqaTTHeiWy6PEekm6H4o",
    authDomain: "chat-with-armaan.firebaseapp.com",
    projectId: "chat-with-armaan",
    storageBucket: "chat-with-armaan.appspot.com",
    messagingSenderId: "545151521523",
    appId: "1:545151521523:web:d04d36fd909b4cc905dd86",
    measurementId: "G-6BND6BGK3W"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
