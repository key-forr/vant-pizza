import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filter-slice";
import cartReducer from "./slices/cart-slice";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    cart: cartReducer,
  },
});
