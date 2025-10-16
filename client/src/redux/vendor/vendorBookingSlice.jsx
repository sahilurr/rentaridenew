import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isVendorOderModalOpen: false,
  vendorSingleOrderDetails: null,
};

export const vendorBookingSlice = createSlice({
  name: "vendorBookingSlice",
  initialState: initialState,
  reducers: {
    setVendorOrderModalOpen: (state, action) => {
      state.isVendorOderModalOpen = action.payload;
    },
    setVendorSingleOrderDetails:(state,action) => {
        state.vendorSingleOrderDetails = action.payload
    }
  },
});

export const { setVendorOrderModalOpen ,setVendorSingleOrderDetails} = vendorBookingSlice.actions;
export default vendorBookingSlice.reducer;
