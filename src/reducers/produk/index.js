import {
  GET_LIST_PRODUK,
  TAMBAH_PRODUK,
  GET_DETAIL_PRODUK,
  UPDATE_PRODUK,
  DELETE_PRODUK,
} from "actions/ProdukAction";

const initialState = {
  getListProdukLoading: false,
  getListProdukResult: false,
  getListProdukError: false,

  tambahProdukLoading: false,
  tambahProdukResult: false,
  tambahProdukError: false,

  getDetailProdukLoading: false,
  getDetailProdukResult: false,
  getDetailProdukError: false,

  updateProdukLoading: false,
  updateProdukResult: false,
  updateProdukError: false,

  deleteProdukLoading: false,
  deleteProdukResult: false,
  deleteProdukError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_PRODUK:
      return {
        ...state,
        getListProdukLoading: action.payload.loading,
        getListProdukResult: action.payload.data,
        getListProdukError: action.payload.errorMessage,
      };

    case TAMBAH_PRODUK:
      return {
        ...state,
        tambahProdukLoading: action.payload.loading,
        tambahProdukResult: action.payload.data,
        tambahProdukError: action.payload.errorMessage,
      };

    case GET_DETAIL_PRODUK:
      return {
        ...state,
        getDetailProdukLoading: action.payload.loading,
        getDetailProdukResult: action.payload.data,
        getDetaiProdukiError: action.payload.errorMessage,
      };

    case UPDATE_PRODUK:
      return {
        ...state,
        updateProdukLoading: action.payload.loading,
        updateProdukResult: action.payload.data,
        updateProdukError: action.payload.errorMessage,
      };

    case DELETE_PRODUK:
      return {
        ...state,
        deleteProdukLoading: action.payload.loading,
        deleteProdukResult: action.payload.data,
        deleteProdukError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
