import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAeWovnUFF-5l4ZosFpKiN-bJECgUAKJlU",
  authDomain: "webpatitocrochet.firebaseapp.com",
  projectId: "webpatitocrochet",
  storageBucket: "webpatitocrochet.firebasestorage.app",
  messagingSenderId: "415847501395",
  appId: "1:415847501395:web:5d1d88fdbbe12df682c0a6",
  measurementId: "G-NQN1765RHH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Forzar pantalla de selección de cuenta cada vez
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

