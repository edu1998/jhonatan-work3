import * as types from "./types";

export const getMe = (data) => ({
  type: types.GET_SESSION_ME,
  payload: data,
});

export const login = () => ({ type: types.LOGIN });

export const logout = () => ({ type: types.LOGOUT });

export const loginSucces = (data) => ({
  type: types.LOGIN_SUCCESS,
  payload: data,
});

export const loginFailed = (data) => ({
  type: types.LOGIN_FAILED,
  payload: data,
});

export const updateSellerAccountStatusSession = (data) => ({
  type: types.UPDATE_STATE_SELLER_ACCOUNT,
  payload: data,
});

export const updateUserInfo = (data) => ({
  type: types.UPDATE_USER_INFO,
  payload: data,
});