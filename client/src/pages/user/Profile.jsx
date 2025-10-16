import { useSelector, useDispatch } from "react-redux";

import UserProfileSidebar from "../../components/UserProfileSidebar";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, Route, Routes } from "react-router-dom";
import Orders from "./Orders";
import UserProfileContent from "../../components/UserProfileContent";
import Favorites from "./Favorites";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { showSidebarOrNot } from "../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { IoMenu } from "react-icons/io5";

function Profile() {
  const { isError } = useSelector((state) => state.user);
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="text-red-500">{isError ? isError.message : " "}</div>
      <div className="fixed top-4 right-5 md:right-10 z-10">
        <TooltipComponent content={"back"} position="BottomCenter">
          <Link to={"/"}>
            <IoArrowBackCircleSharp
              style={{ fontSize: "40", hover: "fill-red-700" }}
              className="hover:fill-blue-500"
            />
          </Link>
        </TooltipComponent>
      </div>

      <div>
        <div className="flex  relative dark:bg-main-dark-bg">
         

          {activeMenu ? (
            <div className="w-72 bg-white  fixed sidebar dark:bg-secondary-dark-bg">
              <UserProfileSidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <UserProfileSidebar />
            </div>
          )}

          {/* hamburger icon */}
          {!activeMenu && (
            <TooltipComponent
              content={"menu"}
              className="absolute md:relative"
              position="BottomCenter"
            >
              <button
                className="text-xl rounded-full p-3 mt-4 block  hover:bg-gray-500"
                onClick={() => {
                  dispatch(showSidebarOrNot(true));
                }}
              >
                <IoMenu />
              </button>
            </TooltipComponent>
          )}

          <div
            className={`bg-white  min-h-screen w-full  mt-[10px] max-w-[800px] mx-auto ${
              activeMenu ? "sm:ml-72 " : " max-w-[900px]"
            } `}
          >
            <div className={`fixed md:static bg-white  w-full   `}></div>

            <div className="main_section mx-8 lg:min-w-[900px] ">
              <Routes>
                <Route path="/" element={<UserProfileContent />} />
                <Route path="/profiles" element={<UserProfileContent />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
