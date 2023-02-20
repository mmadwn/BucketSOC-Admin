import { combineReducers } from "redux";
import KategoriReducer from "./kategori";
import BannerReducer from "./banner";
import UserReducer from "./user";
import ProdukReducer from "./produk";
import AuthReducer from "./auth";
import ProfileReducer from './profile';

export default combineReducers({
  KategoriReducer,
  BannerReducer,
  UserReducer,
  ProdukReducer,
  AuthReducer,
  ProfileReducer,
});
