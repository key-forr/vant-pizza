import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: 0,
  sortType: {
    name: "популярності",
    sortProperty: "rating",
  },
  sortOrder: true,
  pageNumber: 1,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState: initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.categoryId = action.payload;
    },
    selectSortType: (state, action) => {
      state.sortType = action.payload;
    },
    switchOrder: (state) => {
      state.sortOrder = !state.sortOrder;
    },
    selectPage: (state, action) => {
      state.pageNumber = action.payload;
    },
  },
});

export const { selectCategory, selectSortType, switchOrder, selectPage } =
  filterSlice.actions;

export default filterSlice.reducer;
