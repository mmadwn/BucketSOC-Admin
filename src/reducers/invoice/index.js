import { CREATE_INVOICE } from "../../actions/InvoiceAction";

const initialState = {
  createInvoiceLoading: false,
  createInvoiceResult: false,
  createInvoiceError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_INVOICE:
      return {
        ...state,
        createInvoiceLoading: action.payload.loading,
        createInvoiceResult: action.payload.data,
        createInvoiceError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}