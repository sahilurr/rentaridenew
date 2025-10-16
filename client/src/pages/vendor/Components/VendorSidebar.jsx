import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { links } from '../data/vendorSidebarContents.jsx'
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";

const VendorSidebar = () => {
    const { activeMenu, screenSize } = useSelector(
        (state) => state.adminDashboardSlice
      );


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-black bg-blue-50 text-md  m-2";
    //in normal mode there was dark:text-gray-200 i removed it
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-md text-gray-700   dark:hover:text-black hover:bg-slate-100 m-2";

  //SignOut
  const handleSignout = async () => {
    const res = await fetch("/api/admin/signout", {
      method: "GET",
    });
    const data = await res.json();
    if (data) {
      dispatch(signOut());
      navigate("/signin");
    }
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
    {activeMenu && (
      <>
        <div className="flex justify-between items-center">
          <Link
            to={`/vendorDashboard`}
            onClick={() => {}}
            className="items-center flex gap-3 mt-4 ml-3 text-xl font-extrabold text-blue-500 tracking-tight "
          >
            <SiShopware />
           Vendor Dashboard
          </Link>
          <TooltipComponent content={"menu"} position="BottomCenter">
            <button
              className="text-xl rounded-full p-3 mt-4 block md:hidden hover:bg-gray-500"
              onClick={() => {}}
            >
              <MdOutlineCancel />
            </button>
          </TooltipComponent>
        </div>

        <div className="mt-10">
          {links.map((cur, idx) => (
            <div key={idx}>
              <p className="text-gray-700 m-3 mt-4 text-uppercase">{cur.title}</p>
              {cur.links.map((link) => (
                <NavLink
                  to={`/vendorDashboard/${link.name}`}
                  key={link.name}
                  onClick={() => {
                    if (screenSize <= 900 && activeMenu) {
                      dispatch(showSidebarOrNot(false));
                    }
                  }}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  {link.icon}
                  <span className="capitalize text-gray-600">{link.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
          <div className="flex items-center mt-10 gap-2">
            <button
              type="button"
              className="ml-4 text-red-400"
              onClick={handleSignout}
            >
              SignOut
            </button>
            <CiLogout />
          </div>
        </div>
      </>
    )}
  </div>
  )
}

export default VendorSidebar