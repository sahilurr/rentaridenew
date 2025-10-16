import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    adminEditVehicleSuccess:false,
    adminEditVehicleError:false,
    adminEditVehicleLoading:false,
    adminAddVehicleSuccess:false,
    adminCrudError:false,
    loading:false
}

export const StatusSlice = createSlice({
    name: "statusSlice",
    initialState: initialState,
    reducers: {
      setadminEditVehicleSuccess: (state, action) => {
        state.adminEditVehicleSuccess = action.payload;
      },
      setadminAddVehicleSuccess:(state,action) => {
        state.adminAddVehicleSuccess = action.payload;
      },
      setadminCrudError:(state,action) => {
        state.adminCrudError = action.payload;
      },
      setLoading:(state,action) => {
        state.loading = action.payload
      },
      clearAdminVehicleToast: (state) => {
        state.adminEditVehicleSuccess = false
        state.adminEditVehicleError = false
        state.adminCrudError = false
        state.loading = false
      },
     
    },
  });
  
  export const {setadminEditVehicleSuccess,clearAdminVehicleToast ,setadminAddVehicleSuccess,setadminCrudError,setLoading} = StatusSlice.actions;
  export default StatusSlice.reducer;
  