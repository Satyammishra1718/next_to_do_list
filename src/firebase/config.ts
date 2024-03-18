import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCF3OKDapyzdZ1_iflJSPkTQxBkD2-6uPU",
    authDomain: "to-do-list-firebase-9f182.firebaseapp.com",
    databaseURL: "https://to-do-list-firebase-9f182-default-rtdb.firebaseio.com",
    projectId: "to-do-list-firebase-9f182",
    storageBucket: "to-do-list-firebase-9f182.appspot.com",
    messagingSenderId: "63366323211",
    appId: "1:63366323211:web:3d92e6e29ea9906b2b3b0e",
    measurementId: "G-Z3F2QXCYK1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
