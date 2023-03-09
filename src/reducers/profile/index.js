import { GET_DETAIL_PROFILE, UPDATE_PROFILE, RESET_PASSWORD, GET_ADMIN_PROFILE } from "actions/ProfileAction";

const initialState = {
  getDetailProfileLoading: false,
  getDetailProfileResult: false,
  getDetailProfileError: false,

  updateProfileLoading: false,
  updateProfileResult: false,
  updateProfileError: false,

  resetPasswordLoading: false,
  resetPasswordResult: false,
  resetPasswordError: false,

  getAdminProfileLoading: false,
  getAdminProfileResult: false,
  getAdminProfileError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DETAIL_PROFILE:
      return {
        ...state,
        getDetailProfileLoading: action.payload.loading,
        getDetailProfileResult: action.payload.data,
        getDetailProfileError: action.payload.errorMessage,
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        updateProfileLoading: action.payload.loading,
        updateProfileResult: action.payload.data,
        updateProfileError: action.payload.errorMessage,
      };

    case RESET_PASSWORD:
      return {
        ...state,
        resetPasswordLoading: action.payload.loading,
        resetPasswordResult: action.payload.data,
        resetPasswordError: action.payload.errorMessage,
      };

    case GET_ADMIN_PROFILE:
      return {
        ...state,
        getAdminProfileLoading: action.payload.loading,
        getAdminProfileResult: action.payload.data,
        getAdminProfileError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
