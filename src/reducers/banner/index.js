import {
  GET_LIST_BANNER,
  TAMBAH_BANNER,
  GET_DETAIL_BANNER,
  UPDATE_BANNER,
  DELETE_BANNER,
} from "actions/BannerAction";

const initialState = {
  getListBannerLoading: false,
  getListBannerResult: false,
  getListBannerError: false,

  tambahBannerLoading: false,
  tambahBannerResult: false,
  tambahBannerError: false,

  getDetailBannerLoading: false,
  getDetailBannerResult: false,
  getDetailBannerError: false,

  updateBannerLoading: false,
  updateBannerResult: false,
  updateBannerError: false,

  deleteBannerLoading: false,
  deleteBannerResult: false,
  deleteBannerError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_BANNER:
      return {
        ...state,
        getListBannerLoading: action.payload.loading,
        getListBannerResult: action.payload.data,
        getListBannerError: action.payload.errorMessage,
      };

    case TAMBAH_BANNER:
      return {
        ...state,
        tambahBannerLoading: action.payload.loading,
        tambahBannerResult: action.payload.data,
        tambahBannerError: action.payload.errorMessage,
      };

    case GET_DETAIL_BANNER:
      return {
        ...state,
        getDetailBannerLoading: action.payload.loading,
        getDetailBannerResult: action.payload.data,
        getDetailBannerError: action.payload.errorMessage,
      };

    case UPDATE_BANNER:
      return {
        ...state,
        updateBannerLoading: action.payload.loading,
        updateBannerResult: action.payload.data,
        updateBannerError: action.payload.errorMessage,
      };

    case DELETE_BANNER:
      return {
        ...state,
        deleteBannerLoading: action.payload.loading,
        deleteBannerResult: action.payload.data,
        deleteBannerError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
