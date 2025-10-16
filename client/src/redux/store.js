import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.jsx";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
// import globalReducer from "./adminSlices/adminSlice.jsx";
import AddVehiclereducer from "./adminSlices/reducer.js";
import adminReducer from "./adminSlices/adminDashboardSlice/DashboardSlice.jsx";
import userListVehiclesReducer from "./user/listAllVehicleSlice.jsx";
import modelDataSlice from './adminSlices/adminDashboardSlice/CarModelDataSlice.jsx';
import selectRideSlice from "./user/selectRideSlice.jsx";
import statusSlice from "./adminSlices/adminDashboardSlice/StatusSlice.jsx";
import vendorDashboardSlice from "./vendor/vendorDashboardSlice.jsx";
import bookingDataSlice from './user/BookingDataSlice.jsx'
import sortfilterSlice from "./user/sortfilterSlice.jsx";
import vendorBookingSlice from "./vendor/vendorBookingSlice.jsx";
import LatestBookingsSlice from "./user/LatestBookingsSlice.jsx";



const rootReducer = combineReducers({
  user: userReducer,
  addVehicle: AddVehiclereducer,
  adminDashboardSlice: adminReducer,
  userListVehicles: userListVehiclesReducer,
  modelDataSlice : modelDataSlice,
  selectRideSlice : selectRideSlice,
  statusSlice:statusSlice,
  vendorDashboardSlice:vendorDashboardSlice,
  bookingDataSlice:bookingDataSlice,
  sortfilterSlice:sortfilterSlice,
  vendorBookingSlice:vendorBookingSlice,
  latestBookingsSlice:LatestBookingsSlice
}); 

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user","userListVehicles","bookingDataSlice","selectRideSlice","vendorBookingSlice","latestBookingsSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
