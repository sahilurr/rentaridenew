import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    data:[],
    paymentDone:false
}

const latestBookingSlice = createSlice({
    name:'latestBookingsSlice',
    initialState,
    reducers:{
        setLatestBooking : (state,action) => {
            state.data = action.payload
        },
        setisPaymentDone:(state,action) => {
            state.paymentDone = action.payload
        }
    }
})

export const {setLatestBooking,setisPaymentDone} = latestBookingSlice.actions
export default latestBookingSlice.reducer