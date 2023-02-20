import { LOGIN_USER, CHECK_LOGIN, LOGOUT_USER } from "actions/AuthAction";

const initialState = {
  loginLoading: false,
  loginResult: false,
  loginError: false,

  checkLoginLoading: false,
  checkLoginResult: false,
  checkLoginError: false,

  logoutLoading: false,
  logoutResult: false,
  logoutError: false,
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

    case CHECK_LOGIN:
      return {
        ...state,
        checkLoginLoading: action.payload.loading,
        checkLoginResult: action.payload.data,
        checkLoginError: action.payload.errorMessage,
      };
      case LOGOUT_USER:
      return {
        ...state,
        logoutLoading: action.payload.loading,
        logoutResult: action.payload.data,
        logoutError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
