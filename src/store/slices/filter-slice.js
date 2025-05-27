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
  name: "filter",
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
    setFilters: (state, action) => {
      state.categoryId = Number(action.payload.categoryId);
      state.sortType = action.payload.sortType;
      state.sortOrder = action.payload.sortOrder;
      state.pageNumber = Number(action.payload.pageNumber);
    },
  },
});

export const {
  selectCategory,
  selectSortType,
  switchOrder,
  selectPage,
  setFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
