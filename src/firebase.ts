import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_LGptFv38M-H_VHaqsYPYpi9hzF9zFlA",
    authDomain: "antelope-logger.firebaseapp.com",
    projectId: "antelope-logger",
    storageBucket: "antelope-logger.appspot.com",
    messagingSenderId: "619444894903",
    appId: "1:619444894903:web:07c7adfbcc0ea3432b6132"
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

enableIndexedDbPersistence(firestore)
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });