import {
  GET_LIST_KATEGORI,
  TAMBAH_KATEGORI,
  GET_DETAIL_KATEGORI,
  UPDATE_KATEGORI,
  DELETE_KATEGORI,
} from "actions/KategoriAction";

const initialState = {
  getListKategoriLoading: false,
  getListKategoriResult: false,
  getListKategoriError: false,

  tambahKategoriLoading: false,
  tambahKategoriResult: false,
  tambahKategoriError: false,

  getDetailKategoriLoading: false,
  getDetailKategoriResult: false,
  getDetailKategoriError: false,

  updateKategoriLoading: false,
  updateKategoriResult: false,
  updateKategoriError: false,

  deleteKategoriLoading: false,
  deleteKategoriResult: false,
  deleteKategoriError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_KATEGORI:
      return {
        ...state,
        getListKategoriLoading: action.payload.loading,
        getListKategoriResult: action.payload.data,
        getListKategoriError: action.payload.errorMessage,
      };

    case TAMBAH_KATEGORI:
      return {
        ...state,
        tambahKategoriLoading: action.payload.loading,
        tambahKategoriResult: action.payload.data,
        tambahKategoriError: action.payload.errorMessage,
      };

    case GET_DETAIL_KATEGORI:
      return {
        ...state,
        getDetailKategoriLoading: action.payload.loading,
        getDetailKategoriResult: action.payload.data,
        getDetailKategoriError: action.payload.errorMessage,
      };

    case UPDATE_KATEGORI:
      return {
        ...state,
        updateKategoriLoading: action.payload.loading,
        updateKategoriResult: action.payload.data,
        updateKategoriError: action.payload.errorMessage,
      };

    case DELETE_KATEGORI:
      return {
        ...state,
        deleteKategoriLoading: action.payload.loading,
        deleteKategoriResult: action.payload.data,
        deleteKategoriError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
