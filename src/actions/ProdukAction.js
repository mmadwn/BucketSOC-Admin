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

export const GET_LIST_PRODUK = "GET_LIST_PRODUK";
export const TAMBAH_PRODUK = "TAMBAH_PRODUK";
export const GET_DETAIL_PRODUK = "GET_DETAIL_PRODUK";
export const UPDATE_PRODUK = "UPDATE_PRODUK";
export const DELETE_PRODUK = "DELETE_PRODUK";

//Function untuk baca data Kategori dari Firebase Database
export const getListProduk = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_PRODUK);

    return onValue(
      ref_database(db, "/produk/"),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_LIST_PRODUK, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_LIST_PRODUK, error.message);
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

export const getDetailProduk = (id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_DETAIL_PRODUK);

    return onValue(
      ref_database(db, "/produk/" + id),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_DETAIL_PRODUK, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_DETAIL_PRODUK, error.message);
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

//Function untuk tambah data Kategori ke Firebase Database dan Firebase Storage
export const tambahProduk = (data) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, TAMBAH_PRODUK);

    //Upload data ke Firebase Storage
    const storage = getStorage();
    const listRef = ref_storage(storage, "Produk/");
    let imageName1 = data.imageToDB1.name.replace(/ /g, "_");

    //Jika gambar 2 diupload
    if (data.imageToDB2) {
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (
            gambarList.includes(imageName1) === true ||
            gambarList.includes(imageName2) === true
          ) {
            //ERROR
            dispatchError(dispatch, TAMBAH_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " atau " +
                data.imageToDB2.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //Upload gambar 1 ke firebase storage
            const storageRef1 = ref_storage(storage, "Produk/" + imageName1);
            const uploadTask1 = uploadBytesResumable(
              storageRef1,
              data.imageToDB1
            );
            uploadTask1.on(
              "state_changed",
              (snapshot) => {
                //Berhasil upload gambar ke Firebase Storage
              },
              (error) => {
                dispatchError(dispatch, TAMBAH_PRODUK, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              },
              () => {
                // Handle successful uploads on complete upload gambar 1
                getDownloadURL(uploadTask1.snapshot.ref).then(
                  (downloadURL1) => {
                    //Upload gambar 2 ke firebase storage
                    const storageRef2 = ref_storage(
                      storage,
                      "Produk/" + imageName2
                    );
                    const uploadTask2 = uploadBytesResumable(
                      storageRef2,
                      data.imageToDB2
                    );
                    uploadTask2.on(
                      "state_changed",
                      (snapshot) => {
                        //Berhasil upload gambar ke Firebase Storage
                      },
                      (error) => {
                        dispatchError(dispatch, TAMBAH_PRODUK, error.message);
                        Swal.fire({
                          title: "Error",
                          text: error.message,
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      },
                      () => {
                        // Handle successful uploads on complete upload gambar 2
                        getDownloadURL(uploadTask2.snapshot.ref).then(
                          (downloadURL2) => {
                            //Tambahkan data ke Realtime Database
                            const newdata = {
                              gambar: [downloadURL1, downloadURL2],
                              nama: data.namaProduk,
                              deskripsi: data.deskripsiProduk,
                              harga: Number(data.harga),
                              kategori: data.kategori,
                              ready: data.ready,
                            };
                            //Simpan data kategori ke Firebase database
                            set(push(ref_database(db, "/produk/")), newdata)
                              .then((response) => {
                                //SUKSES
                                dispatchSuccess(
                                  dispatch,
                                  TAMBAH_PRODUK,
                                  response ? response : []
                                );
                              })
                              .catch((error) => {
                                //ERROR
                                dispatchError(
                                  dispatch,
                                  TAMBAH_PRODUK,
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
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, TAMBAH_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika gambar 2 tidak ada
    } else {
      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName1) === true) {
            //ERROR
            dispatchError(dispatch, TAMBAH_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //Upload data ke firebase storage
            const storageRef = ref_storage(storage, "Produk/" + imageName1);
            const uploadTask = uploadBytesResumable(
              storageRef,
              data.imageToDB1
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                //Berhasil upload gambar ke Firebase Storage
              },
              (error) => {
                dispatchError(dispatch, TAMBAH_PRODUK, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              },
              () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  const newdata = {
                    gambar: [downloadURL],
                    nama: data.namaProduk,
                    deskripsi: data.deskripsiProduk,
                    harga: Number(data.harga),
                    kategori: data.kategori,
                    ready: data.ready,
                  };
                  //Simpan data kategori ke Firebase database
                  set(push(ref_database(db, "/produk/")), newdata)
                    .then((response) => {
                      //SUKSES
                      dispatchSuccess(
                        dispatch,
                        TAMBAH_PRODUK,
                        response ? response : []
                      );
                    })

                    .catch((error) => {
                      //ERROR
                      dispatchError(dispatch, TAMBAH_PRODUK, error.message);
                      Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#f69d93",
                        confirmButtonText: "OK",
                      });
                    });
                });
              }
            );
          }
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, TAMBAH_PRODUK, error.message);
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

export const updateProduk = (data) => {
  return (dispatch) => {
    dispatchLoading(dispatch, UPDATE_PRODUK);

    //cek apakah gambar 2 ada
    if (data.image2 !== DefaultImage) {
      //Cek apakah gambar 1 diganti dan gambar 2 ada
      if (data.imageToDB1) {
        //Cek apakah gambar 2 diganti dan gambar 1 juga diganti
        if (data.imageToDB2) {
          //cek kedua gambar, lalu hapus dan upload ulang keduanya
          dispatch(gambar1DigantiDanGambar2Diganti(data));
          //Jika gambar 1 diganti dan gambar 2 tidak diganti
        } else {
          dispatch(gambar1DigantiDanGambar2TidakDiganti(data));
          //Cek apakah gambar 1 tidak ada yang sama di storage, lalu upload ulang dan upload database gambar 1
        }
        //Jika gambar 1 tidak diganti dan gambar 2 ada
      } else {
        //Cek apakah gambar 2 diganti dan gambar 1 tidak diganti
        if (data.imageToDB2) {
          //Cek apakah gambar 2 ada yang sama di storage, lalu hapus gambar lama dan upload baru
          dispatch(gambar1TidakDigantiDanGambar2Diganti(data));
          //Jika gambar 1 dan 2 tidak diganti
        } else {
          //Langsung upload data ke realtime database
          dispatch(gambar1TidakDigantiDanGambar2TidakDiganti(data));
        }
      }
    }
    //Jika gambar 2 tidak ada
    else {
      //Cek apakah gambar 1 diganti
      if (data.imageToDB1) {
        //Cek dulu apakah nama file tidak ada yang sama di storage
        //Kalo tidak sama hapus dan upload baru, lalu upload database
        dispatch(gambar1DigantiDanGambar2TidakAda(data));
        //Jika gambar 1 tidak diganti
      } else {
        //Langsung upload data ke realtime database
        dispatch(gambar1TidakDigantiDanGambar2TidakAda(data));
      }
    }
  };
};

export const gambar1DigantiDanGambar2Diganti = (data) => {
  console.log("gambar1DigantiDanGambar2Diganti");
  return (dispatch) => {
    //Jika gambar 2 sebelumnya ada di storage
    if (data.imageLama2) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (
            gambarList.includes(imageName1) === true ||
            gambarList.includes(imageName2) === true
          ) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " atau " +
                data.imageToDB2.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath1 = data.imageLama1.replace(baseUrl, "");
            let imagePath2 = data.imageLama2.replace(baseUrl, "");
            const indexOfEndPath1 = imagePath1.indexOf("?");
            const indexOfEndPath2 = imagePath2.indexOf("?");
            imagePath1 = imagePath1.substring(0, indexOfEndPath1);
            imagePath2 = imagePath2.substring(0, indexOfEndPath2);
            imagePath1 = imagePath1.replace("%2F", "/");
            imagePath2 = imagePath2.replace("%2F", "/");
            const storage = getStorage();
            const imageRef1 = ref_storage(storage, imagePath1);
            const imageRef2 = ref_storage(storage, imagePath2);

            // Delete the file 1
            deleteObject(imageRef1)
              .then(() => {
                // Delete the file 2
                deleteObject(imageRef2)
                  .then(() => {
                    const storage = getStorage();
                    let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
                    let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
                    const storageRef1 = ref_storage(
                      storage,
                      "Produk/" + imageName1
                    );
                    const storageRef2 = ref_storage(
                      storage,
                      "Produk/" + imageName2
                    );
                    const uploadTask1 = uploadBytesResumable(
                      storageRef1,
                      data.imageToDB1
                    );
                    const uploadTask2 = uploadBytesResumable(
                      storageRef2,
                      data.imageToDB2
                    );

                    //  Upload gambar 1 yang baru
                    uploadTask1.on(
                      "state_changed",
                      (snapshot) => {
                        //Berhasil upload gambar ke Firebase Storage
                      },
                      (error) => {
                        dispatchError(dispatch, UPDATE_PRODUK, error.message);
                        Swal.fire({
                          title: "Error",
                          text: error.message,
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      },
                      () => {
                        //  Upload gambar 2 yang baru
                        uploadTask2.on(
                          "state_changed",
                          (snapshot) => {
                            //Berhasil upload gambar ke Firebase Storage
                          },
                          (error) => {
                            dispatchError(
                              dispatch,
                              UPDATE_PRODUK,
                              error.message
                            );
                            Swal.fire({
                              title: "Error",
                              text: error.message,
                              icon: "error",
                              confirmButtonColor: "#f69d93",
                              confirmButtonText: "OK",
                            });
                          },
                          () => {
                            // Handle successful uploads on complete
                            getDownloadURL(uploadTask1.snapshot.ref).then(
                              (downloadURL1) => {
                                getDownloadURL(uploadTask2.snapshot.ref).then(
                                  (downloadURL2) => {
                                    const newdata = {
                                      gambar: [downloadURL1, downloadURL2],
                                      nama: data.namaProduk,
                                      deskripsi: data.deskripsiProduk,
                                      harga: Number(data.harga),
                                      kategori: data.kategori,
                                      ready: data.ready,
                                    };
                                    //Simpan data kategori ke Firebase database
                                    update(
                                      ref_database(db, "/produk/" + data.id),
                                      newdata
                                    )
                                      .then((response) => {
                                        //SUKSES
                                        dispatchSuccess(
                                          dispatch,
                                          UPDATE_PRODUK,
                                          response ? response : []
                                        );
                                      })

                                      .catch((error) => {
                                        //ERROR
                                        dispatchError(
                                          dispatch,
                                          UPDATE_PRODUK,
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
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  })
                  .catch((error) => {
                    dispatchError(dispatch, UPDATE_PRODUK, error.message);
                    Swal.fire({
                      title: "Error",
                      text: error.message,
                      icon: "error",
                      confirmButtonColor: "#f69d93",
                      confirmButtonText: "OK",
                    });
                  });
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika gambar 2 sebelumnya tidak ada di storage
    } else {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (
            gambarList.includes(imageName1) === true ||
            gambarList.includes(imageName2) === true
          ) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " atau " +
                data.imageToDB2.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath1 = data.imageLama1.replace(baseUrl, "");
            const indexOfEndPath1 = imagePath1.indexOf("?");
            imagePath1 = imagePath1.substring(0, indexOfEndPath1);
            imagePath1 = imagePath1.replace("%2F", "/");
            const storage = getStorage();
            const imageRef1 = ref_storage(storage, imagePath1);

            // Delete the file 1
            deleteObject(imageRef1)
              .then(() => {
                const storage = getStorage();
                let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
                let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
                const storageRef1 = ref_storage(
                  storage,
                  "Produk/" + imageName1
                );
                const storageRef2 = ref_storage(
                  storage,
                  "Produk/" + imageName2
                );
                const uploadTask1 = uploadBytesResumable(
                  storageRef1,
                  data.imageToDB1
                );
                const uploadTask2 = uploadBytesResumable(
                  storageRef2,
                  data.imageToDB2
                );

                //  Upload gambar 1 yang baru
                uploadTask1.on(
                  "state_changed",
                  (snapshot) => {
                    //Berhasil upload gambar ke Firebase Storage
                  },
                  (error) => {
                    dispatchError(dispatch, UPDATE_PRODUK, error.message);
                    Swal.fire({
                      title: "Error",
                      text: error.message,
                      icon: "error",
                      confirmButtonColor: "#f69d93",
                      confirmButtonText: "OK",
                    });
                  },
                  () => {
                    //  Upload gambar 2 yang baru
                    uploadTask2.on(
                      "state_changed",
                      (snapshot) => {
                        //Berhasil upload gambar ke Firebase Storage
                      },
                      (error) => {
                        dispatchError(dispatch, UPDATE_PRODUK, error.message);
                        Swal.fire({
                          title: "Error",
                          text: error.message,
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      },
                      () => {
                        // Handle successful uploads on complete
                        getDownloadURL(uploadTask1.snapshot.ref).then(
                          (downloadURL1) => {
                            getDownloadURL(uploadTask2.snapshot.ref).then(
                              (downloadURL2) => {
                                const newdata = {
                                  gambar: [downloadURL1, downloadURL2],
                                  nama: data.namaProduk,
                                  deskripsi: data.deskripsiProduk,
                                  harga: Number(data.harga),
                                  kategori: data.kategori,
                                  ready: data.ready,
                                };
                                //Simpan data kategori ke Firebase database
                                update(
                                  ref_database(db, "/produk/" + data.id),
                                  newdata
                                )
                                  .then((response) => {
                                    //SUKSES
                                    dispatchSuccess(
                                      dispatch,
                                      UPDATE_PRODUK,
                                      response ? response : []
                                    );
                                  })

                                  .catch((error) => {
                                    //ERROR
                                    dispatchError(
                                      dispatch,
                                      UPDATE_PRODUK,
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
                            );
                          }
                        );
                      }
                    );
                  }
                );
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const gambar1DigantiDanGambar2TidakDiganti = (data) => {
  console.log("gambar1DigantiDanGambar2TidakDiganti");
  return (dispatch) => {
    const storage = getStorage();
    const listRef = ref_storage(storage, "Produk/");
    let imageName1 = data.imageToDB1.name.replace(/ /g, "_");

    //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
    listAll(listRef)
      .then((res) => {
        let gambarList = [];
        res.items.forEach((itemRef) => {
          gambarList.push(itemRef._location.path_.replace("Produk/", ""));
        });
        if (gambarList.includes(imageName1) === true) {
          //ERROR jika file sudah ada
          dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
          Swal.fire({
            title: "Error",
            text:
              "File " +
              data.imageToDB1.name +
              " sudah ada. Silakan ubah nama file terlebih dahulu.",
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        } else {
          //  Ambil dan hapus gambar yang lama dari firebase storage
          const baseUrl =
            "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
          let imagePath1 = data.imageLama1.replace(baseUrl, "");
          const indexOfEndPath = imagePath1.indexOf("?");
          imagePath1 = imagePath1.substring(0, indexOfEndPath);
          imagePath1 = imagePath1.replace("%2F", "/");
          const storage = getStorage();
          const imageRef1 = ref_storage(storage, imagePath1);

          // Delete the file
          deleteObject(imageRef1)
            .then(() => {
              //  Upload gambar yang baru
              const storage = getStorage();
              let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
              const storageRef1 = ref_storage(storage, "Produk/" + imageName1);
              const uploadTask1 = uploadBytesResumable(
                storageRef1,
                data.imageToDB1
              );

              uploadTask1.on(
                "state_changed",
                (snapshot) => {
                  //Berhasil upload gambar ke Firebase Storage
                },
                (error) => {
                  dispatchError(dispatch, UPDATE_PRODUK, error.message);
                  Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonColor: "#f69d93",
                    confirmButtonText: "OK",
                  });
                },
                () => {
                  // Handle successful uploads on complete
                  getDownloadURL(uploadTask1.snapshot.ref).then(
                    (downloadURL1) => {
                      const newdata = {
                        gambar: [downloadURL1, data.image2],
                        nama: data.namaProduk,
                        deskripsi: data.deskripsiProduk,
                        harga: Number(data.harga),
                        kategori: data.kategori,
                        ready: data.ready,
                      };
                      //Simpan data kategori ke Firebase database
                      update(ref_database(db, "/produk/" + data.id), newdata)
                        .then((response) => {
                          //SUKSES
                          dispatchSuccess(
                            dispatch,
                            UPDATE_PRODUK,
                            response ? response : []
                          );
                        })

                        .catch((error) => {
                          //ERROR
                          dispatchError(dispatch, UPDATE_PRODUK, error.message);
                          Swal.fire({
                            title: "Error",
                            text: error.message,
                            icon: "error",
                            confirmButtonColor: "#f69d93",
                            confirmButtonText: "OK",
                          });
                        });
                    }
                  );
                }
              );
            })
            .catch((error) => {
              dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
        dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const gambar1TidakDigantiDanGambar2Diganti = (data) => {
  console.log("gambar1TidakDigantiDanGambar2Diganti");
  return (dispatch) => {
    //Jika gambar 2 sebelumnya ada di database
    if (data.imageLama2) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName2) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB2.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath2 = data.imageLama2.replace(baseUrl, "");
            const indexOfEndPath = imagePath2.indexOf("?");
            imagePath2 = imagePath2.substring(0, indexOfEndPath);
            imagePath2 = imagePath2.replace("%2F", "/");
            const storage = getStorage();
            const imageRef2 = ref_storage(storage, imagePath2);

            // Delete the file
            deleteObject(imageRef2)
              .then(() => {
                //  Upload gambar 2 yang baru
                const storage = getStorage();
                let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
                const storageRef2 = ref_storage(
                  storage,
                  "Produk/" + imageName2
                );
                const uploadTask2 = uploadBytesResumable(
                  storageRef2,
                  data.imageToDB2
                );

                uploadTask2.on(
                  "state_changed",
                  (snapshot) => {
                    //Berhasil upload gambar ke Firebase Storage
                  },
                  (error) => {
                    dispatchError(dispatch, UPDATE_PRODUK, error.message);
                    Swal.fire({
                      title: "Error",
                      text: error.message,
                      icon: "error",
                      confirmButtonColor: "#f69d93",
                      confirmButtonText: "OK",
                    });
                  },
                  () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask2.snapshot.ref).then(
                      (downloadURL2) => {
                        const newdata = {
                          gambar: [data.image1, downloadURL2],
                          nama: data.namaProduk,
                          deskripsi: data.deskripsiProduk,
                          harga: Number(data.harga),
                          kategori: data.kategori,
                          ready: data.ready,
                        };
                        //Simpan data kategori ke Firebase database
                        update(ref_database(db, "/produk/" + data.id), newdata)
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              UPDATE_PRODUK,
                              response ? response : []
                            );
                          })

                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              UPDATE_PRODUK,
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
                    );
                  }
                );
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika tidak ada gambar 2 sebelumnya di database
    } else {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName2) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB2.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Upload gambar yang baru
            const storage = getStorage();
            let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
            const storageRef2 = ref_storage(storage, "Produk/" + imageName2);
            const uploadTask2 = uploadBytesResumable(
              storageRef2,
              data.imageToDB2
            );

            uploadTask2.on(
              "state_changed",
              (snapshot) => {
                //Berhasil upload gambar ke Firebase Storage
              },
              (error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#f69d93",
                  confirmButtonText: "OK",
                });
              },
              () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask2.snapshot.ref).then(
                  (downloadURL2) => {
                    const newdata = {
                      gambar: [data.image1, downloadURL2],
                      nama: data.namaProduk,
                      deskripsi: data.deskripsiProduk,
                      harga: Number(data.harga),
                      kategori: data.kategori,
                      ready: data.ready,
                    };
                    //Simpan data kategori ke Firebase database
                    update(ref_database(db, "/produk/" + data.id), newdata)
                      .then((response) => {
                        //SUKSES
                        dispatchSuccess(
                          dispatch,
                          UPDATE_PRODUK,
                          response ? response : []
                        );
                      })

                      .catch((error) => {
                        //ERROR
                        dispatchError(dispatch, UPDATE_PRODUK, error.message);
                        Swal.fire({
                          title: "Error",
                          text: error.message,
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      });
                  }
                );
              }
            );
          }
        })
        .catch((error) => {
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const gambar1TidakDigantiDanGambar2TidakDiganti = (data) => {
  console.log("gambar1TidakDigantiDanGambar2TidakDiganti");
  return (dispatch) => {
    const newdata = {
      gambar: [data.image1, data.image2],
      nama: data.namaProduk,
      deskripsi: data.deskripsiProduk,
      harga: Number(data.harga),
      kategori: data.kategori,
      ready: data.ready,
    };
    //Simpan data produk ke Firebase database
    update(ref_database(db, "/produk/" + data.id), newdata)
      .then((response) => {
        //SUKSES
        dispatchSuccess(dispatch, UPDATE_PRODUK, response ? response : []);
      })
      .catch((error) => {
        //ERROR
        dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const gambar1DigantiDanGambar2TidakAda = (data) => {
  console.log("gambar1DigantiDanGambar2TidakAda");
  return (dispatch) => {
    //Jika gambar 2 sebelumnya ada di storage
    if (data.imageLama2) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName1 = data.imageToDB1.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName1) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath1 = data.imageLama1.replace(baseUrl, "");
            const indexOfEndPath1 = imagePath1.indexOf("?");
            imagePath1 = imagePath1.substring(0, indexOfEndPath1);
            imagePath1 = imagePath1.replace("%2F", "/");
            const storage = getStorage();
            const imageRef1 = ref_storage(storage, imagePath1);
            let imagePath2 = data.imageLama2.replace(baseUrl, "");
            const indexOfEndPath2 = imagePath2.indexOf("?");
            imagePath2 = imagePath2.substring(0, indexOfEndPath2);
            imagePath2 = imagePath2.replace("%2F", "/");
            const imageRef2 = ref_storage(storage, imagePath2);

            // Delete the file
            deleteObject(imageRef1)
              .then(() => {
                // Delete the file
                deleteObject(imageRef2)
                  .then(() => {
                    //  Upload gambar 1 yang baru
                    const storage = getStorage();
                    let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
                    const storageRef1 = ref_storage(
                      storage,
                      "Produk/" + imageName1
                    );
                    const uploadTask1 = uploadBytesResumable(
                      storageRef1,
                      data.imageToDB1
                    );

                    uploadTask1.on(
                      "state_changed",
                      (snapshot) => {
                        //Berhasil upload gambar ke Firebase Storage
                      },
                      (error) => {
                        dispatchError(dispatch, UPDATE_PRODUK, error.message);
                        Swal.fire({
                          title: "Error",
                          text: error.message,
                          icon: "error",
                          confirmButtonColor: "#f69d93",
                          confirmButtonText: "OK",
                        });
                      },
                      () => {
                        // Handle successful uploads on complete
                        getDownloadURL(uploadTask1.snapshot.ref).then(
                          (downloadURL1) => {
                            const newdata = {
                              gambar: [downloadURL1],
                              nama: data.namaProduk,
                              deskripsi: data.deskripsiProduk,
                              harga: Number(data.harga),
                              kategori: data.kategori,
                              ready: data.ready,
                            };
                            //Simpan data kategori ke Firebase database
                            update(
                              ref_database(db, "/produk/" + data.id),
                              newdata
                            )
                              .then((response) => {
                                //SUKSES
                                dispatchSuccess(
                                  dispatch,
                                  UPDATE_PRODUK,
                                  response ? response : []
                                );
                              })

                              .catch((error) => {
                                //ERROR
                                dispatchError(
                                  dispatch,
                                  UPDATE_PRODUK,
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
                        );
                      }
                    );
                  })
                  .catch((error) => {
                    dispatchError(dispatch, UPDATE_PRODUK, error.message);
                    Swal.fire({
                      title: "Error",
                      text: error.message,
                      icon: "error",
                      confirmButtonColor: "#f69d93",
                      confirmButtonText: "OK",
                    });
                  });
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika gambar 2 tidak ada sebelumnya di storage
    } else {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName1 = data.imageToDB1.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName1) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB1.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath1 = data.imageLama1.replace(baseUrl, "");
            const indexOfEndPath = imagePath1.indexOf("?");
            imagePath1 = imagePath1.substring(0, indexOfEndPath);
            imagePath1 = imagePath1.replace("%2F", "/");
            const storage = getStorage();
            const imageRef1 = ref_storage(storage, imagePath1);

            // Delete the file
            deleteObject(imageRef1)
              .then(() => {
                //  Upload gambar yang baru
                const storage = getStorage();
                let imageName1 = data.imageToDB1.name.replace(/ /g, "_");
                const storageRef1 = ref_storage(
                  storage,
                  "Produk/" + imageName1
                );
                const uploadTask1 = uploadBytesResumable(
                  storageRef1,
                  data.imageToDB1
                );

                uploadTask1.on(
                  "state_changed",
                  (snapshot) => {
                    //Berhasil upload gambar ke Firebase Storage
                  },
                  (error) => {
                    dispatchError(dispatch, UPDATE_PRODUK, error.message);
                    Swal.fire({
                      title: "Error",
                      text: error.message,
                      icon: "error",
                      confirmButtonColor: "#f69d93",
                      confirmButtonText: "OK",
                    });
                  },
                  () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask1.snapshot.ref).then(
                      (downloadURL1) => {
                        const newdata = {
                          gambar: [downloadURL1],
                          nama: data.namaProduk,
                          deskripsi: data.deskripsiProduk,
                          harga: Number(data.harga),
                          kategori: data.kategori,
                          ready: data.ready,
                        };
                        //Simpan data kategori ke Firebase database
                        update(ref_database(db, "/produk/" + data.id), newdata)
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              UPDATE_PRODUK,
                              response ? response : []
                            );
                          })

                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              UPDATE_PRODUK,
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
                    );
                  }
                );
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_PRODUK, error.message);
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
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const gambar1TidakDigantiDanGambar2TidakAda = (data) => {
  console.log("gambar1TidakDigantiDanGambar2TidakAda");
  return (dispatch) => {
    //Jika gambar 2 ada sebelumnya di storage
    if (data.imageLama2) {
      //  Ambil dan hapus gambar yang lama dari firebase storage
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
      let imagePath2 = data.imageLama2.replace(baseUrl, "");
      const indexOfEndPath = imagePath2.indexOf("?");
      imagePath2 = imagePath2.substring(0, indexOfEndPath);
      imagePath2 = imagePath2.replace("%2F", "/");
      const storage = getStorage();
      const imageRef2 = ref_storage(storage, imagePath2);
      // Delete the file
      deleteObject(imageRef2)
        .then(() => {
          const newdata = {
            gambar: [data.image1],
            nama: data.namaProduk,
            deskripsi: data.deskripsiProduk,
            harga: Number(data.harga),
            kategori: data.kategori,
            ready: data.ready,
          };
          //Simpan data kategori ke Firebase database
          update(ref_database(db, "/produk/" + data.id), newdata)
            .then((response) => {
              //SUKSES
              dispatchSuccess(
                dispatch,
                UPDATE_PRODUK,
                response ? response : []
              );
            })

            .catch((error) => {
              //ERROR
              dispatchError(dispatch, UPDATE_PRODUK, error.message);
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        })
        .catch((error) => {
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika gambar 2 tidak ada di storage
    } else {
      const newdata = {
        gambar: [data.image1],
        nama: data.namaProduk,
        deskripsi: data.deskripsiProduk,
        harga: Number(data.harga),
        kategori: data.kategori,
        ready: data.ready,
      };
      //Simpan data produk ke Firebase database
      update(ref_database(db, "/produk/" + data.id), newdata)
        .then((response) => {
          //SUKSES
          dispatchSuccess(dispatch, UPDATE_PRODUK, response ? response : []);
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, UPDATE_PRODUK, error.message);
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

export const deleteProduk = (image, id) => {
  return (dispatch) => {
    dispatchLoading(dispatch, DELETE_PRODUK);
    //Jika gambar 2 ada
    if (image[1]) {
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
      let imagePath1 = image[0].replace(baseUrl, "");
      const indexOfEndPath1 = imagePath1.indexOf("?");
      imagePath1 = imagePath1.substring(0, indexOfEndPath1);
      imagePath1 = imagePath1.replace("%2F", "/");
      const storage = getStorage();
      const imageRef1 = ref_storage(storage, image[0]);

      // Delete the file 1
      deleteObject(imageRef1)
        .then((response) => {
          let imagePath2 = image[1].replace(baseUrl, "");
          const indexOfEndPath2 = imagePath2.indexOf("?");
          imagePath2 = imagePath2.substring(0, indexOfEndPath2);
          imagePath2 = imagePath2.replace("%2F", "/");
          const storage = getStorage();
          const imageRef2 = ref_storage(storage, image[1]);
          // Delete the file 2
          deleteObject(imageRef2)
            .then((response) => {
              remove(ref_database(db, "/produk/" + id))
                .then((response) => {
                  //SUKSES
                  dispatchSuccess(
                    dispatch,
                    DELETE_PRODUK,
                    "Produk Berhasil Dihapus"
                  );
                })
                .catch((error) => {
                  //ERROR
                  dispatchError(dispatch, DELETE_PRODUK, error.message);
                  Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonColor: "#f69d93",
                    confirmButtonText: "OK",
                  });
                });
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, DELETE_PRODUK, error.message);
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, DELETE_PRODUK, error.message);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        });

      //Jika tidak ada gambar 2 ==> hapus gambar 1 saja
    } else {
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
      let imagePath = image[0].replace(baseUrl, "");
      const indexOfEndPath = imagePath.indexOf("?");
      imagePath = imagePath.substring(0, indexOfEndPath);
      imagePath = imagePath.replace("%2F", "/");
      const storage = getStorage();
      const imageRef = ref_storage(storage, image[0]);

      // Delete the file
      deleteObject(imageRef)
        .then((response) => {
          remove(ref_database(db, "/produk/" + id))
            .then((response) => {
              //SUKSES
              dispatchSuccess(
                dispatch,
                DELETE_PRODUK,
                "Produk Berhasil Dihapus"
              );
            })
            .catch((error) => {
              //ERROR
              dispatchError(dispatch, DELETE_PRODUK, error.message);
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            });
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, DELETE_PRODUK, error.message);
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
