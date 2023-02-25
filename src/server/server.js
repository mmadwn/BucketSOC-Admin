const express = require("express");
const cors = require("cors");
const { Buffer } = require("buffer");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

const { default: axios } = require("axios");

app.post("/midtrans-status", (req, res) => {
  axios({
    method: "GET",
    url: "https://api.sandbox.midtrans.com/v2/" + req.body.order_id + "/status",
    timeout: 120000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization":
        "Basic U0ItTWlkLXNlcnZlci1XV19XODdST2tGbnRKeUZlcllqN2VqY1Q=",
    },
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
    url: "https://invoice-generator.com",
    timeout: 120000,
    data: req.body.data,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
    },
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
    url: "https://api.biteship.com/v1/orders",
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZyIsInVzZXJJZCI6IjYzODc5NjViNTcyNGJjMjUwODRiYTAxZSIsImlhdCI6MTY2OTgzMDQxM30.l_aayhOYhf3AM7m6_BIUT0ETNzQMsSJmCEvbJj-Whdo",
    },
    data: req.body.data,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});