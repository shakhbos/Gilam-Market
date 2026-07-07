import { createSlice } from "@reduxjs/toolkit";

const getInitialLikes = () => {
  if (typeof window !== "undefined") {
    const storedLikes = localStorage.getItem("likes");
    return storedLikes ? JSON.parse(storedLikes) : [];
  }
  return [];
};

const initialState = {
  likes: getInitialLikes(),
};

const LikeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    changeLike: (state, action) => {
      state.likes = action.payload || [];

      localStorage.setItem("likes", JSON.stringify(state.likes));
    },
  },
});

export const { changeLike } = LikeSlice.actions;
export default LikeSlice.reducer;
