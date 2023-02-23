import axios from "axios";
import Swal from "sweetalert2";
import { API_TIMEOUT, INVOICE_API_URL, INVOICE_API_HEADER } from "../utils";
import { dispatchError, dispatchLoading, dispatchSuccess } from "../utils";

export const CREATE_INVOICE = "CREATE_INVOICE";

export const createInvoice = (data) => {
  return (dispatch) => {
    //LOADING
    dispatchLoading(dispatch, CREATE_INVOICE);

    axios({
      method: "POST",
      url: INVOICE_API_URL,
      timeout: API_TIMEOUT,
      headers: INVOICE_API_HEADER,
      responseType: "blob",
      data: data,
    })
      .then((response) => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `file`);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        //SUKSES
        dispatchSuccess(dispatch, CREATE_INVOICE, response);
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
