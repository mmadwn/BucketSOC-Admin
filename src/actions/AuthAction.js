import { db } from "config/FIREBASE";
import {
    getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import Swal from "sweetalert2";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";

export const LOGIN_USER = "LOGIN_USER";

export const loginUser = (email, password) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, LOGIN_USER);

    return onValue(
      query(
        ref(db, '/users/'),
        orderByChild('email'),
        equalTo(email)
      ),
      (snapshot) => {
        const data = snapshot.val();
        let Profile = [];
        Object.keys(data).forEach((key) => {
          Profile.push(data[key]);
        });
        if (Profile[0].status === "admin") {
          //LOGIN
           signInWithEmailAndPassword(getAuth(), email, password)
             .then((response) => {
               // Signed in
               window.localStorage.setItem("user", JSON.stringify(Profile[0]));
               dispatchSuccess(dispatch, LOGIN_USER, Profile[0]);
             })
             .catch((error) => {
               //ERROR
               dispatchError(dispatch, LOGIN_USER, error.message);
               if (
                 error.code === "auth/invalid-email" ||
                 error.code === "auth/wrong-password"
               ) {
                 Swal.fire({
                   title: "Error",
                   text: "Email atau password salah!",
                   icon: "error",
                   confirmButtonColor: "#f69d93",
                   confirmButtonText: "OK",
                 });
               } else if (error.code === "auth/network-request-failed") {
                 Swal.fire({
                   title: "Error",
                   text: "Mohon periksa jaringan Anda!",
                   icon: "error",
                   confirmButtonColor: "#f69d93",
                   confirmButtonText: "OK",
                 });
               } else {
                 Swal.fire({
                   title: "Error",
                   text: error.message,
                   icon: "error",
                   confirmButtonColor: "#f69d93",
                   confirmButtonText: "OK",
                 });
               }
             });
        } else {
          //ERROR
          dispatchError(dispatch, LOGIN_USER, "Anda bukan Admin!");
          Swal.fire({
            title: "Error",
            text: "Anda bukan Admin!",
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        }
      },
      {
        onlyOnce: true,
      }
    );   
  };
};
