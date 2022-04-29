import { createSlice } from "@reduxjs/toolkit";

export const urlSlice = createSlice({
  name: "url",
  initialState: "",
  reducers: {
    initUrl: () => {
      const query = new URLSearchParams(window.location.search);
      const url = query.get("url");
      return url;
    },
    setUrl: (_state, action) => {
      return action.payload;
    },
  },
});

export const { initUrl, setUrl } = urlSlice.actions;

export default urlSlice.reducer;
