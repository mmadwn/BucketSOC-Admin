import { db } from "config/FIREBASE";
import { onValue, ref, update } from "firebase/database";
import {
  API_TIMEOUT,
  BITESHIP_API_HEADER,
  BITESHIP_API_URL,
  dispatchError,
  dispatchLoading,
  dispatchSuccess,
  HEADER_MIDTRANS,
  URL_MIDTRANS_STATUS,
} from "../utils";
import Swal from "sweetalert2";
import axios from "axios";

export const GET_LIST_PESANAN = "GET_LIST_PESANAN";
export const UPDATE_STATUS = "UPDATE_STATUS";

let check_midtrans = 0;
let check_biteship = 0;

export const updateStatus = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, UPDATE_STATUS);
    dispatchLoading(dispatch, GET_LIST_PESANAN);

    return onValue(
      ref(db, "/pesanan/"),
      (snapshot) => {
        const data = snapshot.val();
        const status_pesanan = [];
        if (data) {
          Object.keys(data).forEach((key) => {
            status_pesanan.push(data[key].status_pesanan);
          });
          let item_midtrans = status_pesanan.filter(
            (x) => x === "Menunggu Pembayaran"
          ).length;
          let item_biteship = status_pesanan.filter(
            (x) => x === "Sedang Dikirim"
          ).length;
          Object.keys(data).forEach((key) => {
            if (data[key].url_midtrans) {
              if (data[key].status_pesanan === "Menunggu Pembayaran") {
                dispatch(
                  updateStatusMidtrans(
                    data[key].order_id,
                    item_midtrans,
                    item_biteship
                  )
                );
              } else if (
                data[key].status_pesanan === "Sedang Dikirim" &&
                data[key].biteship_id
              ) {
                dispatch(
                  updateStatusBiteship(
                    data[key].order_id,
                    data[key].biteship_id,
                    item_midtrans,
                    item_biteship
                  )
                );
              }
            }
          });
          if (item_midtrans === 0 && item_biteship === 0) {
            //SUKSES
            dispatchSuccess(dispatch, UPDATE_STATUS, "Cek Status Selesai");
          }
        } else {
          //SUKSES
          dispatchSuccess(dispatch, UPDATE_STATUS, "Cek Status Selesai");
        }
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, UPDATE_STATUS, error.message);
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

export const updateStatusMidtrans = (
  order_id,
  item_midtrans,
  item_biteship
) => {
  return (dispatch) => {
    const tgl_pemesanan = new Date(
      order_id.substring(1, 5) +
        "-" +
        order_id.substring(5, 7) +
        "-" +
        order_id.substring(7, 9) +
        "T" +
        order_id.substring(10, 12) +
        ":" +
        order_id.substring(12, 14) +
        ":" +
        order_id.substring(14, 16)
    ).getTime();
    const now = new Date().getTime();
    const duration = now - tgl_pemesanan;

    const parameter = {
      order_id: order_id,
    };

    axios
      .post("http://localhost:8000/midtrans-status", parameter)
      .then((response) => {
        if (
          response.data.transaction_status === "settlement" ||
          response.data.transaction_status === "capture"
        ) {
          update(ref(db, "/pesanan/" + order_id), {
            status_pesanan: "Menunggu Konfirmasi Admin",
          })
            .then((response) => {
              check_midtrans++;
              dispatch(checkItem(item_midtrans, item_biteship));
            })
            
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, UPDATE_STATUS, error.message);
              Swal.fire({
                title: "Error",
                text: error.message + " [1] order id : " + order_id,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        } else if (
          response.data.transaction_status === "deny" ||
          response.data.transaction_status === "cancel" ||
          response.data.transaction_status === "expire" ||
          response.data.transaction_status === "failure"
        ) {
          update(ref(db, "/pesanan/" + order_id), {
            status_pesanan: "Selesai (Pembayaran Gagal)",
          })
            .then((response) => {
              check_midtrans++;
              dispatch(checkItem(item_midtrans, item_biteship));
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, UPDATE_STATUS, error.message);
              Swal.fire({
                title: "Error",
                text: error.message + " [2] order id : " + order_id,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        } else if (response.data.status_code === "404" && duration > 86400000) {
          update(ref(db, "/pesanan/" + order_id), {
            status_pesanan: "Selesai (Pembayaran Gagal)",
          })
            .then((response) => {
              check_midtrans++;
              dispatch(checkItem(item_midtrans, item_biteship));
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, UPDATE_STATUS, error.message);
              Swal.fire({
                title: "Error",
                text: error.message + " [3] order id : " + order_id,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        } else {
          check_midtrans++;
          dispatch(checkItem(item_midtrans, item_biteship));
        }
      })
      .catch((error) => {
        console.log(error);
        // ERROR
        dispatchError(dispatch, UPDATE_STATUS, error.message);
        Swal.fire({
          title: "Error",
          text: error.message + " [4] order id : " + order_id,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      });
  };
};

export const updateStatusBiteship = (
  order_id,
  biteship_id,
  item_midtrans,
  item_biteship
) => {
  return (dispatch) => {
    axios({
      method: "GET",
      url: BITESHIP_API_URL + "orders/" + biteship_id,
      timeout: API_TIMEOUT,
      headers: BITESHIP_API_HEADER,
    })
      .then((response) => {
        if (response.status !== 200) {
          // ERROR
          dispatchError(dispatch, UPDATE_STATUS, "Error " + response.status);
          Swal.fire({
            title: "Error",
            text: "Error " + response.status + " [5] order id : " + order_id,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        } else {
          //SUKSES
          if (response.data.status === "delivered") {
            update(ref(db, "/pesanan/" + order_id), {
              status_pesanan: "Terkirim",
            })
              .then((response) => {
                check_biteship++;
                dispatch(checkItem(item_midtrans, item_biteship));
              })
              .catch((error) => {
                //ERROR
                dispatchError(dispatch, UPDATE_STATUS, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message + " [6] order id : " + order_id,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              });
          } else if (
            response.data.status === "rejected" ||
            response.data.status === "cancelled" ||
            response.data.status === "courier_not_found" ||
            response.data.status === "returned" ||
            response.data.status === "disposed"
          ) {
            update(ref(db, "/pesanan/" + order_id), {
              status_pesanan: "Pengiriman Gagal",
            })
              .then((response) => {
                check_biteship++;
                dispatch(checkItem(item_midtrans, item_biteship));
              })
              .catch((error) => {
                //ERROR
                dispatchError(dispatch, UPDATE_STATUS, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message + " [7] order id : " + order_id,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              });
          } else {
            check_biteship++;
            dispatch(checkItem(item_midtrans, item_biteship));
          }
        }
      })
      .catch((error) => {
        // ERROR
        dispatchError(dispatch, UPDATE_STATUS, error.message);
        Swal.fire({
          title: "Error",
          text: error.message + " [8] order id : " + order_id,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      });
  };
};

export const checkItem = (item_midtrans, item_biteship) => {
  return (dispatch) => {
    if (check_midtrans === item_midtrans && check_biteship === item_biteship) {
      check_midtrans = 0;
      check_biteship = 0;
      //SUKSES
      dispatchSuccess(dispatch, UPDATE_STATUS, "Cek Status Selesai");
    }
  };
};

//Function untuk baca data Kategori dari Firebase Database
export const getListPesanan = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_PESANAN);

    return onValue(
      ref(db, "/pesanan/"),
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
