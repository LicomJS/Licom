import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: "",
  reducers: {
    getAuth: (state) => {
      if (JSON.parse(localStorage.getItem("licom"))) {
        const l = JSON.parse(localStorage.getItem("licom"));
        if (l && l.login && l.authKey && l.publicKey && l.privateKey) {
          return l;
        }
      } else {
        return state;
      }
    },

    setAuth: (_state, action) => {
      localStorage.setItem("licom", JSON.stringify(action.payload));
      return action.payload;
    },
    deleteAuth: (_state, action) => {
      localStorage.removeItem("licom");
      return action.payload;
    },
  },
});

export const { getAuth, setAuth, deleteAuth } = authSlice.actions;

export default authSlice.reducer;
