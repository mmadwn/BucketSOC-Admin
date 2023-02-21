import { db } from "config/FIREBASE";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import Swal from "sweetalert2";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";

export const LOGIN_USER = "LOGIN_USER";
export const CHECK_LOGIN = "CHECK_LOGIN";
export const LOGOUT_USER = "LOGOUT_USER";

export const loginUser = (email, password) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, LOGIN_USER);

    //Baca data di firebase berdasarkan email yang dimasukkan
    return onValue(
      query(ref(db, "/users/"), orderByChild("email"), equalTo(email)),
      (snapshot) => {
        //Jika email ditemukan di database
        if (snapshot.val()) {
          const data = snapshot.val();
          let Profile = [];
          Object.keys(data).forEach((key) => {
            Profile.push(data[key]);
          });
          //Cek status akun apakah admin
          if (Profile[0].status === "admin") {
            //LOGIN
            signInWithEmailAndPassword(getAuth(), email, password)
              .then((response) => {
                console.log(response)
                // Signed in
                //Simpan data user ke localstorage dari database
                window.localStorage.setItem("user", JSON.stringify(Profile[0]));
                dispatchSuccess(dispatch, LOGIN_USER, Profile[0]);
              })
              .catch((error) => {
                //ERROR LOGIN
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
            //Jika status user bukan admin
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
          //Jika email tidak ditemukan
        } else {
          //ERROR
          dispatchError(dispatch, LOGIN_USER, "Email atau password salah!");
          Swal.fire({
            title: "Error",
            text: "Email atau password salah!",
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        }
      },
      {
        onlyOnce: true,
      },
      //Error baca data di database
      (error) => {
        //ERROR
        dispatchError(dispatch, LOGIN_USER, error.message);
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

export const checkLogin = (history) => {
  return (dispatch) => {
    dispatchLoading(dispatch, CHECK_LOGIN);

    //Jika belum login(data belum ada di local storage)
    if (window.localStorage.getItem("user")) {
      const user = JSON.parse(window.localStorage.getItem("user"));

      //Baca akun di database
      return onValue(
        ref(db, "/users/" + user.uid),
        (snapshot) => {
          const data = snapshot.val();
          //jika akun ditemukan
          if (data) {
            //cek apakah statusnya admin
            if (data.status === "admin") {
              //SUKSES
              dispatchSuccess(dispatch, CHECK_LOGIN, data);
            } else {
              //ERROR jika bukan admin
              dispatchError(dispatch, CHECK_LOGIN, "Anda bukan Admin!");
              Swal.fire({
                title: "Error",
                text: "Anda bukan Admin!",
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              }).then(() => {
                history.push({ pathname: "/login" });
              });
            }
          } else {
            //ERROR jika akun tidak ditemukan di database
            dispatchError(dispatch, CHECK_LOGIN, "Akun tidak terdaftar!");
            Swal.fire({
              title: "Error",
              text: "Akun tidak terdaftar!",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            }).then(() => {
              history.push({ pathname: "/login" });
            });
          }
        },
        {
          onlyOnce: true,
        },
        (error) => {
          //ERROR baca data firebase
          dispatchError(dispatch, CHECK_LOGIN, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      //ERROR jika
      dispatchError(dispatch, CHECK_LOGIN, "Anda belum login");
      history.push({ pathname: "/login" });
    }
  };
};

export const logoutUser = (history) => {
  return (dispatch) => {
    dispatchLoading(dispatch, LOGOUT_USER);

    signOut(getAuth())
      .then((res) => {
        // Sign-out successful.
        window.localStorage.removeItem("user");
        dispatchSuccess(dispatch, LOGOUT_USER, res);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Logout successfully!",
        });
        history.push({ pathname: "/login" });
      })
      .catch((error) => {
        // An error happened.
        dispatchError(dispatch, LOGOUT_USER, error.message);
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
