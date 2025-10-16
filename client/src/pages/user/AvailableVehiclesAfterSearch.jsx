import { useDispatch, useSelector } from "react-redux";
import { FaCarSide } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

import CarNotFound from "./CarNotFound";
import { useNavigate } from "react-router-dom";

import { setVariants } from "../../redux/user/listAllVehicleSlice";
import { setFilteredData } from "../../redux/user/sortfilterSlice";

const AvailableVehiclesAfterSearch = () => {
  const { availableCars } = useSelector((state) => state.selectRideSlice);
  const { pickup_district, pickup_location, pickupDate, dropoffDate } =
    useSelector((state) => state.bookingDataSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showVarients = async (model) => {
    try {
      const datas = {
        pickUpDistrict: pickup_district,
        pickUpLocation: pickup_location,
        pickupDate: pickupDate.humanReadable,
        dropOffDate: dropoffDate.humanReadable,
        model,
      };
      const res = await fetch("/api/user/getVehiclesWithoutBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datas),
      });
      if (!res.ok) {
        console.log("not success");
      }
      if (res.ok) {
        const data = await res.json();
        dispatch(setVariants(data));
        dispatch(setFilteredData(data));
        navigate("/allVariants");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {availableCars && availableCars.length > 0 && (
        <div className="text-center flex flex-col  mt-10 justify-center items-center sm:max-w-[500px] mx-auto">
          <h2 className="text-[18px] lg:text-[24px]">Choose From Options</h2>
          <p className="text-center text-[8px] px-6  lg:text-[12px]  lg:w-[550px]">
            Choose from our modern variety vehicles colllection . Feel like home
            just like your own car Our clients have experienced our service and
            results, and they are eager to share their positive experiences with
            you.
          </p>
        </div>
      )}

      <div className=" mx-auto flex sm:flex-row  w-full  lg:grid lg:max-w-[1000px]  lg:grid-cols-3 justify-center items-center gap-5 flex-wrap mt-10 drop-shadow-md">
        {availableCars &&
          availableCars.map(
            (cur, idx) =>
              cur.isDeleted === "false" && (
                <div
                  className="bg-white box-shadow rounded-lg  drop-shadow "
                  key={idx}
                >
                  <div className="mx-auto max-w-[320px] px-4 py-2 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden object-contain rounded-md bg-white lg:aspect-none group-hover:opacity-75 lg:h-80 mb-3">
                      <img
                        src={`${cur.image[0]}`}
                        alt={`cur.name`}
                        className=" w-full object-contain object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-[14px] capitalize font-semibold tracking-tight text-gray-900">
                        <span></span>
                        {cur.name}
                      </h2>

                      <div className="text-[14px]  flex flex-col items-end">
                        <p className="font-semibold">{cur.price}</p>
                        <div className="text-[6px] relative bottom-[3px]">
                          Per Day
                        </div>
                      </div>
                    </div>

                    <div className="my-2 font-mono">
                      <div className="flex justify-between items-center mb-5 mt-5">
                        <h3 className="text-[12px] flex justify-between items-center gap-1 ">
                          <span>
                            <FaCarSide />
                          </span>
                          {cur.company}
                        </h3>
                        <p className=" text-end text-[12px] flex justify-between items-center gap-1">
                          <span>
                            <MdAirlineSeatReclineNormal />
                          </span>
                          {cur.seats}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[12px] mb-5 ">
                        <p className="flex items-center justify-center gap-1">
                          <FaCarSide />
                          {cur.car_type}
                        </p>
                        <p className="flex justify-between items-center gap-1">
                          <>
                            <button
                              className="bg-green-500 rounded-sm text-black px-6 py-2"
                              onClick={() => {
                                showVarients(cur.model);
                              }}
                            >
                              Select
                            </button>
                          </>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
      {!availableCars || (availableCars.length == 0 && <CarNotFound />)}
    </div>
  );
};

export default AvailableVehiclesAfterSearch;
