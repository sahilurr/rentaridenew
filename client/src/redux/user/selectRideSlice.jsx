import { createSlice } from "@reduxjs/toolkit"


const initialState  =  {
    selectedDistrict : null,
    locationsOfDistrict : null,
    wholeData : null,
    availableCars : null,
}

const selectRideSlice = createSlice({
    name:'selectRideSlice',
    initialState,
    reducers:{
        setSelectedDistrict : (state,action) => {
            state.selectedDistrict = action.payload
        },
        setLocationsOfDistrict : (state,action) => {
            state.locationsOfDistrict = action.payload

        },
        setWholeData : (state, action ) => {
            state.wholeData = action.payload

        },
        setAvailableCars:(state,action) => {
            state.availableCars = action.payload
        }
    },
})

export const {setSelectedDistrict ,setLocationsOfDistrict, setWholeData , setAvailableCars} = selectRideSlice.actions
export default  selectRideSlice.reducer