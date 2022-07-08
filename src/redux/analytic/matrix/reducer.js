import createReducer from "../../store/createReducer";

const initialData = {
    rows: [],
    count: 0,
    loading: false,
    filter: {},
    rawFilter: {},
    selectedKeys: [],
  };

  const matrix = createReducer(initialData, {

  });

  export default matrix;