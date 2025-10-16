import {  useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setVendorDeleteSuccess } from "../../../redux/vendor/vendorDashboardSlice";

const VendorDeleteVehicleModal = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");


  const navigate = useNavigate();
  const dispatch = useDispatch();

   //delete a vehicle
 const vendorHandleDelete = async () => {
    try{
      const res = await fetch(`/api/vendor/vendorDeleteVehicles/${vehicle_id}`, {
        method: "DELETE"
      })
      if(!res.ok){
        console.log("soemthing went wrong")
        return 
      }
      if (res.ok) {
        dispatch(setVendorDeleteSuccess(true))
        }
      }
      catch (error) {
        console.log(error);
      }
    }
   
  

  return (
    <div className="bg-opacity-[1] bg-red-500 h-[100vh]">
    

      <div
        id="popup-modal"
        tabIndex="-1"
        className=" overflow-y-auto overflow-x-hidden  fixed top-0 right-0 left-0 z-50 d-flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        
      >
        <div className="relative p-4 w-full max-w-md  max-h-full mx-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => {
                navigate('/vendorDashboard/vendorAddProduct')
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this Vehicles?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={() => {
                  navigate("/vendorDashboard/vendorAllVeihcles");
                  vendorHandleDelete(vehicle_id);
                }}
              >
                Yes, Im sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => navigate("/vendorDashboard/vendorAllVeihcles")}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDeleteVehicleModal;
