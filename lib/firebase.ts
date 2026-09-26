import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9VtoS_uwm-XPiGnM7RoDDEyVic7P9dZU",
  authDomain: "study-link-os.firebaseapp.com",
  projectId: "study-link-os",
  storageBucket: "study-link-os.firebasestorage.app",
  messagingSenderId: "629479404124",
  appId: "1:629479404124:web:23e4b298df340cb4006c99",
  measurementId: "G-3M04DF3H9C"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
