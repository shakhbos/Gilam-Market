import LikeReducer, { changeLike } from "./likes/like-slice";
import BusketReducer, { changeBuskets } from "./busket/busket-slice";
import TokenReducer, { changeToken } from "./token/token-slice";
import  UserMeReducer , { changeUserMe } from "./user-me/userMe-slice";

export {
  changeLike,
  LikeReducer,
  changeBuskets,
  BusketReducer,
  changeToken,
  TokenReducer,
  changeUserMe,
  UserMeReducer,
};
