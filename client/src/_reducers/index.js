import { combineReducers } from "redux";
import { auth, comments, count } from "./app";

const allReducer = combineReducers({
  auth,
  comments,
  count,
});

export default allReducer;
