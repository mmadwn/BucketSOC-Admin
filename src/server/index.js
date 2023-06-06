const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { Buffer } = require("buffer");
const { initializeApp } = require("firebase/app");
const { getDatabase, update, ref, onValue } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

const firebaseConfig = {
  apiKey: "AIzaSyBUk4nWm3Yf1fW0J4gDrafARpaTrx3Q7RM",
  authDomain: "bucketsoc.firebaseapp.com",
  databaseURL: "https://bucketsoc-default-rtdb.firebaseio.com",
  projectId: "bucketsoc",
  storageBucket: "bucketsoc.appspot.com",
  messagingSenderId: "1088484004863",
  appId: "1:1088484004863:web:8ff14afbfb62c68f0a0dca",
  measurementId: "G-EG47QM9Q0S",
};

const firebase = initializeApp(firebaseConfig);

const db = getDatabase(firebase);

const API_TIMEOUT = 120000;

//BITESHIP LIVE
//const BITESHIP_API_KEY = "biteship_live.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXBsaWthc2kgQW5kcm9pZCIsInVzZXJJZCI6IjYzODc5NjViNTcyNGJjMjUwODRiYTAxZSIsImlhdCI6MTY2OTgzMDM1OH0.30YPDkBaJUPHC4DIKT0Y4Q063-sIjTD0DhPOOB5GCC4";

//BITESHIP TESTING
const BITESHIP_API_KEY =
  "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZyIsInVzZXJJZCI6IjYzODc5NjViNTcyNGJjMjUwODRiYTAxZSIsImlhdCI6MTY2OTgzMDQxM30.l_aayhOYhf3AM7m6_BIUT0ETNzQMsSJmCEvbJj-Whdo";

const BITESHIP_API_URL = "https://api.biteship.com/v1/";
const BITESHIP_API_HEADER = {
  Authorization: BITESHIP_API_KEY,
  "Content-Type": "application/json",
};

//MIDTRANS SANDBOX
const MIDTRANS_API_KEY =
  "Basic U0ItTWlkLXNlcnZlci1XV19XODdST2tGbnRKeUZlcllqN2VqY1Q=";
const MIDTRANS_API_SNAP_URL = "https://app.sandbox.midtrans.com/snap/v1/";
const MIDTRANS_API_STATUS_URL = "https://api.sandbox.midtrans.com/v2/";

//MIDTRANS PRODUCTION
//const MIDTRANS_API_KEY = "Basic TWlkLXNlcnZlci1WWEVpVXZpbVlsSG81VUlkbnhHdGZUMkM=";
//const MIDTRANS_API_KEY = "Basic TWlkLXNlcnZlci1TYXo3dVhYcGdFM1VzNGNQU2JWUFlKWWY=;
//const MIDTRANS_API_SNAP_URL = "https://app.midtrans.com/snap/v1/";
//const MIDTRANS_API_STATUS_URL = "https://api.midtrans.com/v2/";

const MIDTRANS_API_HEADER = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: MIDTRANS_API_KEY,
};

const INVOICE_API_URL = "https://invoice-generator.com";
const INVOICE_API_HEADER = {
  "Content-Type": "application/json",
};

app.post("/midtrans-snap", (req, res) => {
  axios({
    method: "POST",
    url: MIDTRANS_API_SNAP_URL + "transactions",
    timeout: API_TIMEOUT,
    headers: MIDTRANS_API_HEADER,
    data: req.body.data,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/midtrans-status", (req, res) => {
  axios({
    method: "GET",
    url: MIDTRANS_API_STATUS_URL + req.body.order_id + "/status",
    timeout: API_TIMEOUT,
    headers: MIDTRANS_API_HEADER,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/midtrans-cancel", (req, res) => {
  axios({
    method: "POST",
    url: MIDTRANS_API_STATUS_URL + req.body.order_id + "/cancel",
    timeout: API_TIMEOUT,
    headers: MIDTRANS_API_HEADER,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/midtrans-refund", (req, res) => {
  axios({
    method: "POST",
    url: MIDTRANS_API_STATUS_URL + req.body.order_id + "/refund/online/direct",
    timeout: API_TIMEOUT,
    headers: MIDTRANS_API_HEADER,
    data: {
      reason: req.body.reason,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/midtrans-webhook", (req, res) => {
  //Jika status pembayarannya salah satu dari berikut
  if (
    req.body.transaction_status === "settlement" ||
    req.body.transaction_status === "capture" ||
    req.body.transaction_status === "deny" ||
    req.body.transaction_status === "cancel" ||
    req.body.transaction_status === "expire" ||
    req.body.transaction_status === "failure"
  ) {
    //Baca data di database untuk order_id terkait
    return onValue(
      ref(db, "/pesanan/" + req.body.order_id),
      (snapshot) => {
        const dataFirebase = snapshot.val();
        if (dataFirebase && dataFirebase.status_pesanan === "Menunggu Pembayaran") {
          //Jika order_id ditemukan di database dan statusnya "Menunggu Pembayaran"
          //LOGIN agar bisa update data
          signInWithEmailAndPassword(
            getAuth(),
            "soc.bucket@gmail.com",
            "Buketbunga123"
          )
            .then((response) => {
              // Signed in
              // Perbarui status pesanan di Firebase Realtime Database
              if (
                req.body.transaction_status === "settlement" ||
                req.body.transaction_status === "capture"
              ) {
                update(ref(db, "/pesanan/" + req.body.order_id), {
                  status_pesanan: "Menunggu Konfirmasi Admin",
                })
                  .then((response) => {
                    res.sendStatus(200); // Memberikan respons 200 OK ke Midtrans
                  })
                  .catch((error) => {
                    //ERROR update data Firebase
                    res.status(500).send(error.message);
                  });
              } else {
                //Jika statusnya selain "settlement" / "capture" (Gagal)
                update(ref(db, "/pesanan/" + req.body.order_id), {
                  status_pesanan: "Selesai (Pembayaran Gagal)",
                })
                  .then((response) => {
                    res.sendStatus(200); // Memberikan respons 200 OK ke Midtrans
                  })
                  .catch((error) => {
                    //ERROR update data Firebase
                    res.status(500).send(error.message);
                  });
              }
            })
            .catch((error) => {
              //ERROR LOGIN
              res.status(500).send(error.message);
            });
        } else {
          //Jika order_id tidak ditemukan di database / statusnya bukan "Menunggu Pembayaran"
          res.sendStatus(200);
        }
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR baca data di Firebase
        res.status(500).send(error.message);
      }
    );
  } else {
    //Jika status pembayarannya selain yang diatas
    res.sendStatus(200); // Memberikan respons 200 OK ke Midtrans
  }
});

app.post("/invoice", (req, res) => {
  axios({
    method: "POST",
    url: INVOICE_API_URL,
    timeout: API_TIMEOUT,
    data: req.body.data,
    responseType: "arraybuffer",
    headers: INVOICE_API_HEADER,
  })
    .then((response) => {
      const pdfBuffer = Buffer.from(response.data, "binary"); // membuat buffer dari arraybuffer
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.send(pdfBuffer);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/biteship-rates", (req, res) => {
  axios({
    method: "POST",
    url: BITESHIP_API_URL + "rates/couriers",
    timeout: API_TIMEOUT,
    headers: BITESHIP_API_HEADER,
    data: req.body.data,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
});

app.post("/biteship-order", (req, res) => {
  axios({
    method: "POST",
    url: BITESHIP_API_URL + "orders",
    timeout: API_TIMEOUT,
    headers: BITESHIP_API_HEADER,
    data: req.body.data,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
});

app.post("/biteship-status", (req, res) => {
  axios({
    method: "GET",
    url: BITESHIP_API_URL + "orders/" + req.body.biteship_id,
    timeout: API_TIMEOUT,
    headers: BITESHIP_API_HEADER,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
});

app.post("/biteship-update", (req, res) => {
  axios({
    method: "POST",
    url: BITESHIP_API_URL + "orders/" + req.body.biteship_id,
    timeout: API_TIMEOUT,
    headers: BITESHIP_API_HEADER,
    data: req.body.data,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
});

app.post("/biteship-pickup", (req, res) => {
  axios({
    method: "POST",
    url: BITESHIP_API_URL + "orders/" + req.body.biteship_id,
    timeout: API_TIMEOUT,
    headers: BITESHIP_API_HEADER,
    data: {
      delivery_date: req.body.tanggal_biteship,
      delivery_time: req.body.waktu_biteship,
    },
  })
    .then((response) => {
      axios({
        method: "POST",
        url: BITESHIP_API_URL + "orders/" + req.body.biteship_id + "/confirm",
        timeout: API_TIMEOUT,
        headers: BITESHIP_API_HEADER,
      })
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          res.status(500).send(error.response.data);
        });
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
});

app.post("/biteship-webhook", (req, res) => {
  //Jika status pengirimannya salah satu dari berikut
  if (
    req.body.status === "rejected" ||
    req.body.status === "cancelled" ||
    req.body.status === "courier_not_found" ||
    req.body.status === "returned" ||
    req.body.status === "disposed" ||
    req.body.status === "delivered"
  ) {
    //Jalankan Axios baca status pengiriman untuk mendapat order_id di database
    axios({
      method: "GET",
      url: BITESHIP_API_URL + "orders/" + req.body.order_id, //Baca data berdasarkan biteship id
      timeout: API_TIMEOUT,
      headers: BITESHIP_API_HEADER,
    })
      .then((response) => {
        const dataBiteship = response.data;
        //Baca data di database untuk order_id terkait
        return onValue(
          ref(db, "/pesanan/" + dataBiteship.note), //"note" berisi order_id di database
          (snapshot) => {
            const dataFirebase = snapshot.val();
            if (
              dataFirebase &&
              dataFirebase.status_pesanan === "Sedang Dikirim"
            ) {
              //Jika order_id ditemukan di database dan statusnya "Sedang Dikirim"
              //LOGIN agar bisa update data
              signInWithEmailAndPassword(
                getAuth(),
                "soc.bucket@gmail.com",
                req.headers.authorization
              )
                .then((response) => {
                  // Signed in
                  // Perbarui status pesanan di Firebase Realtime Database
                  if (req.body.status === "delivered") {
                    update(ref(db, "/pesanan/" + dataBiteship.note), {
                      status_pesanan: "Terkirim",
                    })
                      .then((response) => {
                        res.sendStatus(200); // Memberikan respons 200 OK ke Biteship
                      })
                      .catch((error) => {
                        //ERROR update data Firebase
                        res.status(500).send(error.message);
                      });
                  } else {
                    //Jika statusnya selain "delivered" (Gagal)
                    update(ref(db, "/pesanan/" + dataBiteship.note), {
                      status_pesanan: "Pengiriman Gagal",
                    })
                      .then((response) => {
                        res.sendStatus(200); // Memberikan respons 200 OK ke Biteship
                      })
                      .catch((error) => {
                        //ERROR update data Firebase
                        res.status(500).send(error.message);
                      });
                  }
                })
                .catch((error) => {
                  //ERROR LOGIN
                  res.status(500).send(error.message);
                });
            } else {
              //Jika order_id tidak ditemukan di database / statusnya bukan "Sedang Dikirim"
              res.sendStatus(200);
            }
          },
          {
            onlyOnce: true,
          },
          (error) => {
            //ERROR baca data di Firebase
            res.status(500).send(error.message);
          }
        );
      })
      .catch((error) => {
        //ERROR Axios
        res.status(500).send(error.response.data);
      });
  } else {
    //Jika status pengirimannya selain yang diatas
    res.sendStatus(200); // Memberikan respons 200 OK ke Biteship
  }
});

exports.app = functions.https.onRequest(app);
