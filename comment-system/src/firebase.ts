
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBSK_FK9WGiYBls-EraRqo6JFuoR9C07kQ",
  authDomain: "comment-system-f3aa5.firebaseapp.com",
  projectId: "comment-system-f3aa5",
  storageBucket: "comment-system-f3aa5.appspot.com",
  messagingSenderId: "593101519641",
  appId: "1:593101519641:web:fc465a6545c4e848452388",
  measurementId: "G-WEKS4Q09VJ"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 






