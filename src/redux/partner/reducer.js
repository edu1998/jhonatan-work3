import createReducer from "../store/createReducer";
import * as types from "./types";

const initialState = {
  loading: false,
  error: null,
  partner: null,
  myAccountData: null,
}
const Partner = createReducer(initialState, {

  [types.GET_PARTNER](state) {
    return {
      ...state,
      loading: true,
      error: null,
      myAccountData: null
      // partner: null,
    };
  },
  [types.GET_PARTNER_SUCCESS](state, action) {
    return {
      ...state,
      loading: false,
      error: null,
      partner: action.payload
    };
  },
  [types.GET_PARTNER_FAILED](state, action) {
    return {
      ...initialState,
      error: action.payload,
      partner: null
    };
  },

  [types.UPDATE_PARTNER](state) {
    return {
      ...state,
      loading: true,
      error: null,
      // partner: null,
    };
  },
  [types.UPDATE_PARTNER_SUCCESS](state, action) {
    return {
      ...state,
      loading: false,
      error: null,
      partner: action.payload
    };
  },
  [types.UPDATE_PARTNER_FAILED](state) {
    return {
      ...state,
      loading: false,
    };
  },

  [types.ADD_PARTNER](state) {
    return {
      ...state,
      loading: true,
      error: null,
      // partner: null,
    };
  },
  [types.ADD_PARTNER_SUCCESS](state, action) {
    return {
      ...state,
      loading: false,
      error: null,
      partner: action.payload
    };
  },
  [types.ADD_PARTNER_FAILED](state) {
    return {
      ...state,
      loading: false,
    };
  },
  [types.SAVE_PARTNER_DATA](state, action) {
    return {
      ...state,
      loading: false,
      error: null,
      myAccountData: action.payload
    };
  },

});

export default Partner;