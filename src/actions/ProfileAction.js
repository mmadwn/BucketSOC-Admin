import { db } from "config/FIREBASE";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { equalTo, onValue, orderByChild, query, ref, update } from "firebase/database";
import Swal from "sweetalert2";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";

export const GET_DETAIL_PROFILE = "GET_DETAIL_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE"

export const getDetailProfile = (uid) => {
    return (dispatch) => {
        //LOADING
        dispatchLoading(dispatch, GET_DETAIL_PROFILE)

        //Baca akun di database
        return onValue(
            ref(db, "/users/" + uid),
            (snapshot) => {
                const data = snapshot.val();
                //SUKSES
                dispatchSuccess(dispatch, GET_DETAIL_PROFILE, data);
            },
            {
                onlyOnce: true,
            },
            (error) => {
                //ERROR baca data firebase
                dispatchError(dispatch, GET_DETAIL_PROFILE, error.message);
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonColor: "#f69d93",
                    confirmButtonText: "OK",
                });
            }
        );
    }
}

export const updateProfile = data => {
    return dispatch => {
      //LOADING
      dispatchLoading(dispatch, UPDATE_PROFILE);
  
      //Simpan data ke Firebase Realtime Database sesuai uid
      update(ref(db, 'users/' + data.uid), data)
        .then(response => {
          //SUKSES
          dispatchSuccess(dispatch, UPDATE_PROFILE, response ? response : []);
  
          //Simpan data Ke Local Storage
          window.localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(error => {
          //ERROR
          dispatchError(dispatch, UPDATE_PROFILE, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
        });
        });
    };
  };