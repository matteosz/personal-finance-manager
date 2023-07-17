import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import user from "./user";
import currency from "./currency";
import global from "./global";

export default combineReducers({
  auth,
  message,
  user,
  currency,
  global,
});
