import { createSlice } from "@reduxjs/toolkit";


const getInitialUserMe = () => {
  if (typeof window !== "undefined") {
    const storedUserMe = localStorage.getItem("UserMe");
    return storedUserMe ? JSON.parse(storedUserMe) : null;
  }
  return null;
};
const initialState = {
  userMe: getInitialUserMe(),
};

const UserMelice = createSlice({
  name: "userMe",
  initialState,
  reducers: {
    changeUserMe: (state, action) => {
      state.userMe = action.payload || null;
      localStorage.setItem("userMe", JSON.stringify(state.userMe));
    },
  },
});

export const { changeUserMe } = UserMelice.actions;
export default UserMelice.reducer;
