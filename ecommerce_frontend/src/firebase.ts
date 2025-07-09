import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase config using your latest values
const firebaseConfig = {
  apiKey: "AIzaSyDyUPtGRm96mL9QqApQaXVklrHcqc9bArM",
  authDomain: "ecommerce-4889a.firebaseapp.com",
  projectId: "ecommerce-4889a",
  storageBucket: "ecommerce-4889a.firebasestorage.app",
  messagingSenderId: "524041120512",
  appId: "1:524041120512:web:880ce1027f01551ea121e5",
  measurementId: "G-TB9XB4VGXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
