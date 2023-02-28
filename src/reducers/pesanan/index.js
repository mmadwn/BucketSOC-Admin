import {
  GET_LIST_PESANAN,
  UPDATE_STATUS,
  GET_DETAIL_PESANAN,
  CONFIRM_PESANAN,
  REQUEST_PICK_UP,
  CHANGE_DELIVERY_DATE,
  FINISH_PESANAN,
  CANCEL_PESANAN,
} from "actions/PesananAction";

const initialState = {
  getListPesananLoading: false,
  getListPesananResult: false,
  getListPesananError: false,

  updateStatusLoading: false,
  updateStatusResult: false,
  updateStatusError: false,

  getDetailPesananLoading: false,
  getDetailPesananResult: false,
  getDetailPesananError: false,

  confirmPesananLoading: false,
  confirmPesananResult: false,
  confirmPesananError: false,

  requestPickUpLoading: false,
  requestPickUpResult: false,
  requestPickUpError: false,

  changeDeliveryDateLoading: false,
  changeDeliveryDateResult: false,
  changeDeliveryDateError: false,

  finishPesananLoading: false,
  finishPesananResult: false,
  finishPesananError: false,

  cancelPesananLoading: false,
  cancelPesananResult: false,
  cancelPesananError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_PESANAN:
      return {
        ...state,
        getListPesananLoading: action.payload.loading,
        getListPesananResult: action.payload.data,
        getListPesananError: action.payload.errorMessage,
      };

    case UPDATE_STATUS:
      return {
        ...state,
        updateStatusLoading: action.payload.loading,
        updateStatusResult: action.payload.data,
        updateStatusError: action.payload.errorMessage,
      };

    case GET_DETAIL_PESANAN:
      return {
        ...state,
        getDetailPesananLoading: action.payload.loading,
        getDetailPesananResult: action.payload.data,
        getDetailPesananError: action.payload.errorMessage,
      };

    case CONFIRM_PESANAN:
      return {
        ...state,
        confirmPesananLoading: action.payload.loading,
        confirmPesananResult: action.payload.data,
        confirmPesananError: action.payload.errorMessage,
      };

    case REQUEST_PICK_UP:
      return {
        ...state,
        requestPickUpLoading: action.payload.loading,
        requestPickUpResult: action.payload.data,
        requestPickUpError: action.payload.errorMessage,
      };

    case CHANGE_DELIVERY_DATE:
      return {
        ...state,
        changeDeliveryDateLoading: action.payload.loading,
        changeDeliveryDateResult: action.payload.data,
        changeDeliveryDateError: action.payload.errorMessage,
      };

    case FINISH_PESANAN:
      return {
        ...state,
        finishPesananLoading: action.payload.loading,
        finishPesananResult: action.payload.data,
        finishPesananError: action.payload.errorMessage,
      };

    case CANCEL_PESANAN:
      return {
        ...state,
        cancelPesananLoading: action.payload.loading,
        cancelPesananResult: action.payload.data,
        cancelPesananError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
