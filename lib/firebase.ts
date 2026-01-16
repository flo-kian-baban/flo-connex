// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDV7MwXA5Eq0GGBma8GCKPZ5R_iD9bRfIg",
    authDomain: "flo-connex-mvp.firebaseapp.com",
    projectId: "flo-connex-mvp",
    storageBucket: "flo-connex-mvp.firebasestorage.app",
    messagingSenderId: "718149198333",
    appId: "1:718149198333:web:218f912bdab8e63c7bf994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
