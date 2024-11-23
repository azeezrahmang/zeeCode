import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
  apiKey: "AIzaSyDxLgsDQ7LCEiRaA49RAQB5ICMc5LJEZZo",
  authDomain: "cinegallery-9501c.firebaseapp.com",
  databaseURL: "https://cinegallery-9501c-default-rtdb.firebaseio.com",
  projectId: "cinegallery-9501c",
  storageBucket: "cinegallery-9501c.firebasestorage.app",
  messagingSenderId: "869387706737",
  appId: "1:869387706737:web:f168454efb7065f6ca16d0"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);