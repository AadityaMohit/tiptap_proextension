 import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyDp7ghSyKhc2u_MN-iLtZRBn17-zinl_24",
  authDomain: "testexperiments-8356a.firebaseapp.com",
  projectId: "testexperiments-8356a",
  storageBucket: "testexperiments-8356a.firebasestorage.app",
  messagingSenderId: "833978223157",
  appId: "1:833978223157:web:a79f5f8dad9c37fb703f7c",
  measurementId: "G-DP4268BVCY",
};

 const app = initializeApp(firebaseConfig);

 const db = getFirestore(app);

export { app, db };
