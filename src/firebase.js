// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-10lmBOg_NGX8fNqFohi-8TFbtM4MdHk",
  authDomain: "voidex-ea820.firebaseapp.com",
  projectId: "voidex-ea820",
  storageBucket: "voidex-ea820.firebasestorage.app",
  messagingSenderId: "97557019254",
  appId: "1:97557019254:web:7be6c4347dcb70bcebbd57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
