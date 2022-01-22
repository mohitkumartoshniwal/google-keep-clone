import { SET_FILTER_COLOR, SET_FILTER_TEXT } from "../constants/filterConstants";

export const setFilterText = (filterText) => ({type: SET_FILTER_TEXT, filterText: filterText});

export const setFilterColor = (filterColor) => ({type: SET_FILTER_COLOR, filterColor: filterColor});
