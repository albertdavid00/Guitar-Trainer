// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
    apiKey: "AIzaSyCA4gs2lX6aVB8hwaymmtZTSyuLeeVujPU",
    authDomain: "fir-auth-guitar-trainer.firebaseapp.com",
    databaseURL: "https://fir-auth-guitar-trainer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fir-auth-guitar-trainer",
    storageBucket: "fir-auth-guitar-trainer.appspot.com",
    messagingSenderId: "100650640734",
    appId: "1:100650640734:web:4d40f35024d0c615addbcf",
    measurementId: "G-DQSGW2ECTX"
});

// Initialize Firebase

export const auth = app.auth();
export const database = getDatabase(app);

export default app;