import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { TbSparkles } from "react-icons/tb"; // ✨ icon for AI tool
import { links } from "../data/vendorSidebarContents.jsx";
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
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-black bg-blue-50 text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:hover:text-black hover:bg-slate-100 m-2";

  // Sign out (kept as-is; update endpoint if your app uses a different one for vendors)
  const handleSignout = async () => {
    const res = await fetch("/api/admin/signout", { method: "GET" });
    const data = await res.json();
    if (data) {
      dispatch(signOut());
      navigate("/signin");
    }
  };

  // Close sidebar on small screens when a link is clicked
  const handleCloseOnMobile = () => {
    if (screenSize <= 900 && activeMenu) dispatch(showSidebarOrNot(false));
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          {/* Top Brand / Close */}
          <div className="flex justify-between items-center">
            <Link
              to="/vendorDashboard"
              onClick={handleCloseOnMobile}
              className="items-center flex gap-3 mt-4 ml-3 text-xl font-extrabold text-blue-500 tracking-tight"
            >
              <SiShopware />
              Vendor Dashboard
            </Link>

            <TooltipComponent content="menu" position="BottomCenter">
              <button
                className="text-xl rounded-full p-3 mt-4 block md:hidden hover:bg-gray-500"
                onClick={() => dispatch(showSidebarOrNot(false))}
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          {/* Default sections from config */}
          <div className="mt-10">
            {links.map((section, idx) => (
              <div key={idx}>
                <p className="text-gray-700 m-3 mt-4 uppercase">{section.title}</p>
                {section.links.map((link) => (
                  <NavLink
                    to={`/vendorDashboard/${link.name}`}
                    key={link.name}
                    onClick={handleCloseOnMobile}
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

            {/* ---- AI Tools (custom) ---- */}
            <p className="text-gray-700 m-3 mt-6 uppercase">AI Tools</p>
            <NavLink
              to="/vendorDashboard/listingGenerator"
              onClick={handleCloseOnMobile}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <TbSparkles className="text-yellow-500" />
              <span className="capitalize text-gray-600">listingGenerator</span>
            </NavLink>

            {/* Sign out */}
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
  );
};

export default VendorSidebar;
