import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: 0,
  sortType: {
    name: "популярності",
    sortProperty: "rating",
  },
  sortOrder: true,
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
  },
});

export const { selectCategory, selectSortType, switchOrder } =
  filterSlice.actions;

export default filterSlice.reducer;
