import { db } from "config/FIREBASE";
import {
  onValue,
  ref as ref_database,
} from "firebase/database";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";
import Swal from "sweetalert2";

export const GET_LIST_USER = "GET_LIST_USER";

//Function untuk baca data User dari Firebase Database
export const getListUser = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_USER);

    return onValue(
      ref_database(db, "/users/"),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_LIST_USER, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_LIST_USER, error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );
  };
};
