import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import commentsReducer from "./comments";
import countReducer from "./count";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentsReducer,
    count: countReducer,
  },
});
