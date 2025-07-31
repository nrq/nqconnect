
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpCyqW7oS5tZsxYdVccy6MUE_JNuWeCbs",
  authDomain: "salamconnect-2rlmv.firebaseapp.com",
  projectId: "salamconnect-2rlmv",
  storageBucket: "salamconnect-2rlmv.appspot.com",
  messagingSenderId: "286074217686",
  appId: "1:286074217686:web:fecea9d16c06cc4814d577",
};

// Initialize Firebase
// Check if apps are already initialized to prevent errors.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage, RecaptchaVerifier };
