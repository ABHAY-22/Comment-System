// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSK_FK9WGiYBls-EraRqo6JFuoR9C07kQ",
  authDomain: "comment-system-f3aa5.firebaseapp.com",
  projectId: "comment-system-f3aa5",
  storageBucket: "comment-system-f3aa5.appspot.com",
  messagingSenderId: "593101519641",
  appId: "1:593101519641:web:fc465a6545c4e848452388",
  measurementId: "G-WEKS4Q09VJ" // Optional, only if you're using analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // For authentication
export const db = getFirestore(app); // For Firestore (database)
export const storage = getStorage(app); // For storage (file uploads)

// If you need analytics, uncomment the line below
// const analytics = getAnalytics(app);





