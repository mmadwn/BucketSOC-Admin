import {
    GET_LIST_PESANAN,
  } from "actions/PesananAction";
  
  const initialState = {
    getListPesananLoading: false,
    getListPesananResult: false,
    getListPesananError: false,
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
  
      default:
        return state;
    }
  }
  