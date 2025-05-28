import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPizzas = createAsyncThunk(
  "pizza/fetchPizzasStatus",
  async (params, thunkApi) => {
    const { category, orderType, pageNumber, sortType } = params;

    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/items?page=${pageNumber}&limit=4&${category}&sortBy=${sortType.sortProperty}&order=${orderType}`
    );

    //#region
    //console.log(thunkApi);
    //console.log(thunkApi.getState());
    // if (data.length == 0) {
    //   return thunkApi.rejectWithValue("Піц нема");
    // }
    //#endregion

    return thunkApi.fulfillWithValue(data);
  }
);

const initialState = {
  pizzas: [],
  status: "loading", // loading | success | error
};

export const pizzaSlice = createSlice({
  name: "pizza",
  initialState: initialState,
  reducers: {
    setPizzas: (state, action) => {
      state.pizzas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.pizzas = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchPizzas.pending, (state) => {
      state.pizzas = [];
      state.status = "loading";
    });
    builder.addCase(fetchPizzas.rejected, (state) => {
      state.pizzas = [];
      state.status = "error";
    });
  },
});

export const { setPizzas } = pizzaSlice.actions;

export default pizzaSlice.reducer;
