import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { type Pizza } from "../../@types/pizza";
import { RootState } from "../store";

export interface FetchPizzaProps {
  category: string;
  orderType: string;
  pageNumber: string;
  sortType: {
    sortProperty: string;
  };
}

export const fetchPizzas = createAsyncThunk<Pizza[], FetchPizzaProps>(
  "pizza/fetchPizzasStatus",
  async (params, thunkApi) => {
    const { category, orderType, pageNumber, sortType } = params;

    const { data } = await axios.get<Pizza[]>(
      `${process.env.REACT_APP_SERVER_URL}/items?page=${pageNumber}&limit=8&${category}&sortBy=${sortType.sortProperty}&order=${orderType}`
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

// enum Status {
//   LOADING = "loading",
//   SUCCESS = "success",
//   ERROR = "error"
// }

export const Status = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

interface PizzaStateProps {
  pizzas: Pizza[];
  status: Status;
}

const initialState: PizzaStateProps = {
  pizzas: [],
  status: Status.LOADING,
};

export const pizzaSlice = createSlice({
  name: "pizza",
  initialState: initialState,
  reducers: {
    setPizzas: (state, action: PayloadAction<Pizza[]>) => {
      state.pizzas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.pizzas = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchPizzas.pending, (state) => {
      state.pizzas = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchPizzas.rejected, (state) => {
      state.pizzas = [];
      state.status = Status.ERROR;
    });
  },
});

export const pizzaSelector = (state: RootState) => state.pizza;

export const { setPizzas } = pizzaSlice.actions;

export default pizzaSlice.reducer;
