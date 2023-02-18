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

export const GET_LIST_KATEGORI = "GET_LIST_KATEGORI";
export const TAMBAH_KATEGORI = "TAMBAH_KATEGORI";
export const GET_DETAIL_KATEGORI = "GET_DETAIL_KATEGORI";
export const UPDATE_KATEGORI = "UPDATE_KATEGORI";
export const DELETE_KATEGORI = "DELETE_KATEGORI";

//Function untuk baca data Kategori dari Firebase Database
export const getListKategori = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_KATEGORI);

    return onValue(
      ref_database(db, "/kategori/"),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_LIST_KATEGORI, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_LIST_KATEGORI, error.message);
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

export const getDetailKategori = (id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_DETAIL_KATEGORI);

    return onValue(
      ref_database(db, "/kategori/" + id),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_DETAIL_KATEGORI, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_DETAIL_KATEGORI, error.message);
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
export const tambahKategori = (data) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, TAMBAH_KATEGORI);

    //Upload data ke Firebase Storage
    const storage = getStorage();
    const listRef = ref_storage(storage, "Kategori/");
    let imageName = data.imageToDB.name.replace(/ /g, "_");
    //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
    listAll(listRef)
      .then((res) => {
        let gambarList = [];
        res.items.forEach((itemRef) => {
          gambarList.push(itemRef._location.path_.replace("Kategori/", ""));
        });
        if (gambarList.includes(imageName) === true) {
          //ERROR
          dispatchError(dispatch, TAMBAH_KATEGORI, "File sudah ada");
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
          //Upload data ke firebase storage
          const storageRef = ref_storage(storage, "Kategori/" + imageName);
          const uploadTask = uploadBytesResumable(storageRef, data.imageToDB);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              //Berhasil upload gambar ke Firebase Storage
            },
            (error) => {
              dispatchError(dispatch, TAMBAH_KATEGORI, error.message);
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
                  gambar: downloadURL,
                  nama: data.namaKategori,
                };
                //Simpan data kategori ke Firebase database
                set(push(ref_database(db, "/kategori/")), newdata)
                  .then((response) => {
                    //SUKSES
                    dispatchSuccess(
                      dispatch,
                      TAMBAH_KATEGORI,
                      response ? response : []
                    );
                  })

                  .catch((error) => {
                    //ERROR
                    dispatchError(dispatch, TAMBAH_KATEGORI, error.message);
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
        dispatchError(dispatch, TAMBAH_KATEGORI, error.message);
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

export const updateKategori = (data) => {
  return (dispatch) => {
    dispatchLoading(dispatch, UPDATE_KATEGORI);

    //  Cek apakah gambar diganti
    if (data.imageToDB) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Kategori/");
      let imageName = data.imageToDB.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Kategori/", ""));
          });
          if (gambarList.includes(imageName) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_KATEGORI, "File sudah ada");
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
                const storageRef = ref_storage(
                  storage,
                  "Kategori/" + imageName
                );
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
                    dispatchError(dispatch, UPDATE_KATEGORI, error.message);
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
                          nama: data.namaKategori,
                        };
                        //Simpan data kategori ke Firebase database
                        update(
                          ref_database(db, "/kategori/" + data.id),
                          newdata
                        )
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              UPDATE_KATEGORI,
                              response ? response : []
                            );
                          })

                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              UPDATE_KATEGORI,
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
                dispatchError(dispatch, UPDATE_KATEGORI, error.message);
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
          dispatchError(dispatch, UPDATE_KATEGORI, error.message);
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
        nama: data.namaKategori,
      };
      //Simpan data kategori ke Firebase database
      update(ref_database(db, "/kategori/" + data.id), newdata)
        .then((response) => {
          //SUKSES
          dispatchSuccess(dispatch, UPDATE_KATEGORI, response ? response : []);
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, UPDATE_KATEGORI, error.message);
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

export const deleteKategori = (image, id) => {
  return (dispatch) => {
    dispatchLoading(dispatch, DELETE_KATEGORI);

    const baseUrl =
      "https://firebasestorage.googleapis.com/v0/b/bucketsoc.appspot.com/o/";
    let imagePath = image.replace(baseUrl, "");
    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath.substring(0, indexOfEndPath);
    imagePath = imagePath.replace("%2F", "/");
    const storage = getStorage();
    const imageRef = ref_storage(storage, image);

    // Delete the file
    deleteObject(imageRef)
      .then((response) => {
        remove(ref_database(db, "/kategori/" + id))
          .then((response) => {
            //SUKSES
            dispatchSuccess(
              dispatch,
              DELETE_KATEGORI,
              "Kategori Berhasil Dihapus"
            );
          })
          .catch((error) => {
            //ERROR
            dispatchError(dispatch, DELETE_KATEGORI, error.message);
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
        dispatchError(dispatch, DELETE_KATEGORI, error.message);
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
