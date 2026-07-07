import { configureStore } from "@reduxjs/toolkit";
import { BusketReducer, LikeReducer, TokenReducer, UserMeReducer } from "./features";

export const makeStore = () => {
  return configureStore({
    reducer: {
      likes: LikeReducer,
      buskets: BusketReducer,
      token: TokenReducer,
      userMe: UserMeReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
