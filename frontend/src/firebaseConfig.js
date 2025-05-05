// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🔥 추가

const firebaseConfig = {
  apiKey: "AIzaSyDlLYUYyWx6JnvmGDMZEPJ_fEkrdTUmXRc",
  authDomain: "foodimach-p1.firebaseapp.com",
  projectId: "foodimach-p1",
  storageBucket: "foodimach-p1.appspot.com",
  messagingSenderId: "837702464906",
  appId: "1:837702464906:web:1b3bebb6eb1d1d30850473",
  measurementId: "G-Y18JDNDTN7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ✅ Auth 인스턴스 추가
export const auth = getAuth(app);

// 기본 Firestore export (기존 코드와 호환)
export default db;
