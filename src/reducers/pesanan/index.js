import {
    GET_LIST_PESANAN, UPDATE_STATUS, GET_DETAIL_PESANAN, CONFIRM_PESANAN
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

      default:
        return state;
    }
  }
  