import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmG9MHXXumxn3ajR4jiPFpixjkwcekCqI",
  authDomain: "nodal-seer-287420.firebaseapp.com",
  projectId: "nodal-seer-287420",
  storageBucket: "nodal-seer-287420.appspot.com",
  messagingSenderId: "443521829717",
  appId: "1:443521829717:web:e52d24a2e64fda4306fddc",
  measurementId: "G-W3EJ8QS2WX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, "superprompt-library");
export default app;
