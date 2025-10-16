import Button from "@mui/material/Button";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { setVendorEditSuccess } from "../../../redux/vendor/vendorDashboardSlice";

export default function VendorEditProductComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, control, reset } = useForm();
  const { vendorVehilces } = useSelector((state) => state.vendorDashboardSlice);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");

  let updateingItem = "";
  vendorVehilces.forEach((cur) => {
    if (cur._id === vehicle_id) {
      updateingItem = cur;
    }
  });

  const insuranceDefaultDate = updateingItem.insurance_end
    ? dayjs(new Date(updateingItem.insurance_end))
    : null;
  const registerationDefaultDate = updateingItem.registeration_end
    ? dayjs(new Date(updateingItem.registeration_end))
    : null;
  const pollutionDefaultDate = updateingItem.pollution_end
    ? dayjs(new Date(updateingItem.pollution_end))
    : null;

  const onEditSubmit = async (editData) => {
    let tostID;
    try {
      if (editData && vehicle_id) {
        tostID = toast.loading("saving...", { position: "bottom-center" });
        const formData = editData;
        const res = await fetch(
          `/api/vendor/vendorEditVehicles/${vehicle_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData }),
          }
        );

        if (!res.ok) {
          toast.error("error");
          toast.dismiss(tostID);
        }

        if (res.ok) {
          toast.dismiss(tostID);
          dispatch(setVendorEditSuccess(true));
        }
      }
      reset();
    } catch (error) {
      console.log(error);
    }
    navigate("/vendorDashboard/vendorAddProduct");
  };

  const handleClose = () => {
    navigate("/vendorDashboard/vendorAddProduct");
  
  };

  return (
    <div>
      <button onClick={handleClose} className="relative left-10 top-5">
        <div className="padding-5 padding-2 rounded-full bg-slate-100 drop-shadow-md hover:shadow-lg hover:bg-blue-200 hover:translate-y-1 hover:translate-x-1 ">
          <IoMdClose style={{ fontSize: "30" }} />
        </div>
      </button>
      <form onSubmit={handleSubmit(onEditSubmit)}>
        <div className="bg-white -z-10 max-w-[1000px] mx-auto">
          <Box
            sx={{
              "& .MuiTextField-root": {
                m: 4,
                width: "25ch",
                color: "black", // Set text color to black
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Set outline color to black
                },
                "@media (max-width: 640px)": {
                  width: "30ch",
                },
              },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="registeration_number"
                label="registeration_number"
                {...register("registeration_number")}
                defaultValue={updateingItem?.registeration_number || ""}
              />

              <Controller
                control={control}
                name="company"
                defaultValue={updateingItem?.company || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="company"
                    select
                    label="Company"
                    error={Boolean(field.value == "")}
                  >
                    {companyData.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              ></Controller>

              <TextField
                required
                id="name"
                label="name"
                {...register("name")}
                defaultValue={updateingItem?.name || ""}
              />

              <Controller
                control={control}
                name="model"
                defaultValue={updateingItem?.model || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="model"
                    select
                    label="Model"
                    error={Boolean(field.value == "")}
                  >
                    {modelData.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              ></Controller>

              <TextField
                id="title"
                label="title"
                {...register("title")}
                defaultValue={updateingItem?.car_title || ""}
              />
              <TextField
                id="base_package"
                label="base_package"
                {...register("base_package")}
                defaultValue={updateingItem?.base_package || ""}
              />
              <TextField
                id="price"
                type="number"
                label="Price"
                {...register("price")}
                defaultValue={updateingItem?.price || ""}
              />

              <TextField
                required
                id="year_made"
                type="number"
                label="year_made"
                {...register("year_made")}
                defaultValue={updateingItem?.year_made || ""}
              />
              <Controller
                control={control}
                name="fuelType"
                defaultValue={updateingItem?.fuel_type || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="fuel_type"
                    select
                    label="Fuel type"
                    error={Boolean(field.value == "")}
                  >
                    <MenuItem value={"petrol"}>petrol</MenuItem>
                    <MenuItem value={"diesel"}>diesel</MenuItem>
                    <MenuItem value={"electirc"}>electric</MenuItem>
                    <MenuItem value={"hybrid"}>hybrid</MenuItem>
                  </TextField>
                )}
              ></Controller>
            </div>

            <div>
              <Controller
                name="carType"
                control={control}
                defaultValue={updateingItem?.car_type || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="car_type"
                    select
                    label="Car Type"
                    error={Boolean(field.value === "")} // Add error handling for empty value
                  >
                    <MenuItem value="sedan">Sedan</MenuItem>
                    <MenuItem value="suv">SUV</MenuItem>
                    <MenuItem value="hatchback">Hatchback</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="Seats"
                defaultValue={updateingItem?.seats || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="seats"
                    select
                    label="Seats"
                    error={Boolean(field.value === "")}
                    defaultValue={updateingItem.seats}
                  >
                    <MenuItem value={"5"}>5</MenuItem>
                    <MenuItem value={"7"}>7</MenuItem>
                    <MenuItem value={"8"}>8</MenuItem>
                  </TextField>
                )}
              ></Controller>

              <Controller
                control={control}
                name="transmitionType"
                defaultValue={updateingItem?.transmition || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="transmittion_type"
                    select
                    label="transmittion_type"
                    error={Boolean(field.value == "")}
                  >
                    <MenuItem value={"automatic"}>automatic</MenuItem>
                    <MenuItem value={"manual"}>manual</MenuItem>
                  </TextField>
                )}
              ></Controller>

              <Controller
                control={control}
                name="vehicleLocation"
                defaultValue={updateingItem?.location || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="vehicleLocation"
                    select
                    label="vehicleLocation"
                    error={Boolean(field.value == "")}
                  >
                    {locationData.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              ></Controller>

              <Controller
                control={control}
                name="vehicleDistrict"
                defaultValue={updateingItem?.district || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="vehicleDistrict"
                    select
                    label="vehicleDistrict"
                    error={Boolean(field.value == "")}
                  >
                    {districtData.map((cur, idx) => (
                      <MenuItem value={cur} key={idx}>
                        {cur}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              ></Controller>

              <TextField
                id="description"
                label="description"
                defaultValue={updateingItem?.car_description || ""}
                multiline
                rows={4}
                sx={{
                  width: "100%",
                  "@media (min-width: 1280px)": {
                    // for large screens (lg)
                    minWidth: 565,
                  },
                }}
                {...register("description")}
              />
            </div>
            <div>
              <Controller
                name="insurance_end_date"
                control={control}
                defaultValue={insuranceDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Insurance end Date"
                      inputFormat="MM/dd/yyyy" // Customize the date format as per your requirement
                      value={field.value || null} // Ensure value is null if empty string or undefined
                      onChange={(date) => field.onChange(date)}
                      textField={(props) => <TextField {...props} />}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                control={control}
                name="Registeration_end_date"
                defaultValue={registerationDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="registeration end Date"
                      inputFormat="MM/dd/yyyy" // Customize the date format as per your requirement
                      value={field.value || null} // Ensure value is null if empty string or undefined
                      onChange={(date) => field.onChange(date)}
                      textField={(props) => <TextField {...props} />}
                    />
                  </LocalizationProvider>
                )}
              ></Controller>

              <Controller
                control={control}
                name="polution_end_date"
                defaultValue={pollutionDefaultDate}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="polution end Date "
                      inputFormat="MM/dd/yyyy" // Customize the date format as per your requirement
                      value={field.value || null} // Ensure value is null if empty string or undefined
                      onChange={(date) => field.onChange(date)}
                      textField={(props) => <TextField {...props} />}
                    />
                  </LocalizationProvider>
                )}
              ></Controller>

              {/* editing for image is not done yet , default value for image is also not done yet */}

              {/* file upload section */}
              <div className="flex flex-col items-start justify-center lg:flex-row gap-10 lg:justify-between lg:items-start   ml-7 mt-10">
                <div className="max-w-[300px] sm:max-w-[600px]">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="insurance_image"
                  >
                    Upload insurance image
                  </label>
                  <input
                    className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="user_avatar_help"
                    id="insurance_image"
                    type="file"
                    multiple
                    {...register("insurance_image")}
                  />
                </div>

                <div className="max-w-[300px] sm:max-w-[600px]">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="rc_book_image"
                  >
                    Upload rc book image
                  </label>
                  <input
                    className="block w-full p-2  text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="user_avatar_help"
                    id="rc_book_image"
                    type="file"
                    multiple
                    {...register("rc_book_image")}
                  />
                </div>
                <div className="max-w-[300px] sm:max-w-[600px]">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="polution_image"
                  >
                    Upload polution image
                  </label>
                  <input
                    className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-900"
                    aria-describedby="user_avatar_help"
                    id="polution_image"
                    type="file"
                    multiple
                    {...register("polution_image")}
                  />
                </div>

                <div className="max-w-[300px] sm:max-w-[600px]">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 "
                    htmlFor="image"
                  >
                    Upload vehicle image
                  </label>
                  <input
                    className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-900"
                    aria-describedby="user_avatar_help"
                    id="image"
                    type="file"
                    multiple
                    {...register("image")}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-start items-center ml-7 mb-10">
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </Box>
        </div>
      </form>
    </div>
  );
}
