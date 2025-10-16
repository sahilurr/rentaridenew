import { useDispatch, useSelector } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaIndianRupeeSign } from "react-icons/fa6";

import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayRazorpay } from "./Razorpay";
import { setPageLoading } from "../../redux/user/userSlice";
import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import {toast, Toaster} from "sonner";
// import { toast, Toaster } from "sonner";

export async function sendBookingDetailsEmail(
  toEmail,
  bookingDetails,
  dispatch
) {
  try {
    const sendEamil = await fetch("/api/user/sendBookingDetailsEamil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toEmail, data: bookingDetails }),
    });
    const response = await sendEamil.json();

    if (!response.ok) {
      dispatch(setisPaymentDone(false));
      console.log("something went wrong while sending email");
      return;
    }

    return "good";
  } catch (error) {
    console.log(error);
  }
}

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  phoneNumber: z.string().min(8, { message: "phoneNumber required" }),
  adress: z.string().min(4, { message: "adress required" }),
  // pickup_district: z.string().min(1),
});

const CheckoutPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      coupon: "",
    },
  });
  const navigate = useNavigate();

  const {
    pickup_district,
    pickup_location,
    dropoff_location,
    dropofftime,
    pickupDate,
    dropoffDate,
  } = useSelector((state) => state.bookingDataSlice);

  //latest bookings data taken from redux
  const { data, paymentDone } = useSelector(
    (state) => state.latestBookingsSlice
  );

  const currentUser = useSelector((state) => state.user.currentUser);
  const singleVehicleDetail = useSelector(
    (state) => state.userListVehicles.singleVehicleDetail
  );
  const { isPageLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { email, phoneNumber, adress } = currentUser;
  const { price } = singleVehicleDetail;

  const user_id = currentUser._id;
  const vehicle_id = singleVehicleDetail._id;

  const start = pickupDate?.humanReadable
    ? new Date(pickupDate?.humanReadable)
    : new Date();
  const end = pickupDate?.humanReadable
    ? new Date(dropoffDate?.humanReadable)
    : new Date();

  const diffMilliseconds = end - start;
  const Days = Math.round(diffMilliseconds / (1000 * 3600 * 24));

  //settting and checking coupon
  const [wrongCoupon, setWrongCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  const couponValue = watch("coupon");
  const handleCoupon = () => {
    setWrongCoupon(false);
    if (couponValue === "WELCOME50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      setWrongCoupon(true);
    }
  };

  //calculateing total price after coupon
  let totalPrice = price * Days ? Days + 50 - discount : "";
  //handle place order data
  const handlePlaceOrder = async () => {
    const orderData = {
      user_id,
      vehicle_id,
      totalPrice,
      pickupDate: pickupDate.humanReadable,
      dropoffDate: dropoffDate.humanReadable,
      pickup_district,
      pickup_location,
      dropoff_location,
    };

    try {
      dispatch(setPageLoading(true));
      const displayRazorpayResponse = await displayRazorpay(
        orderData,
        navigate,
        dispatch
      );

      if (!displayRazorpayResponse || !displayRazorpayResponse?.ok) {
        dispatch(setPageLoading(false));
        toast.error(displayRazorpayResponse?.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }finally{
      dispatch(setPageLoading(false))
    }
  };

  //after payment is done in displayRazorpay function we update the paymentDone from false to true our useEffect is triggered whenever state of paymentDone or data changes
  // 5.call our sendBookingDetails function to call my sendEmailapi with recivers email and his last bookingsData
  useEffect(() => {
    if (paymentDone && data) {
      const sendEmail = async () => {
        await sendBookingDetailsEmail(email, data, dispatch);
        dispatch(setisPaymentDone(false));
      };

      sendEmail();
    }
  }, [paymentDone, data, email, dispatch]);

  return (
    <>
      <Toaster
        toastOptions={{
          classNames: {
            error: "bg-red-500 p-5",
            success: "text-green-400 p-5",
            warning: "text-yellow-400 p-5",
            info: "bg-blue-400 p-5",
          },
        }}
      />
      <div className="grid w-full absolute top-0  sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-[120px] xl:pl-[100px] gap-10 xl:mt-20 ">
        <div className="px-4  bg-gray w-full h-full drop-shadow-md">
          <div
            className="pt-8 space-y-3 rounded-lg border border-none drop-shadow-md  px-2 py-4 sm:px-6 md:min-h-[600px]  Properties backdrop-blur-sm
             bg-white 
            flex flex-col justify-between"
          >
            <p className="text-xl font-medium">Order Summary</p>
            <p className="text-gray-400">
              Check your items. And select a suitable payment method
            </p>
            <div className="flex flex-col rounded-lg bg-white sm:flex-row">
              <img
                className="m-1 mt-2 h-44 w-[200px] rounded-md  drop-shadow-md  border border-sm  object-contain object-center"
                src={singleVehicleDetail.image[0]}
                alt=""
              />
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold capitalize">
                  <span></span> {singleVehicleDetail.model}
                </span>
                <span className="float-right text-gray-400">
                  <span>Package : </span>
                  {singleVehicleDetail.base_package}
                </span>
                <span className="float-right text-gray-400">
                  <span></span>
                  {singleVehicleDetail.fuel_type}
                </span>
                <span className="float-right text-gray-400">
                  <span></span>
                  {singleVehicleDetail.transmition}
                </span>
                <span className="float-right text-gray-400">
                  <span></span>
                  {singleVehicleDetail.registeration_number}
                </span>
                <p className="text-lg font-bold flex justify-start items-center">
                  <span>
                    <MdCurrencyRupee />
                  </span>
                  {singleVehicleDetail.price}
                  <span className="text-[8px] ml-1 mt-1"> /per day</span>
                </p>
              </div>
            </div>
            <div className=" cursor-pointer  rounded-lg drop-shadow-sm  border border-slate-50  p-4 mt-40 pt-10">
              <div className="flex justify-around">
                <div className="md:ml-5 min-h-[300px] ">
                  <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                    Pick up
                  </div>
                  <div className="mt-2 capitalize">
                    <p className="text-black text-[14px] mt-2 leading-6">
                      {pickup_district
                        ? pickup_district
                        : "Pickup District Not selected"}
                    </p>
                    <p className=" text-[14px] mt-2">
                      {pickup_location
                        ? pickup_location
                        : "Pickup Location Not Selected"}
                    </p>
                    <div className="text-[14px] flex flex-col justify-start items-start  pr-2 gap-2 mt-2">
                      <div className="flex justify-between gap-2 items-center">
                        <span>
                          <CiCalendarDate style={{ fontSize: 15 }} />
                        </span>
                        {pickupDate?.humanReadable && (
                          <>
                            {console.log()}
                            <span>
                              {" "}
                              {new Date(
                                pickupDate.humanReadable
                              ).getDate()} :{" "}
                            </span>
                            <span>
                              {" "}
                              {new Date(pickupDate.humanReadable).getMonth() +
                                1}{" "}
                              :{" "}
                            </span>
                            <span>
                              {" "}
                              {new Date(pickupDate.humanReadable).getFullYear()}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <span>
                          <IoMdTime style={{ fontSize: 16 }} />
                        </span>
                        <span>
                          {pickupDate?.humanReadable &&
                            new Date(pickupDate.humanReadable).getHours()}
                        </span>
                        :
                        <span>
                          {pickupDate?.humanReadable &&
                            new Date(pickupDate.humanReadable).getMinutes()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <div className="mt-2 font-medium underline underline-offset-4 mb-5">
                    Drop off
                  </div>

                  <div className="mt-2">
                    <p className="text-black text-[14px] leading-6 mt-2">
                      {pickup_district
                        ? pickup_district
                        : "Pickup District Not Selected"}
                    </p>
                    <p className=" text-[14px] mt-2">
                      {dropoff_location
                        ? dropoff_location
                        : "Dropoff Location not selected"}
                    </p>
                    <div className="text-[14px] flex flex-col justify-start items-start pr-2 gap-2 mt-2">
                      <div className="flex  justify-between gap-2 items-center">
                        <span>
                          <CiCalendarDate style={{ fontSize: 15 }} />
                        </span>
                        <span> {dropoffDate?.day} : </span>
                        <span>
                          {" "}
                          {dropoffDate?.humanReadable &&
                            new Date(dropoffDate.humanReadable).getMonth() +
                              1}{" "}
                          :{" "}
                        </span>
                        <span> {dropoffDate?.year} </span>
                        {errors?.pickup_district && (
                          <p className="text-red-500 text-[10px]">
                            {errors.pickup_district.message || "error"}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <span>
                          <IoMdTime style={{ fontSize: 16 }} />
                        </span>
                        <span> {dropofftime?.hour}</span>:
                        <span> {dropofftime?.minute}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" rounded-lg flex justify-center items-center gap-2 text-[8px] drop-shadow-md  border border-sm  p-4">
                <div>
                  <MdVerifiedUser
                    style={{ fontSize: 50, color: "green", fill: "green" }}
                  />
                </div>
                <div>
                  <p>Down time Charges: as per policy</p>
                  <p>
                    Policy excess charges waiver for denting and painting
                    excluding major accident repairs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* details */}
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0 drop-shadow-md ">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>

          <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="flex flex-col gap-y-8 my-4">
              {/* email */}

              <div>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  className="w-full"
                  defaultValue={email ? email : ""}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* phone */}
              <div>
                <TextField
                  id="phoneNumber"
                  label="Phone"
                  type="number"
                  variant="outlined"
                  className="w-full"
                  defaultValue={phoneNumber ? phoneNumber : ""}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-[10px]">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* adress */}
              <div>
                <TextField
                  id="adress"
                  label="Adress"
                  multiline
                  rows={4}
                  defaultValue={adress ? adress : ""}
                  {...register("adress")}
                  className="w-full"
                />
                {errors.adress && (
                  <p className="text-red-500 text-[10px]">
                    {errors.adress.message}
                  </p>
                )}
              </div>

              {/* PinCode */}
              <div>
                <div className="flex gap-6">
                  <TextField
                    rows={4}
                    id="coupon"
                    // defaultValue={Address}
                    label={"Coupon"}
                    value={couponValue}
                    {...register("coupon")}
                    className="w-full border-none"
                    placeholder="WELCOME50 Is a valid coupon"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault(), handleCoupon();
                    }}
                  >
                    <div className="bg-black text-white px-8 py-4 rounded-md">
                      Apply
                    </div>
                  </button>
                </div>
                {wrongCoupon && (
                  <p className="text-red-500 text-[8px]">Not a valid coupon</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Rent</p>
                <p className="font-semibold text-gray-900">{price}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Days</p>
                <p className="font-semibold text-gray-900">{Days}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">50.00</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Coupon</p>
                <p className="font-semibold text-gray-900">{discount}.00</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900 flex items-center justify-center">
                <span>
                  <FaIndianRupeeSign />{" "}
                </span>
                {totalPrice}
              </p>
            </div>

            {isPageLoading ? (
              <button
                className={`mt-4 mb-8 w-full rounded-md bg-gray-400 px-6 py-3 font-medium text-black`}
                disabled
              >
                Processing ...
              </button>
            ) : (
              <button
                className={`mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white`}
              >
                {"Place Order"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
