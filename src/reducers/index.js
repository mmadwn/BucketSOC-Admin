import { combineReducers } from "redux";
import KategoriReducer from "./kategori";
import BannerReducer from "./banner";
import UserReducer from "./user";
import ProdukReducer from "./produk";
import AuthReducer from "./auth";
import ProfileReducer from './profile';
import PesananReducer from './pesanan';
import InvoiceReducer from './invoice';

export default combineReducers({
  KategoriReducer,
  BannerReducer,
  UserReducer,
  ProdukReducer,
  AuthReducer,
  ProfileReducer,
  PesananReducer,
  InvoiceReducer,
});
