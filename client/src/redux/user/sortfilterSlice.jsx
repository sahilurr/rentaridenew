import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  price: 0,
  data: null,
  filterdData: [],
  variantMode: false,
  //this variant mode desiced are we in filtering Searched Data form home page ro are we filtering from allVehicles data from Navbar to filter component
};

const sortfilterSlice = createSlice({
  name: "sortfilterSlice",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setPriceLowtoHigh: (state) => {
      state.filterdData = state.filterdData.sort((a, b) => a.price - b.price);
    },
    setPriceHightoLow: (state) => {
      state.filterdData = state.filterdData.sort((a, b) => b.price - a.price);
    },
    setYearAscending: (state) => {
      state.filterdData = state.filterdData.sort(
        (a, b) => a.year_made - b.year_made
      );
    },
    setYearDecending: (state) => {
      state.filterdData = state.filterdData.sort(
        (a, b) => b.year_made - a.year_made
      );
    },
    setFilteredData: (state, action) => {
      state.filterdData = action.payload;
    },
    setVariantModeOrNot: (state, action) => {
      state.variantMode = action.payload;
    },
  },
});

export const {
  setPriceLowtoHigh,
  setPriceHightoLow,
  setYearAscending,
  setYearDecending,
  setData,
  setFilteredData,
  setVariantModeOrNot,
} = sortfilterSlice.actions;
export default sortfilterSlice.reducer;
