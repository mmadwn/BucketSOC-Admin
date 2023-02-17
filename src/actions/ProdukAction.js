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

    //Jika gambar 2 diupolod
    if (data.imageToDB2) {
      let imageName2 = data.imageToDB2.name.replace(/ /g, "_");
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (
            gambarList.includes(imageName1) === true &&
            gambarList.includes(imageName2) === true
          ) {
            //ERROR
            dispatchError(dispatch, TAMBAH_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text: "Nama file gambar 1 atau gambar 2 sudah digunakan. Silakan ubah nama file terlebih dahulu.",
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
                              harga: data.harga,
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
                    harga: data.harga,
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

    //  Cek apakah gambar diganti
    if (data.imageToDB) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Produk/");
      let imageName = data.imageToDB.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Produk/", ""));
          });
          if (gambarList.includes(imageName) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_PRODUK, "File sudah ada");
            Swal.fire({
              title: "Error",
              text:
                "File " +
                data.imageToDB.name +
                " sudah ada. Silakan ubah nama file terlebih dahulu.",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          } else {
            //  Ambil dan hapus gambar yang lama dari firebase storage
            const baseUrl =
              "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
            let imagePath = data.imageLama.replace(baseUrl, "");
            const indexOfEndPath = imagePath.indexOf("?");
            imagePath = imagePath.substring(0, indexOfEndPath);
            imagePath = imagePath.replace("%2F", "/");
            const storage = getStorage();
            const imageRef = ref_storage(storage, imagePath);

            // Delete the file
            deleteObject(imageRef)
              .then(() => {
                //  Upload gambar yang baru
                const storage = getStorage();
                let imageName = data.imageToDB.name.replace(/ /g, "_");
                const storageRef = ref_storage(storage, "Produk/" + imageName);
                const uploadTask = uploadBytesResumable(
                  storageRef,
                  data.imageToDB
                );

                uploadTask.on(
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
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        const newdata = {
                          gambar: downloadURL,
                          nama: data.namaProduk,
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
    } else {
      const newdata = {
        gambar: data.image,
        nama: data.namaProduk,
      };
      //Simpan data kategori ke Firebase database
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
