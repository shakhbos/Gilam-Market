import { createSlice } from "@reduxjs/toolkit";


const getInitialToken = () => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("i-share-token");
    return storedToken ? JSON.parse(storedToken) : null;
  }
  return null;
};
const initialState = {
  token: getInitialToken(),
};

const Tokenlice = createSlice({
  name: "i-share-token",
  initialState,
  reducers: {
    changeToken: (state, action) => {
      state.token = action.payload || null;
      localStorage.setItem("i-share-token", JSON.stringify(state.token));
    },
  },
});

export const { changeToken } = Tokenlice.actions;
export default Tokenlice.reducer;
