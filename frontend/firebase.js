// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD_-kyrB-keotYZnUqHTND0a-L23I5v4kA",
  authDomain: "hacktx-9757b.firebaseapp.com",
  projectId: "hacktx-9757b",
  storageBucket: "hacktx-9757b.firebasestorage.app",
  messagingSenderId: "174024931744",
  appId: "1:174024931744:web:66da9bc709c197b7794cc5",
  measurementId: "G-9376QJHCWT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
