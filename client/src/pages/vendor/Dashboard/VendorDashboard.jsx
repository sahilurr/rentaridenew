import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar } from "../../admin/components";

import AdminHomeMain from "../../admin/pages/AdminHomeMain";
import VendorAllVehicles from "../pages/VendorAllVehicles";
import VendorSidebar from "../Components/VendorSidebar";
import VendorBookings from "../Components/VendorBookings";

function VendorDashboard() {
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);

  return (
    <div>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-gray-200 hover:radius text-white"
              style={{ background: "blue", borderRadius: "50%" }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg">
            <VendorSidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <VendorSidebar />
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
              <Route path="/" element={<AdminHomeMain />} />
              <Route path="/adminHome" element={<AdminHomeMain />} />
              <Route path="/vendorAllVeihcles" element={<VendorAllVehicles />} />
              <Route path="/bookings" element={<VendorBookings />} />

            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
