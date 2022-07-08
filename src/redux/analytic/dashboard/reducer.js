import createReducer from "../../store/createReducer";
import * as types from "./types";

const initialData = {
  rows: [],
  loading: false,
  filter: {},
  rawFilter: {},
  loadingProgress: {}
};

const dashboard = createReducer(initialData, {
  [types.DASHBOARD_FETCH_STARTED](state, action) {
    return {
      ...state,
      rows: [],
      loading: true,
      filter: action.payload ? action.payload.filter : {},
      rawFilter: action.payload ? action.payload.rawFilter : {},
      loadingProgress: action.payload.loadingProgress
    };
  },
  [types.DASHBOARD_FETCH_SUCCESS](state, action) {
     let filteredRows = action.payload.rows.map((partner)=> {
      let newPartner = partner;
      newPartner.children = partner.children.map((market)=> {
        let childrenWithoutParents = [];
        let parents = [];
        market.children.map((listing) => {
          if(listing.children.length == 1 && !listing.children[0].isVariant){
            childrenWithoutParents.push(listing.children[0]);
          } else {
            parents.push(listing);
          }
        });
        market.children = [...childrenWithoutParents, ...parents];       
        return market;
      })
      return newPartner;
    })
    return {
      ...state,
      loading: true,
      rows: [...state.rows, ...action.payload.rows ],
      loadingProgress: action.payload.loadingProgress
    };
  }
  ,
  [types.DASHBOARD_FETCH_FINISH](state, action) {
    return {
      ...state,
      loading: false,
    };
  }
  ,
  [types.DASHBOARD_FETCH_ERROR](state, action) {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  },
  [types.DASHBOARD_RESETED](state, action) {
    return {
      ...initialData,
    };
  }

});

export default dashboard;