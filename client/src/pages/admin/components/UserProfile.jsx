import { useDispatch } from "react-redux";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

const UserProfile = () => {
  const dispatch = useDispatch()
  return (
    <div className=" dark:text-gray-200  dark:bg-secondary-dark-bg  rounded-xl w-[250px]  p-5 absolute top-0 right-0   bg-no-repeat   bg-blue-50 h-44  ">
      <div>
        <div className="flex justify-between w-full items-center gap-20">
          <p className="font-bold text-gray-400">Jeevan</p>
          <button className="text-black " onClick={()=> dispatch(toggleNavbarPage('userProfile'))}>
            <div className="hover:bg-slate-200  px-3 py-1 rounded-full">x</div>
          </button>
        </div>

        <p className="text-2xl text-black">hi</p>
      </div>
    </div>
  );
};

export default UserProfile;
