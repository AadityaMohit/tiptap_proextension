 import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyAK3UIwUUwLLCGswz9lO90ICDviXmkOD2I",
  authDomain: "testextension-1e32b.firebaseapp.com",
  projectId: "testextension-1e32b",
  storageBucket: "testextension-1e32b.firebasestorage.app",
  messagingSenderId: "736473904434",
  appId: "1:736473904434:web:77259b6327747127b9d32b",
  measurementId: "G-ZY1EZREYB3"
};

 const app = initializeApp(firebaseConfig);

 const db = getFirestore(app);

export { app, db };
