import { db } from "config/FIREBASE";
import { onValue, ref, update } from "firebase/database";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";
import Swal from "sweetalert2";
import axios from "axios";

export const GET_LIST_PESANAN = "GET_LIST_PESANAN";
export const UPDATE_STATUS = "UPDATE_STATUS";
export const GET_DETAIL_PESANAN = "GET_DETAIL_PESANAN";
export const CONFIRM_PESANAN = "CONFIRM_PESANAN";
export const REQUEST_PICK_UP = "REQUEST_PICK_UP";
export const CHANGE_DELIVERY_DATE = "CHANGE_DELIVERY_DATE";
export const FINISH_PESANAN = "FINISH_PESANAN";
export const CANCEL_PESANAN = "CANCEL_PESAN";
export const SIAP_DIAMBIL = "SIAP_DIAMBIL";
export const LACAK_PENGIRIMAN = "LACAK_PENGIRIMAN";

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
            dispatchSuccess(dispatch, GET_LIST_PESANAN, data);
            dispatchSuccess(dispatch, UPDATE_STATUS, false);
          }
        } else {
          //SUKSES
          dispatchSuccess(dispatch, GET_LIST_PESANAN, data);
          dispatchSuccess(dispatch, UPDATE_STATUS, false);
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
    const parameter = {
      biteship_id: biteship_id,
    };

    axios
      .post("http://localhost:8000/biteship-status", parameter)
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

//Function untuk baca data Pesanan dari Firebase Database
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

export const getDetailPesanan = (id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_DETAIL_PESANAN);

    return onValue(
      ref(db, "/pesanan/" + id),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_DETAIL_PESANAN, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_DETAIL_PESANAN, error.message);
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

export const confirmOrderWithBiteship = (
  order_id,
  dataBiteship,
  tanggalBaruDatabase,
  waktuBaruDatabase
) => {
  const parameter = {
    data: dataBiteship,
  };
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CONFIRM_PESANAN);

    axios
      .post("http://localhost:8000/biteship-order", parameter)
      .then((response) => {
        if (response.status !== 200) {
          // ERROR
          dispatchError(dispatch, CONFIRM_PESANAN, response);
          Swal.fire({
            title: "Error",
            text: response.status,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        } else {
          const biteship_id = response.data.id;
          const tanggal_pengiriman =
            tanggalBaruDatabase && waktuBaruDatabase
              ? tanggalBaruDatabase + " " + waktuBaruDatabase
              : false;
          update(ref(db, "/pesanan/" + order_id), {
            biteship_id: biteship_id,
            status_pesanan: "Diproses",
            ...(tanggal_pengiriman && {
              tanggal_pengiriman: tanggal_pengiriman,
            }),
          })
            .then((response) => {
              //SUKSES
              dispatchSuccess(
                dispatch,
                CONFIRM_PESANAN,
                response ? response : []
              );
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, CONFIRM_PESANAN, error.message);
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        }
      })
      .catch((error) => {
        // ERROR
        dispatchError(dispatch, CONFIRM_PESANAN, error.response.data.error);
        Swal.fire({
          title: "Error " + "[" + error.response.data.code + "]",
          text: error.response.data.error,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      });
  };
};

export const confirmOrderNoBiteship = (
  order_id,
  tanggalBaruDatabase,
  waktuBaruDatabase
) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CONFIRM_PESANAN);

    const tanggal_pengiriman =
      tanggalBaruDatabase && waktuBaruDatabase
        ? tanggalBaruDatabase + " " + waktuBaruDatabase
        : false;
    update(ref(db, "/pesanan/" + order_id), {
      status_pesanan: "Diproses",
      ...(tanggal_pengiriman && {
        tanggal_pengiriman: tanggal_pengiriman,
      }),
    })
      .then((response) => {
        //SUKSES
        dispatchSuccess(dispatch, CONFIRM_PESANAN, response ? response : []);
      })
      .catch((error) => {
        //ERROR
        dispatchError(dispatch, CONFIRM_PESANAN, error.message);
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

export const requestBiteshipPickUp = (
  order_id,
  biteship_id,
  tanggal_pengiriman,
  waktu_pengiriman,
  tanggal_biteship,
  waktu_biteship
) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, REQUEST_PICK_UP);

    const parameter = {
      biteship_id: biteship_id,
      tanggal_biteship: tanggal_biteship,
      waktu_biteship: waktu_biteship,
    };

    axios
      .post("http://localhost:8000/biteship-pickup", parameter)
      .then((response) => {
        if (response.status !== 200) {
          // ERROR
          dispatchError(dispatch, REQUEST_PICK_UP, response);
          Swal.fire({
            title: "Error",
            text: response.status,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        } else {
          update(ref(db, "/pesanan/" + order_id), {
            status_pesanan: "Sedang Dikirim",
            tanggal_pengiriman: tanggal_pengiriman + " " + waktu_pengiriman,
          })
            .then((response) => {
              //SUKSES
              dispatchSuccess(
                dispatch,
                REQUEST_PICK_UP,
                response ? response : []
              );
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, REQUEST_PICK_UP, error.message);
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        }
      })
      .catch((error) => {
        // ERROR
        dispatchError(dispatch, REQUEST_PICK_UP, error.response.data.error);
        Swal.fire({
          title: "Error " + "[" + error.response.data.code + "]",
          text: error.response.data.error,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      });
  };
};

export const changeDeliveryDate = (
  order_id,
  tanggalDatabase,
  biteship_id,
  dataBiteship
) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CHANGE_DELIVERY_DATE);

    if (biteship_id !== undefined) {
      const parameter = {
        biteship_id: biteship_id,
        data: dataBiteship,
      };

      axios
        .post("http://localhost:8000/biteship-update", parameter)
        .then((response) => {
          if (response.status !== 200) {
            // ERROR
            dispatchError(dispatch, CHANGE_DELIVERY_DATE, response);
            Swal.fire({
              title: "Error",
              text: response.status,
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            update(ref(db, "/pesanan/" + order_id), {
              tanggal_pengiriman: tanggalDatabase,
            })
              .then((response) => {
                //SUKSES
                dispatchSuccess(
                  dispatch,
                  CHANGE_DELIVERY_DATE,
                  response ? response : []
                );
              })
              .catch((error) => {
                //ERROR
                dispatchError(dispatch, CHANGE_DELIVERY_DATE, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              });
          }
        })
        .catch((error) => {
          // ERROR
          dispatchError(
            dispatch,
            CHANGE_DELIVERY_DATE,
            error.response.data.error
          );
          Swal.fire({
            title: "Error " + "[" + error.response.data.code + "]",
            text: error.response.data.error,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });
    } else {
      update(ref(db, "/pesanan/" + order_id), {
        tanggal_pengiriman: tanggalDatabase,
      })
        .then((response) => {
          //SUKSES
          dispatchSuccess(
            dispatch,
            CHANGE_DELIVERY_DATE,
            response ? response : []
          );
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, CHANGE_DELIVERY_DATE, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });
    }
  };
};

export const finishOrder = (order_id, notes) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, FINISH_PESANAN);

    update(ref(db, "/pesanan/" + order_id), {
      status_pesanan:
        notes === "Diterima"
          ? "Selesai (Pesanan Telah Diterima)"
          : "Selesai (Pembeli Mengajukan Komplain)",
    })
      .then((response) => {
        //SUKSES
        dispatchSuccess(dispatch, FINISH_PESANAN, response ? response : []);
      })
      .catch((error) => {
        //ERROR
        dispatchError(dispatch, FINISH_PESANAN, error.message);
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

export const cancelPesanan = (pesanan) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CANCEL_PESANAN);

    //Validasi kembali status pesanan terbaru saat ini
    return onValue(
      ref(db, "/pesanan/" + pesanan.order_id),
      (snapshot) => {
        const data = snapshot.val();
        //Jika statusnya masih menunggu bayar / menunggu konfirmasi admin
        if (
          data.status_pesanan === "Menunggu Pembayaran" ||
          data.status_pesanan === "Menunggu Konfirmasi Admin"
        ) {
          //Cek apakah ada url midtrans, jika ada cek status pembayaran
          if (pesanan.url_midtrans) {
            const parameter = {
              order_id: pesanan.order_id,
            };

            axios
              .post("http://localhost:8000/midtrans-status", parameter)
              .then((response) => {
                //jika status pembayaran masih pending, batalkan pembayaran
                if (response.data.transaction_status === "pending") {
                  axios
                    .post("http://localhost:8000/midtrans-cancel", parameter)
                    .then((response) => {
                      //Jika pembatalan pesanan berhasil
                      if (response.data.transaction_status === "cancel") {
                        update(ref(db, "/pesanan/" + pesanan.order_id), {
                          status_pesanan: "Selesai (Dibatalkan Penjual)",
                        })
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              CANCEL_PESANAN,
                              response ? response : []
                            );
                          })
                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              CANCEL_PESANAN,
                              error.message
                            );
                            Swal.fire({
                              title: "Error",
                              text: error.message,
                              icon: "error",
                              confirmButtonColor: "#f69d93",
                              confirmButtonText: "OK",
                            });
                          });
                      } else {
                        dispatchError(
                          dispatch,
                          CANCEL_PESANAN,
                          "Pembatalan Gagal"
                        );
                        Swal.fire({
                          title: "Error",
                          text: "Tidak dapat membatalkan pesanan ini!",
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      }
                    })
                    .catch((error) => {
                      // ERROR
                      dispatchError(dispatch, CANCEL_PESANAN, error.message);
                      Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#f69d93",
                        confirmButtonText: "OK",
                      });
                    });
                  //Jika pembayaran tidak ditemukan (pembeli belum memilih channel pembayaran)
                } else if (response.data.status_code === "404") {
                  update(ref(db, "/pesanan/" + pesanan.order_id), {
                    status_pesanan: "Selesai (Dibatalkan Penjual)",
                  })
                    .then((response) => {
                      //SUKSES
                      dispatchSuccess(
                        dispatch,
                        CANCEL_PESANAN,
                        response ? response : []
                      );
                    })
                    .catch((error) => {
                      //ERROR
                      dispatchError(dispatch, CANCEL_PESANAN, error.message);
                      Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#f69d93",
                        confirmButtonText: "OK",
                      });
                    });
                  //Jika pembayaran telah berhasil dilakukan tetapi admin belum mengonfirmasi pesanan
                } else if (
                  response.data.transaction_status === "settlement" ||
                  response.data.transaction_status === "capture"
                ) {
                  //Mencoba untuk melakukan refund
                  axios
                    .post("http://localhost:8000/midtrans-refund", parameter)
                    .then((response) => {
                      //Jika refund berhasil
                      if (response.data.transaction_status === "refund") {
                        update(ref(db, "/pesanan/" + pesanan.order_id), {
                          status_pesanan: "Selesai (Dibatalkan Penjual)",
                        })
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              CANCEL_PESANAN,
                              response ? response : []
                            );
                          })
                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              CANCEL_PESANAN,
                              error.message
                            );
                            Swal.fire({
                              title: "Error",
                              text: error.message,
                              icon: "error",
                              confirmButtonColor: "#f69d93",
                              confirmButtonText: "OK",
                            });
                          });
                      } else {
                        dispatchError(
                          dispatch,
                          CANCEL_PESANAN,
                          "Pembatalan Gagal"
                        );
                        Swal.fire({
                          title: "Error",
                          text: "Tidak dapat membatalkan pesanan ini!",
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      }
                    })
                    .catch((error) => {
                      // ERROR
                      dispatchError(
                        dispatch,
                        CANCEL_PESANAN,
                        "Pembatalan Gagal"
                      );
                      Swal.fire({
                        title: "Error",
                        text: "Tidak dapat melakukan pengembalian dana karena pembeli tidak membayar menggunakan QRIS atau E-Wallet. Apakah ingin tetap membatalkan pesanan dengan pengembalian dana secara manual?",
                        icon: "question",
                        width: '800px',
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#f69d93",
                        confirmButtonText:
                          "Ya, Tetap batalkan pesanan dengan pengembalian dana secara manual",
                        cancelButtonText: "Kembali",
                        reverseButtons: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          dispatchLoading(dispatch, CANCEL_PESANAN);
                          update(ref(db, "/pesanan/" + pesanan.order_id), {
                            status_pesanan: "Selesai (Dibatalkan Penjual)",
                          })
                            .then((response) => {
                              //SUKSES
                              dispatchSuccess(
                                dispatch,
                                CANCEL_PESANAN,
                                response ? response : []
                              );
                            })
                            .catch((error) => {
                              //ERROR
                              dispatchError(
                                dispatch,
                                CANCEL_PESANAN,
                                error.message
                              );
                              Swal.fire({
                                title: "Error",
                                text: error.message,
                                icon: "error",
                                confirmButtonColor: "#f69d93",
                                confirmButtonText: "OK",
                              });
                            });
                        }
                      });
                    });
                }
              })
              .catch((error) => {
                // ERROR
                dispatchError(dispatch, CANCEL_PESANAN, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              });
            //Jika tidak ada URL Midtrans (Bayar di Tempat)
          } else {
            update(ref(db, "/pesanan/" + pesanan.order_id), {
              status_pesanan: "Selesai (Dibatalkan Penjual)",
            })
              .then((response) => {
                //SUKSES
                dispatchSuccess(
                  dispatch,
                  CANCEL_PESANAN,
                  response ? response : []
                );
              })
              .catch((error) => {
                //ERROR
                dispatchError(dispatch, CANCEL_PESANAN, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              });
          }
          //Jika statusnya sudah bukan lagi menunggu pembayaran / menunggu konfirmasi admin
        } else {
          //ERROR
          dispatchError(dispatch, CANCEL_PESANAN, "Pembatalan Gagal");
          Swal.fire({
            title: "Error",
            text: "Tidak dapat membatalkan pesanan ini!",
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        }
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, CANCEL_PESANAN, error.message);
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

export const siapDiambil = (order_id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, SIAP_DIAMBIL);

    update(ref(db, "/pesanan/" + order_id), {
      status_pesanan: "Siap Diambil"
    })
      .then((response) => {
        //SUKSES
        dispatchSuccess(dispatch, SIAP_DIAMBIL, response ? response : []);
      })
      .catch((error) => {
        //ERROR
        dispatchError(dispatch, SIAP_DIAMBIL, error.message);
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

export const lacakPengiriman = (biteship_id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, LACAK_PENGIRIMAN);

    const parameter = {
      biteship_id: biteship_id,
    }

     axios
       .post("http://localhost:8000/biteship-status", parameter)
       .then((response) => {
         if (response.status !== 200) {
           // ERROR
           dispatchError(dispatch, LACAK_PENGIRIMAN, "Error " + response.status);
           Swal.fire({
             title: "Error",
             text: "Error " + biteship_id,
             icon: "error",
             confirmButtonColor: "#f69d93",
             confirmButtonText: "OK",
           });
         } else {
           //SUKSES
           dispatchSuccess(dispatch, LACAK_PENGIRIMAN, response.data);
         }
       })
       .catch((error) => {
         // ERROR
         dispatchError(dispatch, LACAK_PENGIRIMAN, error.response.data.error);
         Swal.fire({
           title: "Error " + "[" + error.response.data.code + "]",
           text: error.response.data.error,
           icon: "error",
           confirmButtonColor: "#f69d93",
           confirmButtonText: "OK",
         });
       });
  };
};