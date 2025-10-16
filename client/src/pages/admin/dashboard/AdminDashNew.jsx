import { Routes, Route } from "react-router-dom";
import { Navbar, SideBar } from "../components/index.jsx";
import {
  AllVehicles,
  AllUsers,
  AllVendors,
  Calender,
  ColorPicker,
  Customers,
  Editor,
  VenderVehicleRequests,
} from "../pages";
import { useSelector } from "react-redux";
import AdminHomeMain from "../pages/AdminHomeMain.jsx";
import Bookings from "../components/Bookings.jsx";

function AdminDashNew() {
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);

  return (
    <div>
      <div className="flex relative dark:bg-main-dark-bg">
      
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg">
            <SideBar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <SideBar />
          </div>
        )}

        <div
          className={`dark:bg-white bg-white min-h-screen w-full ${
            activeMenu ? "ml-72 md:ml-72" : "flex-2"
          } `}
        >
          <div className={`fixed md:static bg-white  w-full   `}>
            <Navbar />
          </div>

          <div className="main_section mx-8  ">
            <Routes>
              <Route path="/" element={<AdminHomeMain/>}/>
              <Route path="/adminHome" element={<AdminHomeMain />} />
              <Route path="/allProduct" element={<AllVehicles />} />
              <Route path="/allUsers" element={<AllUsers />} />
              <Route path="/allVendors" element={<AllVendors />} />
              <Route path="/calender" element={<Calender />} />
              <Route path="/colorPicker" element={<ColorPicker />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/vendorVehicleRequests" element={<VenderVehicleRequests />} />
              <Route path="/orders" element={<Bookings />} />

            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashNew;
