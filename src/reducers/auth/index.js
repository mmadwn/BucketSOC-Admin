import { LOGIN_USER } from "actions/AuthAction";

const initialState = {
  loginLoading: false,
  loginResult: false,
  loginError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginLoading: action.payload.loading,
        loginResult: action.payload.data,
        loginError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
