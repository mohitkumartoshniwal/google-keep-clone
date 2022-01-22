import { loadState } from "../../utils/localStorage";
import { SET_FILTER_COLOR, SET_FILTER_TEXT } from "../constants/filterConstants";
const loadedState = loadState("filters");
const initialState = (loadedState !== null) ? loadedState : {
  filterColor: "",
  filterText: "",
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_TEXT:
      return {
        ...state,
        filterText: action.filterText,
      };
    case SET_FILTER_COLOR:
      return {
        ...state,
        filterColor: action.filterColor,
      }
    default:
      return state;
  }
};

export default filtersReducer;
