import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Car {
  unit_id: number;
  value: string;
  label: string;
}

interface ListState {
  cars: Car[];
  selectedCar: Car | null;
  startDate: string;
  endDate: string;
}

const initialState: ListState = {
  cars: [],
  selectedCar: null,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setCars, setSelectedCar, setStartDate, setEndDate } =
  listSlice.actions;
export default listSlice.reducer;