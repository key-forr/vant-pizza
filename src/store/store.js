import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filter-slice";
import cartReducer from "./slices/cart-slice";
import pizzaReducer from "./slices/pizza-slice";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    cart: cartReducer,
    pizza: pizzaReducer,
  },
});
