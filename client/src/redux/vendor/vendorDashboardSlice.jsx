import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vendorVehilces : [],
    vendorVehicleApproved:[],
    adminVenodrRequest:[],
    vendorEditSuccess:false,
    vendorError:false,
    vendorDeleteSuccess:false
    
  
}

export const VendorDashboardSlice = createSlice({
    name: "modelDataSlice",
    initialState: initialState,
    reducers: {
      setVenodrVehilces: (state, action) => {
        state.vendorVehilces = action.payload;
      },
      setUpdateRequestTable:(state,action) =>  {
        state.adminVenodrRequest = state.adminVenodrRequest.filter((cur)=> cur._id !== action.payload)
      },
    
      setadminVenodrRequest:(state,action) => {
        state.adminVenodrRequest = action.payload
      },
      setVendorEditSuccess:(state,action) => {
        state.vendorEditSuccess = action.payload
      },
      setVendorError:(state,action) => {
        state.vendorError = action.payload
      },
      setVendorDeleteSuccess:(state,action) => {
        state.vendorDeleteSuccess = action.payload
      }
      
      
    },
  });
  
  export const { setVenodrVehilces  ,setadminVenodrRequest,setUpdateRequestTable ,setVendorEditSuccess ,setVendorError,setVendorDeleteSuccess } = VendorDashboardSlice.actions;
  export default VendorDashboardSlice.reducer;
  