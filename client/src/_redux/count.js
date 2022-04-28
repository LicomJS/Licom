import { createSlice } from "@reduxjs/toolkit";

export const countSlice = createSlice({
  name: "count",
  initialState: 0,
  reducers: {
    setCount: (_state, action) => {
      return action.payload;
    },
    addCount: (state, action) => {
      return state + action.payload;
    },
  },
});

export const { setCount, addCount } = countSlice.actions;

export default countSlice.reducer;
