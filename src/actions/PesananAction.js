import { db } from "config/FIREBASE";
import {
  onValue,
  push,
  ref as ref_database,
  set,
  update,
  remove,
} from "firebase/database";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as ref_storage,
  deleteObject,
  listAll,
} from "firebase/storage";
import Swal from "sweetalert2";
import DefaultImage from "../assets/img/default-image.jpg";

export const GET_LIST_PESANAN = "GET_LIST_PESANAN";

//Function untuk baca data Kategori dari Firebase Database
export const getListPesanan = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_PESANAN);

    return onValue(
      ref_database(db, "/pesanan/"),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_LIST_PESANAN, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_LIST_PESANAN, error.message);
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

