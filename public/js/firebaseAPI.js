//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCIQbe2vdrBdYFZXxf5NMKp5Kd-2igY-Oc",
    authDomain: "todoit-1d93d.firebaseapp.com",
    projectId: "todoit-1d93d",
    storageBucket: "todoit-1d93d.firebasestorage.app",
    messagingSenderId: "463019893756",
    appId: "1:463019893756:web:bf1d9ba2682bea4d9ac879"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

