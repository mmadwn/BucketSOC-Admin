import { GET_DETAIL_PROFILE, UPDATE_PROFILE } from "actions/ProfileAction";

const initialState = {
  getDetailProfileLoading: false,
  getDetailProfileResult: false,
  getDetailProfileError: false,

  updateProfileLoading: false,
  updateProfileResult: false,
  updateProfileError: false,
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

    default:
      return state;
  }
}
