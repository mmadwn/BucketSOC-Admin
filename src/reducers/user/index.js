import {
  GET_LIST_USER,
} from "actions/UserAction";

const initialState = {
  getListUserLoading: false,
  getListUserResult: false,
  getListUserError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_USER:
      return {
        ...state,
        getListUserLoading: action.payload.loading,
        getListUserResult: action.payload.data,
        getListUserError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
