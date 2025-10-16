import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    chat: false,
    userProfile: false,
    notification: false,
    activeMenu:true,
    isClicked:false,
    screenSize: window.innerWidth,
};



export const adminDashboardSlice = createSlice({
    name: "adminDashboardSlice",
    initialState,
    reducers: {
        toggleSidebar:(state)=> {
            state.activeMenu = !state.activeMenu
        },
        openPages:(state,action)=> {
            Object.keys(state).forEach(key => {
                if(key !== "activeMenu" && key!=="screenSize" && key!== action.payload){
                    state[key] = false
                }
            })
            state[action.payload] = true
        },
        setScreenSize:(state,action)=> {
            state.screenSize = action.payload
        },
        showSidebarOrNot:(state,action)=> {
            state.activeMenu = action.payload
        },
        toggleNavbarPage:(state,action)=> {
            Object.entries(state).forEach(([key])=> {
               
                if(key === action.payload){
                    state[key] = false
                    
                }
            })
        }
    
    }
});

export const {toggleSidebar,openPages,setScreenSize ,showSidebarOrNot,toggleNavbarPage} = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
