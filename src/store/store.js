import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filter-slice";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});
