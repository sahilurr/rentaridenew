import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";
import {
  setIsOrderModalOpen,
  setSingleOrderDetails,
} from "../../redux/user/userSlice";



export default function Orders() {
  const { _id } = useSelector((state) => state.user.currentUser);
  const [bookings, setBookings] = useState("");
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/findBookingsOfUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: _id,
        }),
      });

      const data = await res.json();
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDetailsModal = (bookingDetails, vehicleDetails) => {
    dispatch(setIsOrderModalOpen(true));
    dispatch(setSingleOrderDetails(bookingDetails, vehicleDetails));
  };

  return (
    <div className="max-w-4xl mx-auto py-20">
      <UserOrderDetailsModal />
      <h1 className="text-4xl font-semibold mb-2">Your Bookings</h1>
      <div className="text-sm text-gray-600 mb-8">
        {bookings && bookings.length > 0 ? "Check out all of your Bookings" :  <div className="font-extrabold text-black flex justify-center items-center min-h-[500px]">No Bookings Yet</div>}
      </div>
      <div className="mb-8">
        {bookings && bookings.length > 0
          && bookings.map((cur, idx) => {
              const pickupDate = new Date(cur.bookingDetails.pickupDate);
              const dropoffDate = new Date(cur.bookingDetails.dropOffDate);

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
                        <span className="font-bold">Id</span> :{" "}
                        {cur.bookingDetails._id}
                      </p>
                      <p className="text-lg font-semibold mb-4 flex  items-center">
                        <span>
                          <MdCurrencyRupee />
                        </span>
                        {cur.bookingDetails.totalPrice}
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
                              {cur.bookingDetails.pickUpLocation}
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
                              {cur.bookingDetails.dropOffLocation}
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
                      <div className="flex mt-4">
                        <button
                          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                          onClick={() => handleDetailsModal(cur)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          }
      </div>
    </div>
  );
}
