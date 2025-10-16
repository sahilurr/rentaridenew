import { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import VendorBookingDetailModal from "./VendorBookingModal";
import { IoIosArrowDown } from "react-icons/io";
import { setVendorOrderModalOpen, setVendorSingleOrderDetails } from "../../../redux/vendor/vendorBookingSlice";


const VendorBookingsTable = () => {
  const [bookings, setBookings] = useState("");
  const [vendorVehicles, setVendorVehicles] = useState("");
  const [filtered, setFilteredBookings] = useState("");
  const { _id } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const optionsValue = [
    "notBooked",
    "booked",
    "onTrip",
    "notPicked",
    "canceled",
    "overDue",
    "tripCompleted",
  ];

  const fetchData = async () => {
    try {
      const res = await fetch("/api/vendor/showVendorVehilces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
        }),
      });
      if (!res.ok) {
        console.log("not success");
        return;
      }
      const data = await res.json();

      if (!data) {
        return;
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  //get all vendor Vehicles
  async function getVendorAllVehicles() {
    try {
      const data = await fetchData();
      setVendorVehicles(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  useEffect(() => {
    getVendorAllVehicles();
  }, []);

  // fetching all bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (e, bookingid) => {
    const newStatus = e.target.value;
    const bookingId = bookingid;

    const changeVehicleStatus = async () => {
      try {
        const isStatusChanged = await fetch("/api/admin/changeStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bookingId,
            status: newStatus,
          }),
        });

        if (!isStatusChanged.ok) {
          return;
        }
        fetchBookings();
      } catch (error) {
        console.log(error);
      }
    };

    changeVehicleStatus();
  };

  //all bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (vendorVehicles.length > 0 && bookings.length > 0) {
      const availableVehicleIds = vendorVehicles.map((vehicle) => vehicle._id);
      const filtered = bookings.filter((booking) =>
        availableVehicleIds.includes(booking.vehicleId)
      );
      setFilteredBookings(filtered);
    }
  }, [vendorVehicles, bookings]);

  const handleDetailsModal = (cur) => {
    
    dispatch(setVendorOrderModalOpen(true));
    dispatch(setVendorSingleOrderDetails(cur));
  };

  return (
    <>
      <div className="max-w-4xl mx-auto pb-20">
        <VendorBookingDetailModal />

        <div className="text-sm text-gray-600 mb-8">
          {filtered && filtered.length > 0 ? (
            "Check out all of your Bookings"
          ) : (
            <div className="font-extrabold text-black flex justify-center items-center min-h-[500px]">
              No Bookings Yet
            </div>
          )}
        </div>
        <div className="mb-8">
          {filtered &&
            filtered.length > 0 &&
            filtered.map((cur, idx) => {
              const pickupDate = new Date(cur.pickupDate);
              const dropoffDate = new Date(cur.dropOffDate);

              return (
                <div
                  className="box-shadow-md drop-shadow-md border border-1px rounded-lg p-4 md:px-10 md:py-5 mb-4"
                  key={idx}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 ">
                    <div className="mb-4">
                      <img
                        alt={cur.vehicleDetails.name}
                        className="w-full h-auto bg-gray-100  "
                        height="200"
                        src={cur.vehicleDetails.image[0]}
                        style={{
                          aspectRatio: "200/200",
                          objectFit: "contain",
                        }}
                        width="200"
                      />
                    </div>

                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold mb-1">{cur._id}</h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-bold">Id</span> : {cur._id}
                      </p>
                      <p className="text-lg font-semibold mb-4 flex  items-center">
                        <span>
                          <MdCurrencyRupee />
                        </span>
                        {cur.totalPrice}
                      </p>
                      <div className="flex justify-between">
                        <div className="">
                          <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                            Pick up
                          </div>
                          <div className="mt-2 capitalize">
                            <p className="text-black text-sm mt-2 leading-6 flex items-center gap-2">
                              <span>
                                <CiLocationOn />
                              </span>
                              {cur.pickUpLocation}
                            </p>

                            <div className="text-[14px] flex flex-col justify-start items-start  pr-2 gap-2 mt-2">
                              <div className="flex justify-between gap-2 items-center">
                                <span>
                                  <CiCalendarDate style={{ fontSize: 15 }} />
                                </span>
                                {
                                  <>
                                    <span> {pickupDate.getDate()}: </span>
                                    <span>{pickupDate.getMonth()} : </span>
                                    <span>{pickupDate.getFullYear()} </span>
                                  </>
                                }
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <span>
                                  <IoMdTime style={{ fontSize: 16 }} />
                                </span>
                                <span></span>
                                {pickupDate.getHours()}:
                                <span>{pickupDate.getMinutes()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                            Drop off
                          </div>

                          <div className="mt-2">
                            <p className="text-black text-sm leading-6 mt-2 capitalize flex items-center gap-2">
                              <span>
                                <CiLocationOn />
                              </span>
                              {cur.dropOffLocation}
                            </p>

                            <div className="text-[14px] flex flex-col justify-start items-start pr-2 gap-2 mt-2">
                              <div className="flex  justify-between gap-2 items-center">
                                <span>
                                  <CiCalendarDate style={{ fontSize: 15 }} />
                                </span>
                                <span>{dropoffDate.getDate()} : </span>
                                <span>{dropoffDate.getMonth()} : </span>
                                <span>{dropoffDate.getFullYear()} </span>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <span>
                                  <IoMdTime style={{ fontSize: 16 }} />
                                </span>
                                <span>{dropoffDate.getHours()} </span>:
                                <span>{dropoffDate.getMinutes()} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-4 items-start  lg:flex-row lg:items-center lg:justify-between mt-10">
                        <div className="flex flex-row gap-3 items-start  md:items-center justify-between">
                          <button
                            className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 px-6 py-3 text-[12px] md:px-10 md:py-2 md:text-[14px] font-medium capitalize  rounded-lg "
                            onClick={() => handleDetailsModal(cur)}
                          >
                            Details
                          </button>
                          <div className="flex items-center justify-end ">
                            <div className="bg-green-500 px-5 py-3 text-[12px] md:px-10 md:py-2 md:text-[14px] font-medium capitalize rounded-lg">
                              {cur.status}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <select
                            className="px-4 py-2 appearance-none capitalize drop-shadow-md border  rounded-md text-[12px] md:text-[14px]"
                            value={optionsValue.selectedValue}
                            onChange={(e) => {
                              handleStatusChange(e,cur._id);
                            }}
                          >
                            {optionsValue.map((cur, idx) => (
                              <option key={idx} value={cur}>
                                {cur}
                              </option>
                            ))}
                          </select>
                          <div className="absolute top-[10px] right-1 z-888">
                            <IoIosArrowDown />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default VendorBookingsTable;
