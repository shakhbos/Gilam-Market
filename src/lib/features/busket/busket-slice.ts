import { createSlice } from "@reduxjs/toolkit";

const getInitialBuskets = () => {
  if (typeof window !== "undefined") {
    const storedBuskets = localStorage.getItem("buskets");
    return storedBuskets ? JSON.parse(storedBuskets) : [];
  }
  return [];
};
const initialState = {
  buskets:getInitialBuskets(),
};

const Busketslice = createSlice({
  name: "buskets",
  initialState,
  reducers: {
    changeBuskets: (state, action) => {
      state.buskets = action.payload || [];
      localStorage.setItem("buskets", JSON.stringify(state.buskets));
    },
  },
});

export const { changeBuskets } = Busketslice.actions;
export default Busketslice.reducer;
