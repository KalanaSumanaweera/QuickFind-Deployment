// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:"get the API key from .env",
  authDomain: "quickfind-4ff60.firebaseapp.com",
  projectId: "quickfind-4ff60",
  storageBucket: "quickfind-4ff60.appspot.com",
  messagingSenderId: "810240843283",
  appId: "1:810240843283:web:eba24e2808413a9642e9e6",
  measurementId: "G-JYY7KG623Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure reCAPTCHA
auth.settings.appVerificationDisabledForTesting = true;

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber };