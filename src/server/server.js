const express = require("express");
const cors = require("cors");

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
      Authorization:
        "Basic U0ItTWlkLXNlcnZlci1XV19XODdST2tGbnRKeUZlcllqN2VqY1Q=",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res
        .status(error)
        .send(
          new Error(
            "Failed to check Midtrans status for Order ID " + req.body.order_id
          )
        );
    });
});
