// src/components/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByRvYnlspjwoc9bg_DMwyflD5gSnwnOX8",
  authDomain: "slotbooking-83547.firebaseapp.com",
  projectId: "slotbooking-83547",
  storageBucket: "slotbooking-83547.firebasestorage.app",
  messagingSenderId: "157104453822",
  appId: "1:157104453822:web:ece38809e6a061ce9fc6ef",
  measurementId: "G-B2E4Z9HEE0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Firebase authentication functions
const loginUser = async (email, password) => {
  console.log(email)
  return await signInWithEmailAndPassword(auth, email, password);
};

const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

const logout = async () => {
  return await signOut(auth);
};

export { loginUser, registerUser, loginWithGoogle, logout };