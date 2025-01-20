// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-6666b.firebaseapp.com",
  projectId: "e-commerce-6666b",
  storageBucket: "e-commerce-6666b.appspot.com",
  messagingSenderId: "703323742652",
  appId: "1:703323742652:web:20f2548fe44d5d6b7a0bb9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);