import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  linkWithCredential,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRvMXFnter-KN_MxTqP1fbmHmgDFb7ywk",
  authDomain: "login-github-cf870.firebaseapp.com",
  projectId: "login-github-cf870",
  storageBucket: "login-github-cf870.appspot.com",
  messagingSenderId: "861902128900",
  appId: "1:861902128900:web:1cd8e810291bb535e5f251",
  measurementId: "G-Q2N8Q66BBY",
};

const app = initializeApp(firebaseConfig);

export const loginWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth(app);
  return await signInWithPopup(auth, googleProvider);
};

export const loginWithGithub = async () => {
  const githubProvider = new GithubAuthProvider();
  const auth = getAuth(app);
  return await signInWithPopup(auth, githubProvider);
};

export const signout = async () => {
  const auth = getAuth();
  console.log('auth', auth)
  await signOut(auth)
    .then(() => {
    })
    .catch((error) => {
      console.log("error", error);
    });
};


