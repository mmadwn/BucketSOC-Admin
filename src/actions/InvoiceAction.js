import axios from "axios";
import Swal from "sweetalert2";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";

export const CREATE_INVOICE = "CREATE_INVOICE";

export const createInvoice = (data) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CREATE_INVOICE);

    const parameter = {
      data
    }

    axios({
      method: "POST",
      url: "http://localhost:8000/invoice",
      responseType: "blob",
      data: parameter,
    })
      .then((response) => {
        // SUCCESS
        const file = new Blob([response.data], { type: "application/pdf" }); // membuat blob dari respon
        const fileURL = URL.createObjectURL(file); // membuat URL objek dari blob
        window.open(fileURL); // membuka tautan URL objek di tab baru

        //JIka ingin download langsung
        // const filename = "invoice.pdf";
        // const blob = new Blob([response.data], { type: "application/pdf" }); // membuat blob dari respon
        // const link = document.createElement("a"); // membuat link download
        // link.href = window.URL.createObjectURL(blob);
        // link.download = filename;
        // link.click();
        dispatchSuccess(dispatch, CREATE_INVOICE);
      })
      .catch((error) => {
        // ERROR
        dispatchError(dispatch, CREATE_INVOICE, error.message);
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
