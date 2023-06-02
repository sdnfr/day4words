import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUelaRtaC5uZPXBvSFI6HicVNFCvIMUT0",
    authDomain: "day4words.firebaseapp.com",
    projectId: "day4words",
    storageBucket: "day4words.appspot.com",
    messagingSenderId: "1077494848756",
    appId: "1:1077494848756:web:0dd29c70fb0342ab0d12a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// connectFirestoreEmulator(firestore, 'localhost',5002)
document.getElementById("login-button").onclick = googleSignIn;
const provider = new GoogleAuthProvider();


// Function to handle sign-in button click
function googleSignIn() {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}



function showLoggedIn(user) {
    console.log(user)
    document.getElementById("login-button").onclick = googleSignOut;
    document.getElementById("login-button").innerHTML = "Logout";
    document.getElementById("greeting-text").innerHTML = "Hallo, " + user["displayName"];

}
function googleSignOut() {
    signOut(auth).then(() => {
        document.getElementById("login-button").onclick = googleSignIn;
        document.getElementById("login-button").innerHTML = "Login";
        document.getElementById("greeting-text").innerHTML = "Bitte einloggen";

    }).catch((error) => {
        // An error happened.
    });


}
onAuthStateChanged(auth,user => {
    if (user != null) {
        console.log("logged in")
        showLoggedIn(user)
    }
    else {
        console.log("logged out")
    }
})


// Function to create entry in Firestore
function createEntryIfNotExists() {
    var user = auth.currentUser;
    if (user) {
        var uid = user.uid;
        var counterValue = document.getElementById('counter').value;

        // Check if the user has an existing entry
        db.collection('users').doc(uid).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log('User entry already exists.');
                } else {
                    // Create new entry with UID as key and counter value as value
                    db.collection('users').doc(uid).set({ [uid]: counterValue })
                        .then(() => {
                            console.log('User entry created successfully.');
                        })
                        .catch((error) => {
                            console.error('Error creating user entry:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error getting user entry:', error);
            });
    }
}
