const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { Buffer } = require("buffer");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

const API_TIMEOUT = 120000;

//BITESHIP LIVE
//const BITESHIP_API_KEY = "biteship_live.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXBsaWthc2kgQW5kcm9pZCIsInVzZXJJZCI6IjYzODc5NjViNTcyNGJjMjUwODRiYTAxZSIsImlhdCI6MTY2OTgzMDM1OH0.30YPDkBaJUPHC4DIKT0Y4Q063-sIjTD0DhPOOB5GCC4";

//BITESHIP TESTING
const BITESHIP_API_KEY = "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZyIsInVzZXJJZCI6IjYzODc5NjViNTcyNGJjMjUwODRiYTAxZSIsImlhdCI6MTY2OTgzMDQxM30.l_aayhOYhf3AM7m6_BIUT0ETNzQMsSJmCEvbJj-Whdo";

const BITESHIP_API_URL = "https://api.biteship.com/v1/";
const BITESHIP_API_HEADER = {
  "Authorization": BITESHIP_API_KEY,
  "Content-Type": "application/json",
};

//MIDTRANS SANDBOX
const MIDTRANS_API_KEY = "Basic U0ItTWlkLXNlcnZlci1XV19XODdST2tGbnRKeUZlcllqN2VqY1Q=";
const MIDTRANS_API_SNAP_URL = "https://app.sandbox.midtrans.com/snap/v1/";
const MIDTRANS_API_STATUS_URL = "https://api.sandbox.midtrans.com/v2/";

//MIDTRANS PRODUCTION
// const MIDTRANS_API_KEY = 'Basic TWlkLXNlcnZlci1TYXo3dVhYcGdFM1VzNGNQU2JWUFlKWWY=';
// const MIDTRANS_API_SNAP_URL = "https://app.midtrans.com/snap/v1/"
// const MIDTRANS_API_STATUS_URL = "https://api.midtrans.com/v2/"

const MIDTRANS_API_HEADER = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": MIDTRANS_API_KEY,
};

const INVOICE_API_URL = "https://invoice-generator.com";
const INVOICE_API_HEADER = {
  "Content-Type": "application/json",
};

app.post("/midtrans-status", (req, res) => {
  axios({
    method: "GET",
    url: MIDTRANS_API_STATUS_URL + req.body.order_id + "/status",
    timeout: API_TIMEOUT,
    headers: MIDTRANS_API_HEADER
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
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
});