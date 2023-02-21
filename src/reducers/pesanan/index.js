import {
    GET_LIST_PESANAN, UPDATE_STATUS
  } from "actions/PesananAction";
  
  const initialState = {
    getListPesananLoading: false,
    getListPesananResult: false,
    getListPesananError: false,

    updateStatusLoading: false,
    updateStatusResult: false,
    updateStatusError: false,
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

      default:
        return state;
    }
  }
  