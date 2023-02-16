import { combineReducers } from "redux";
import KategoriReducer from "./kategori";
import BannerReducer from "./banner";

export default combineReducers ({
    KategoriReducer, BannerReducer
})