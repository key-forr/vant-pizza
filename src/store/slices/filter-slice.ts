import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const sortProperty = {
  RATING: "rating",
  TITLE: "title",
  PRICE: "price",
} as const;

export type sortProperty = (typeof sortProperty)[keyof typeof sortProperty];

export type SortType = {
  name: string;
  sortProperty: sortProperty;
};

export interface FilterStateProps {
  searchValue: string;
  categoryId: number;
  sortType: SortType;
  sortOrder: boolean;
  pageNumber: number;
}

const initialState: FilterStateProps = {
  searchValue: "",
  categoryId: 0,
  sortType: {
    name: "популярності",
    sortProperty: sortProperty.RATING,
  },
  sortOrder: true,
  pageNumber: 1,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<number>) => {
      state.categoryId = action.payload;
    },
    selectSortType: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
    },
    switchOrder: (state) => {
      state.sortOrder = !state.sortOrder;
    },
    selectPage: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterStateProps>>) => {
      // Безпечне оновлення з перевіркою наявності властивостей
      if (action.payload.categoryId !== undefined) {
        state.categoryId = Number(action.payload.categoryId);
      }
      if (action.payload.sortType) {
        state.sortType = action.payload.sortType;
      }
      if (action.payload.sortOrder !== undefined) {
        state.sortOrder = action.payload.sortOrder;
      }
      if (action.payload.pageNumber !== undefined) {
        state.pageNumber = Number(action.payload.pageNumber);
      }
      if (action.payload.searchValue !== undefined) {
        state.searchValue = action.payload.searchValue;
      }
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    // Додаємо reducer для скидання до початкових значень
    resetFilters: (state) => {
      state.searchValue = initialState.searchValue;
      state.categoryId = initialState.categoryId;
      state.sortType = initialState.sortType;
      state.sortOrder = initialState.sortOrder;
      state.pageNumber = initialState.pageNumber;
    },
  },
});

export const filterSelector = (state: RootState) => state.filter;

export const {
  selectCategory,
  selectSortType,
  switchOrder,
  selectPage,
  setFilters,
  setSearchValue,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
