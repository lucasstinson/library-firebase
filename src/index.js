// import { auth, createUser, signIn, logOut } from "./firebase.js";

// Users should be able to register and login with an email address
// The user should also be able to sign out of their account
// Each book needs to be captured on Firebase
// Any updates such as toggling read or not should be updated.

import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXZK847z0mFqWwZZQTC9MHn-L3XBILB9Q",
  authDomain: "library-f3336.firebaseapp.com",
  projectId: "library-f3336",
  storageBucket: "library-f3336.appspot.com",
  messagingSenderId: "659513606574",
  appId: "1:659513606574:web:4010a2801b13764e45083f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Create an account with an email and password
async function createUser(auth, email, password) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user;
    console.log("Your account has been created");
    console.log("Username:", user.email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// Sign in with email and password after creation
async function signIn(auth, email, password) {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const user = credentials.user;
    console.log("You have succesffully logged in");
    console.log("Username:", user.email);
    loggedIn(user.email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// log out
async function logOut() {
  try {
    const signingOut = await signOut(auth);
    console.log("You have succesffully logged Out");
    loggedOut();
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

// adds book Data to firestore with unique ID
async function addData(title, author, pages, read) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      // id: docRef.id,
      user: currentUser,
      book: title,
      author: author,
      pages: pages,
      read: read,
    });
    readData();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function readData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  myLibrary = [];
  if (currentUser == "") {
    cleanDom();
  } else {
    querySnapshot.forEach((doc) => {
      if (doc.data().user == currentUser) {
        let id = doc.id;
        let title = doc.data().book;
        let author = doc.data().author;
        let pages = doc.data().pages;
        let read = doc.data().read;
        let book = new Book(title, author, pages, read, id);
        myLibrary.push(book);
      }
    });
  }
  displayLibrary();
}

async function updateRead(id, checked) {
  const bookRef = doc(db, "users", id);

  try {
    await updateDoc(bookRef, {
      read: !checked,
    });
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

async function deleteData(id) {
  await deleteDoc(doc(db, "users", id));
}
// checks the authentication state of user and if logged in updates display
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    loggedIn(user.email);
    currentUser = user.email;
    readData();
  }
});

const db = getFirestore(app);

const showFormButton = document.querySelector(".add-book");
const bookForm = document.querySelector(".book-form");
const addBookButton = document.querySelector("#submit");
const bookWrap = document.querySelector(".books-wrapper");
const bookTitle = document.querySelector("#title");
const bookAuthor = document.querySelector("#author");
const bookPages = document.querySelector("#pages");
const bookRead = document.querySelector(".switch");
const formSection = document.querySelector("form");
const titleWrapper = document.querySelector(".title-wrapper");
let deleteButton = document.querySelectorAll(".delete-book");
const register = document.querySelector(".register");
const registerForm = document.querySelector(".register-background");
const submitRegister = document.querySelector(".submit-register");
const logIn = document.querySelector(".sign-in");
const signInForm = document.querySelector(".sign-in-background");
const submitSignIn = document.querySelector(".submit-sign-in");

let myLibrary = [];
let currentColorMode = 0;
let currentUser = "";

function Book(title, author, pages, read, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
}

// const book1 = new Book("The Hobbit", "J.R.R Tolkien", "295", "No");
// myLibrary.push(book1);

function toggleForm() {
  if (bookForm.className == "book-form") {
    bookForm.classList = "book-form-active";
  } else {
    bookForm.className = "book-form";
  }
}

function validateForm() {
  if (bookTitle.value == "") {
    setError(bookTitle);
  } else bookTitle.style.borderColor = "";

  if (bookAuthor.value == "") {
    setError(bookAuthor);
  } else bookAuthor.style.borderColor = "";

  if (bookPages.value == "" || isNaN(bookPages.value)) {
    setError(bookPages);
  } else bookPages.style.borderColor = "";

  if (
    bookTitle.value == "" ||
    bookAuthor.value == "" ||
    bookPages.value == ""
  ) {
    return false;
  } else return true;
}

function setError(a) {
  a.style.borderColor = "red";
}

function addBook() {
  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookPages.value;
  let read = bookRead.children[0].checked;
  deleteButton = document.querySelectorAll(".delete-book");
  if (currentUser != "") {
    addData(title, author, pages, read);
  } else {
    myLibrary.push(new Book(title, author, pages, read, "noID"));
    displayLibrary();
  }
}

function preventSubmission(e) {
  // prevent button from submitting/refreshing the page
  e.preventDefault();
}

function clearBookForm() {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookPages.value = "";
  bookRead.checked = false;
}

function displayLibrary() {
  cleanDom();
  myLibrary.sort((a, b) => {
    let aTitle = a.title.toLowerCase();
    let bTitle = b.title.toLowerCase();
    if (aTitle < bTitle) return -1;
    if (aTitle > bTitle) return 1;
    return 0;
  });
  for (let i = 0; i < myLibrary.length; i++) {
    let book = document.createElement("div");
    book.className = "book";
    book.dataset.identifier = myLibrary[i].id;
    document.querySelector(".books-wrapper").appendChild(book);
    addTitle(book, i);
    addAuthor(book, i);
    addPages(book, i);
    addRead(book, i);
    addDelete(book);

    deleteButton = document.querySelectorAll(".delete-book");
    addDeleteEventListeners(deleteButton);
  }
}

function cleanDom() {
  const booksWrapper = document.querySelector(".books-wrapper");
  while (booksWrapper.firstChild) {
    booksWrapper.removeChild(booksWrapper.lastChild);
  }
}

function addTitle(book, index) {
  let titleWrapper = document.createElement("div");
  titleWrapper.className = "title-wrapper";
  book.appendChild(titleWrapper);

  let titleCategory = document.createElement("div");
  titleCategory.className = "title-category";
  titleCategory.innerHTML = "Title:";
  titleWrapper.appendChild(titleCategory);

  let titleOfBook = document.createElement("div");
  titleOfBook.className = "book-title";
  titleOfBook.innerHTML = myLibrary[index].title;
  titleWrapper.appendChild(titleOfBook);
}

function addAuthor(book, index) {
  let authorWrapper = document.createElement("div");
  authorWrapper.className = "author-wrapper";
  book.appendChild(authorWrapper);

  let authorCategory = document.createElement("div");
  authorCategory.className = "author-category";
  authorCategory.innerHTML = "Author:";
  authorWrapper.appendChild(authorCategory);

  let authorOfBook = document.createElement("div");
  authorOfBook.className = "book-author";
  authorOfBook.innerHTML = myLibrary[index].author;
  authorWrapper.appendChild(authorOfBook);
}

function addPages(book, index) {
  let pageWrapper = document.createElement("div");
  pageWrapper.className = "page-wrapper";
  book.appendChild(pageWrapper);

  let pageCategory = document.createElement("div");
  pageCategory.className = "page-category";
  pageCategory.innerHTML = "Page Count:";
  pageWrapper.appendChild(pageCategory);

  let pageCountOfBook = document.createElement("div");
  pageCountOfBook.className = "book-pages";
  pageCountOfBook.innerHTML = myLibrary[index].pages;
  pageWrapper.appendChild(pageCountOfBook);
}

function addRead(book, index) {
  let readWrapper = document.createElement("div");
  readWrapper.className = "read-wrapper";
  book.appendChild(readWrapper);

  let readCategory = document.createElement("div");
  readCategory.className = "read-category";
  readCategory.innerHTML = "Read:";
  readWrapper.appendChild(readCategory);

  let readBook = document.createElement("div");
  readBook.className = "book-read";
  readWrapper.appendChild(readBook);

  let slider = document.createElement("label");
  slider.className = "switch";
  readBook.appendChild(slider);

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  slider.appendChild(checkbox);
  checkbox.checked = myLibrary[index].read;

  let sliderStyle = document.createElement("span");
  sliderStyle.className = "slider round";
  sliderStyle.addEventListener("click", readStatus);
  slider.appendChild(sliderStyle);
}

function addDelete(book) {
  let deleteWrapper = document.createElement("div");
  deleteWrapper.className = "delete-book-container";
  book.appendChild(deleteWrapper);

  let deleteCategory = document.createElement("button");
  deleteCategory.className = "delete-book";
  deleteCategory.innerHTML = "DELETE";
  deleteWrapper.appendChild(deleteCategory);
}

function deleteBook(e) {
  if (currentUser != "") {
    let identifier = e.target.parentNode.parentNode.dataset.identifier;
    deleteData(identifier);
    e.target.parentNode.parentNode.remove();
  } else {
    e.target.parentNode.parentNode.remove();
    deleteButton = document.querySelectorAll(".delete-book");
    addDeleteEventListeners(deleteButton);
  }
}

function addDeleteEventListeners(deleteButton) {
  deleteButton.forEach((e) => {
    e.addEventListener("click", deleteBook);
  });
}

deleteButton.forEach((e) => {
  e.addEventListener("click", deleteBook);
});

function toggleRegister() {
  if (registerForm.className == "register-background") {
    registerForm.classList = "register-background-active";
  } else {
    registerForm.className = "register-background";
  }
}

function toggleSignIn() {
  if (signInForm.className == "sign-in-background") {
    signInForm.classList = "sign-in-background-active";
  } else {
    signInForm.className = "sign-in-background";
  }
}

function registerToFirebase(e) {
  e.preventDefault();
  const registerForm = document.querySelector(".register-form");
  const email = e.target.parentNode.children[0].children[1].value;
  const password = e.target.parentNode.children[1].children[1].value;
  createUser(auth, email, password);
  // registerForm.reset();
  toggleRegister();
}

function signInFirebase(e) {
  e.preventDefault();
  const signInForm = document.querySelector(".sign-in-form");
  const userEmail = document.querySelector(".sign-in-form #user_email");
  const userPassword = document.querySelector(".sign-in-form #user_password");
  const email = userEmail.value;
  const password = userPassword.value;
  signIn(auth, email, password);
  // signInForm.reset();
  toggleSignIn();
}

function loggedIn(email) {
  const header = document.querySelector(".header");
  const setUpButtons = document.querySelector(".account-setup-container");
  let loggedIn = document.createElement("div");
  loggedIn.className = "account-loggedin-container";

  let greeting = document.createElement("div");
  greeting.className = "greeting-user";
  greeting.innerHTML = `Hi, ${email}`;
  loggedIn.appendChild(greeting);

  let signOutButton = document.createElement("button");
  signOutButton.className = "sign-out";
  signOutButton.innerHTML = "Sign Out";
  signOutButton.addEventListener("click", logOut);
  loggedIn.appendChild(signOutButton);

  if (setUpButtons != null) {
    header.replaceChild(loggedIn, setUpButtons);
  }
}

function loggedOut() {
  const header = document.querySelector(".header");
  const loggedIn = document.querySelector(".account-loggedin-container");

  let setUpButtons = document.createElement("div");
  setUpButtons.className = "account-setup-container";

  let registerButton = document.createElement("button");
  registerButton.className = "register";
  registerButton.innerHTML = "Register";
  setUpButtons.appendChild(registerButton);

  let signInButton = document.createElement("button");
  signInButton.className = "sign-in";
  signInButton.innerHTML = "Sign In";
  signInButton.addEventListener("click", toggleSignIn);
  setUpButtons.appendChild(signInButton);

  header.replaceChild(setUpButtons, loggedIn);
  currentUser = "";
  readData();
}

function readStatus(e) {
  if (currentUser != "") {
    let checkedStatus = e.target.parentNode.firstChild.checked;
    let book = e.target.parentNode.parentNode.parentNode.parentNode;
    let identifier = book.dataset.identifier;
    updateRead(identifier, checkedStatus);
  }
}

showFormButton.addEventListener("click", toggleForm);
addBookButton.addEventListener("click", preventSubmission);
addBookButton.addEventListener("click", () => {
  if (validateForm() == true) {
    addBook(), clearBookForm();
  }
});
register.addEventListener("click", toggleRegister);
submitRegister.addEventListener("click", registerToFirebase);
logIn.addEventListener("click", toggleSignIn);
submitSignIn.addEventListener("click", signInFirebase);
