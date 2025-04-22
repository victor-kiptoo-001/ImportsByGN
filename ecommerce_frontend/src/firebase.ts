import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCV9vUeFcrtvy_qeVAsXWxR1e31q0Hp0Vk",
  authDomain: "e-commerce-7fd91.firebaseapp.com",
  projectId: "e-commerce-7fd91",
  storageBucket: "e-commerce-7fd91.firebasestorage.app",
  messagingSenderId: "1017242549787",
  appId: "1:1017242549787:web:d220a2594a986b5fe342be",
  measurementId: "G-FLHN3WXNJF"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);