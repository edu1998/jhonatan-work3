import * as types from "./types";
import axios from "axios";

export const getPartner = () => ({
    type: types.GET_PARTNER,
});
export const getPartnerSuccess = (data) => ({
    type: types.GET_PARTNER_SUCCESS,
    payload: data
});
export const getPartnerFailed = (data) => ({
    type: types.GET_PARTNER_FAILED,
    payload: data
});

export const updatePartner = () => ({
    type: types.UPDATE_PARTNER,
});
export const updatePartnerSuccess = (data) => ({
    type: types.UPDATE_PARTNER_SUCCESS,
    payload: data
});
export const updatePartnerFailed = (data) => ({
    type: types.UPDATE_PARTNER_FAILED,
    payload: data
});
export const addPartner = () => ({
    type: types.ADD_PARTNER,
});
export const addPartnerSuccess = (data) => ({
    type: types.ADD_PARTNER_SUCCESS,
    payload: data
});
export const addPartnerFailed = (data) => ({
    type: types.ADD_PARTNER_FAILED,
    payload: data
});
export const savePartnerData = (data) => ({
    type: types.SAVE_PARTNER_DATA,
    payload: data
});

