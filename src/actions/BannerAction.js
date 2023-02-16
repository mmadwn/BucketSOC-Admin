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

export const GET_LIST_BANNER = "GET_LIST_BANNER";
export const TAMBAH_BANNER = "TAMBAH_BANNER";
export const GET_DETAIL_BANNER = "GET_DETAIL_BANNER";
export const UPDATE_BANNER = "UPDATE_BANNER";
export const DELETE_BANNER = "DELETE_BANNER";

//Function untuk baca data banner dari Firebase Database
export const getListBanner = () => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_LIST_BANNER);

    return onValue(
      ref_database(db, "/banner/"),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_LIST_BANNER, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_LIST_BANNER, error.message);
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

export const getDetailBanner = (id) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, GET_DETAIL_BANNER);

    return onValue(
      ref_database(db, "/banner/" + id),
      (snapshot) => {
        const data = snapshot.val();
        //SUKSES
        dispatchSuccess(dispatch, GET_DETAIL_BANNER, data);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        dispatchError(dispatch, GET_DETAIL_BANNER, error.message);
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
export const tambahBanner = (data) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, TAMBAH_BANNER);
    
    //Upload data ke Firebase Storage
    const storage = getStorage();
    const listRef = ref_storage(storage, "Banner/");
    let imageName = data.imageToDB.name.replace(/ /g, "_");
    //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
    listAll(listRef)
      .then((res) => {
        let gambarList = [];
        res.items.forEach((itemRef) => {
          gambarList.push(itemRef._location.path_.replace("Banner/", ""));
        });
        if (gambarList.includes(imageName) === true) {
          //ERROR
          dispatchError(dispatch, TAMBAH_BANNER, "File sudah ada");
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
          //Upload data ke Firebase Storage
          const storageRef = ref_storage(storage, "Banner/" + imageName);
          const uploadTask = uploadBytesResumable(storageRef, data.imageToDB);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              //Berhasil upload gambar ke Firebase Storage
            },
            (error) => {
              //ERROR
              dispatchError(dispatch, TAMBAH_BANNER, error.message);
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
                  title: data.judulBanner,
                  active: data.active,
                  deskripsi: data.deskripsiBanner,
                };
                //Simpan data kategori ke Firebase database
                set(push(ref_database(db, "/banner/")), newdata)
                  .then((response) => {
                    //SUKSES
                    dispatchSuccess(
                      dispatch,
                      TAMBAH_BANNER,
                      response ? response : []
                    );
                  })

                  .catch((error) => {
                    //ERROR
                    dispatchError(dispatch, TAMBAH_BANNER, error.message);
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
        dispatchError(dispatch, TAMBAH_BANNER, error.message);
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

export const updateBanner = (data) => {
  return (dispatch) => {
    dispatchLoading(dispatch, UPDATE_BANNER);

    //  Cek apakah gambar diganti
    if (data.imageToDB) {
      const storage = getStorage();
      const listRef = ref_storage(storage, "Banner/");
      let imageName = data.imageToDB.name.replace(/ /g, "_");

      //Cek apakah nama file sudah digunakan sebelumnya di Firebase Storage
      listAll(listRef)
        .then((res) => {
          let gambarList = [];
          res.items.forEach((itemRef) => {
            gambarList.push(itemRef._location.path_.replace("Banner/", ""));
          });
          if (gambarList.includes(imageName) === true) {
            //ERROR jika file sudah ada
            dispatchError(dispatch, UPDATE_BANNER, "File sudah ada");
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
            const imageRef = ref_storage(storage, imagePath);

            // Delete the file
            deleteObject(imageRef)
              .then(() => {
                //  Upload gambar yang baru
                const storageRef = ref_storage(storage, "Banner/" + imageName);
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
                    //ERROR
                    dispatchError(dispatch, UPDATE_BANNER, error.message);
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
                          title: data.judulBanner,
                          deskripsi: data.deskripsiBanner,
                          active: data.active,
                        };
                        //Simpan data banner ke Firebase database
                        update(ref_database(db, "/banner/" + data.id), newdata)
                          .then((response) => {
                            //SUKSES
                            dispatchSuccess(
                              dispatch,
                              UPDATE_BANNER,
                              response ? response : []
                            );
                          })
                          .catch((error) => {
                            //ERROR
                            dispatchError(
                              dispatch,
                              UPDATE_BANNER,
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
                      });
                  }
                );
              })
              .catch((error) => {
                dispatchError(dispatch, UPDATE_BANNER, error.message);
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
          dispatchError(dispatch, UPDATE_BANNER, error.message);
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
        title: data.judulBanner,
        deskripsi: data.deskripsiBanner,
        active: data.active,
      };
      //Simpan data kategori ke Firebase database
      update(ref_database(db, "/banner/" + data.id), newdata)
        .then((response) => {
          //SUKSES
          dispatchSuccess(dispatch, UPDATE_BANNER, response ? response : []);
        })
        .catch((error) => {
          //ERROR
          dispatchError(dispatch, UPDATE_BANNER, error.message);
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

export const deleteBanner = (image, id) => {
  return (dispatch) => {
    dispatchLoading(dispatch, DELETE_BANNER);

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
        remove(ref_database(db, "/banner/" + id))
          .then((response) => {
            //SUKSES
            dispatchSuccess(
              dispatch,
              DELETE_BANNER,
              "Banner Berhasil Dihapus!"
            );
          })
          .catch((error) => {
            //ERROR
            dispatchError(dispatch, DELETE_BANNER, error.message);
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
        dispatchError(dispatch, DELETE_BANNER, error.message);
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
