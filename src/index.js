import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBw3iGYYRcFdA-ga0V2OVjfh-8-ts_0iiQ",
    authDomain: "firstproject-4d133.firebaseapp.com",
    projectId: "firstproject-4d133",
    storageBucket: "firstproject-4d133.appspot.com",
    messagingSenderId: "184136581498",
    appId: "1:184136581498:web:f2bab6c0d8f51d26dfd6c3",
    measurementId: "G-FXS48RDB88",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();
// collection ref
const colRef = collection(db, "books");

// queries
const q = query(
    colRef,
    // where("author", "==", "Robin Sharma"),
    orderBy("createdAt", "desc")
);

// get collection data
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = [];
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id });
//         });

//         console.log(books);
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });

// realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp(),
    }).then(() => {
        addBookForm.reset();
    });
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", deleteBookForm.id.value);

    deleteDoc(docRef).then(() => {
        deleteBookForm.reset();
    });
});

// get a single document
const docRef = doc(db, "books", "ddgzhXHkb8ppnrJglqtg");

getDoc(docRef).then((doc) => {
    console.log(doc.data(), doc.id);
});

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let docRef = doc(db, "books", updateForm.id.value);

    updateDoc(docRef, {
        title: "new title",
    }).then(() => {
        updateForm.reset();
    });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("User created: ", cred.user);
            signupForm.reset();
        })
        .catch((err) => console.log(err.message));
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("user signed out");
        })
        .catch((err) => {
            console.log(err.message);
        });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("user logged in:", cred.user);
            loginForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
    console.log("unsubscribing");
    unsubCol();
    unsubDoc();
    unsubAuth();
});
