// Users should be able to register and login with an email address
// The user should also be able to sign out of their account
// Each book needs to be captured on Firebase
// Any updates such as toggling read or not should be updated.

import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAXZK847z0mFqWwZZQTC9MHn-L3XBILB9Q",
  authDomain: "library-f3336.firebaseapp.com",
  projectId: "library-f3336",
  storageBucket: "library-f3336.appspot.com",
  messagingSenderId: "659513606574",
  appId: "1:659513606574:web:4010a2801b13764e45083f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
// Create a user with email and password
let email = "hi";
let password = "hi";

// Create an account with an email and password
async function createUser(auth, email, password) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user;
    console.log("Your account has been created");
    console.log("Username:", user.email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// Sign in with email and password after creation
async function signIn(auth, email, password) {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const user = credentials.user;
    console.log("You have succesffully logged in");
    console.log("Username:", user.email);
    loggedIn(user.email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// log out
async function logOut() {
  try {
    const signingOut = await signOut(auth);
    console.log("You have succesffully logged Out");
    loggedOut();
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// checks the authentication state of user and if logged in updates display
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    loggedIn(user.email);
  }
});

const db = getFirestore(app);

export { auth, createUser, signIn };
