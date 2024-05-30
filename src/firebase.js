// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,setPersistence,browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVSp3wzAFKybw7dSs2qDIwS7q18fKtgDs",
  authDomain: "invoice-builder-b32ea.firebaseapp.com",
  projectId: "invoice-builder-b32ea",
  storageBucket: "invoice-builder-b32ea.appspot.com",
  messagingSenderId: "937937480562",
  appId: "1:937937480562:web:f795091e70a99db0914beb",
  measurementId: "G-1E183HRREN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current session
    // or local storage, depending on the configuration.
  })
  .catch((error) => {
    // Handle errors here.
    console.error(error);
  });
export const storage = getStorage()
export const db= getFirestore(app);