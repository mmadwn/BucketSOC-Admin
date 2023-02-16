import { combineReducers } from "redux";
import KategoriReducer from "./kategori";
import BannerReducer from "./banner";
import UserReducer from './user';
import ProdukReducer from './produk'


export default combineReducers ({
    KategoriReducer, BannerReducer, UserReducer, ProdukReducer
})