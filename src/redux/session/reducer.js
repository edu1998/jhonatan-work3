import createReducer from "../store/createReducer";
import * as types from "./types";

const initialState = {
  error: null,
  session: null,
  language: 'es'
}
const Session = createReducer(initialState, {

  [types.LOGIN](state) {
    return {
      ...state,
      error: null,
      session: null,
    };
  },
  [types.LOGIN_SUCCESS](state, action) {
    return {
      ...state,
      error: null,
      session: action.payload
    };
  },
  [types.LOGIN_FAILED](state, action) {
    return {
      ...initialState,
      error: action.payload,
      session: null
    };
  },
  [types.LOGOUT](state) {
    return {
      ...state,
      error: null,
      session: null,
    };
  },
  [types.UPDATE_STATE_SELLER_ACCOUNT](state, action) {
    return {
      ...state,
      ...state.session.userInfo.sellerAccountStatus = action.payload,
    };
  },
  [types.UPDATE_USER_INFO](state, action) {
    let currentUserInfo = state.session.userInfo;
    let newUserInfo = {
      ...currentUserInfo,
      name: action.payload.name,
      phone: action.payload.phone,
      birthday: action.payload.birthday,
      passport_id: action.payload.passport_id,
      country_id: action.payload.country_id,
      x_fantasy_name:action.payload.x_fantasy_name,
      x_employees_number:action.payload.x_employees_number,
      x_sales_range:action.payload.x_sales_range,
      x_project_name:action.payload.x_project_name,
    };
    return {
      ...state,
      session: {
        ...state.session,
        userInfo: newUserInfo
      }
    };
  },
});

export default Session;