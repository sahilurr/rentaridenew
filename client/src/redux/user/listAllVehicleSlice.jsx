import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userAllVehicles :[],
    singleVehicleDetail:'',
    allVariants:''
}

const listAllVehicles = createSlice({
    name:"userListVehicles",
    initialState,
    reducers:{
        showVehicles:(state,action)=> {
            state.userAllVehicles = action.payload
        },
        setVehicleDetail:(state,action)=> {
            state.singleVehicleDetail = action.payload
        },
        setVariants:(state,action) => {
            state.allVariants  = action.payload
        }

    }
   


})
export const  {showVehicles,setVehicleDetail,setVariants} =  listAllVehicles.actions
export default listAllVehicles.reducer