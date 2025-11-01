import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import {
  setModelData,
  setCompanyData,
  setLocationData,
  setDistrictData,
} from "../../../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { MenuItem } from "@mui/material";
import { setWholeData } from "../../../redux/user/selectRideSlice";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdClose } from "react-icons/io";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  setLoading,
  setadminAddVehicleSuccess,
  setadminCrudError,
} from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";

/* ------------------- data bootstrap ------------------- */
export const fetchModelData = async (dispatch) => {
  try {
    const res = await fetch("/api/admin/getVehicleModels", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();

      const models = data.filter((c) => c.type === "car").map((c) => c.model);
      dispatch(setModelData(models));

      const brand = data.filter((c) => c.type === "car").map((c) => c.brand);
      const uniqueBrand = brand.filter((cur, i) => brand.indexOf(cur) === i);
      dispatch(setCompanyData(uniqueBrand));

      const locations = data
        .filter((c) => c.type === "location")
        .map((c) => c.location);
      dispatch(setLocationData(locations));

      const districts = data
        .filter((c) => c.type === "location")
        .map((c) => c.district);
      const uniqueDistricts = districts.filter(
        (cur, i) => districts.indexOf(cur) === i
      );
      dispatch(setDistrictData(uniqueDistricts));

      dispatch(setWholeData(data.filter((c) => c.type === "location")));
    } else {
      return "no data found";
    }
  } catch (error) {
    console.log(error);
  }
};

/* ------------------- component ------------------- */
const AddProductModal = () => {
  // DEFAULT VALUES to keep all selects controlled from first render
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      company: "",
      model: "",
      fuelType: "",
      carType: "",
      Seats: "",
      transmitionType: "",
      vehicleLocation: "",
      vehicleDistrict: "",
      insurance_end_date: null,
      Registeration_end_date: null,
      polution_end_date: null,
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddVehicleClicked } = useSelector((s) => s.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (s) => s.modelDataSlice
  );
  const { loading } = useSelector((s) => s.statusSlice);

  useEffect(() => {
    fetchModelData(dispatch);
    dispatch(addVehicleClicked(true));
  }, [dispatch]);

  // helper: safe ISO from dayjs | null
  const toIso = (d) => (d && d.$d ? new Date(d.$d).toISOString() : "");

  const onSubmit = async (addData) => {
    try {
      if (!addData.image || addData.image.length === 0) {
        toast.error("Please attach at least one vehicle image");
        return;
      }

      const formData = new FormData();
      formData.append("registeration_number", addData.registeration_number);
      formData.append("company", addData.company);

      // images (backend expects 'image')
      Array.from(addData.image).forEach((file) => formData.append("image", file));

      formData.append("name", addData.name);
      formData.append("model", addData.model);
      formData.append("title", addData.title ?? "");
      formData.append("base_package", addData.base_package ?? "");
      formData.append("price", addData.price ?? "");
      formData.append("description", addData.description ?? "");
      formData.append("year_made", addData.year_made);
      formData.append("fuel_type", addData.fuelType);
      formData.append("seat", addData.Seats);
      formData.append("transmition_type", addData.transmitionType);

      // 🛠️ fixed: don’t use .$d; send ISO strings
      formData.append("insurance_end_date", toIso(addData.insurance_end_date));
      formData.append(
        "registeration_end_date",
        toIso(addData.Registeration_end_date)
      );
      formData.append("polution_end_date", toIso(addData.polution_end_date));

      formData.append("car_type", addData.carType);
      formData.append("location", addData.vehicleLocation);
      formData.append("district", addData.vehicleDistrict);

      let tostID = toast.loading("Saving…", { position: "bottom-center" });
      dispatch(setLoading(true));

      const res = await fetch("/api/admin/addProduct", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Error while saving");
        toast.dismiss(tostID);
        dispatch(setLoading(false));
        return;
      }

      // success
      dispatch(setadminAddVehicleSuccess(true));
      toast.dismiss(tostID);
      dispatch(setLoading(false));
      dispatch(addVehicleClicked(false));
      reset();
      navigate("/adminDashboard/allProduct");
    } catch (error) {
      dispatch(setadminCrudError(true));
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  const handleClose = () => {
    dispatch(addVehicleClicked(false));
    navigate("/adminDashboard/allProduct");
  };

  return (
    <>
      <Toaster />
      {isAddVehicleClicked && (
        <div>
          <button onClick={handleClose} className="relative left-10 top-5">
            <div className="padding-5 padding-2 rounded-full bg-slate-100 drop-shadow-md hover:shadow-lg hover:bg-blue-200 hover:translate-y-1 hover:translate-x-1 ">
              <IoMdClose style={{ fontSize: "30" }} />
            </div>
          </button>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white -z-10 max-w-[1000px] mx-auto">
              <Box
                sx={{
                  "& .MuiTextField-root": {
                    m: 4,
                    width: "25ch",
                    color: "black",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
                    "@media (max-width: 640px)": { width: "30ch" },
                  },
                }}
                noValidate
                autoComplete="off"
              >
                {/* --------- Row 1 --------- */}
                <div>
                  <TextField
                    required
                    id="registeration_number"
                    label="registeration_number"
                    {...register("registeration_number")}
                  />

                  {/* company */}
                  <Controller
                    control={control}
                    name="company"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="company"
                        select
                        label="Company"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select company</em>
                        </MenuItem>
                        {companyData.map((cur, idx) => (
                          <MenuItem value={cur} key={idx}>
                            {cur}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <TextField required id="name" label="name" {...register("name")} />

                  {/* model */}
                  <Controller
                    control={control}
                    name="model"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="model"
                        select
                        label="Model"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select model</em>
                        </MenuItem>
                        {modelData.map((cur, idx) => (
                          <MenuItem value={cur} key={idx}>
                            {cur}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <TextField id="title" label="title" {...register("title")} />
                  <TextField id="base_package" label="base_package" {...register("base_package")} />
                  <TextField id="price" type="number" label="Price" {...register("price")} />

                  <TextField
                    required
                    id="year_made"
                    type="number"
                    label="year_made"
                    {...register("year_made")}
                  />

                  {/* fuel */}
                  <Controller
                    control={control}
                    name="fuelType"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="fuel_type"
                        select
                        label="Fuel type"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select fuel</em>
                        </MenuItem>
                        <MenuItem value="petrol">petrol</MenuItem>
                        <MenuItem value="diesel">diesel</MenuItem>
                        <MenuItem value="electirc">electirc</MenuItem>
                        <MenuItem value="hybrid">hybrid</MenuItem>
                      </TextField>
                    )}
                  />
                </div>

                {/* --------- Row 2 --------- */}
                <div>
                  {/* carType */}
                  <Controller
                    name="carType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="car_type"
                        select
                        label="Car Type"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select type</em>
                        </MenuItem>
                        <MenuItem value="sedan">Sedan</MenuItem>
                        <MenuItem value="suv">SUV</MenuItem>
                        <MenuItem value="hatchback">Hatchback</MenuItem>
                      </TextField>
                    )}
                  />

                  {/* seats */}
                  <Controller
                    control={control}
                    name="Seats"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="seats"
                        select
                        label="Seats"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select seats</em>
                        </MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                      </TextField>
                    )}
                  />

                  {/* transmission */}
                  <Controller
                    control={control}
                    name="transmitionType"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="transmittion_type"
                        select
                        label="Transmission"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select transmission</em>
                        </MenuItem>
                        <MenuItem value="automatic">automatic</MenuItem>
                        <MenuItem value="manual">manual</MenuItem>
                      </TextField>
                    )}
                  />

                  {/* location */}
                  <Controller
                    control={control}
                    name="vehicleLocation"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="vehicleLocation"
                        select
                        label="Vehicle Location"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select location</em>
                        </MenuItem>
                        {locationData.map((cur, idx) => (
                          <MenuItem value={cur} key={idx}>
                            {cur}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  {/* district */}
                  <Controller
                    control={control}
                    name="vehicleDistrict"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        required
                        id="vehicleDistrict"
                        select
                        label="Vehicle District"
                        error={field.value === ""}
                      >
                        <MenuItem value="">
                          <em>Select district</em>
                        </MenuItem>
                        {districtData.map((cur, idx) => (
                          <MenuItem value={cur} key={idx}>
                            {cur}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <TextField
                    id="description"
                    label="description"
                    multiline
                    rows={4}
                    sx={{
                      width: "100%",
                      "@media (min-width: 1280px)": { minWidth: 565 },
                    }}
                    {...register("description")}
                  />
                </div>

                {/* --------- Dates & Images --------- */}
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="insurance_end_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Insurance end Date"
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="Registeration_end_date"
                      render={({ field }) => (
                        <DatePicker
                          label="Registration end Date"
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="polution_end_date"
                      render={({ field }) => (
                        <DatePicker
                          label="Pollution end Date"
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  {/* file upload */}
                  <div className="flex flex-col items-start justify-center lg:flex-row gap-10 lg:justify-between lg:items-start ml-7 mt-10">
                    <div className="max-w-[300px] sm:max-w-[600px]">
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="insurance_image">
                        Upload insurance image
                      </label>
                      <input
                        className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
                        id="insurance_image"
                        type="file"
                        multiple
                        {...register("insurance_image")}
                      />
                    </div>

                    <div className="max-w-[300px] sm:max-w-[600px]">
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="rc_book_image">
                        Upload rc book image
                      </label>
                      <input
                        className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
                        id="rc_book_image"
                        type="file"
                        multiple
                        {...register("rc_book_image")}
                      />
                    </div>

                    <div className="max-w-[300px] sm:max-w-[600px]">
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="polution_image">
                        Upload pollution image
                      </label>
                      <input
                        className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-900"
                        id="polution_image"
                        type="file"
                        multiple
                        {...register("polution_image")}
                      />
                    </div>

                    <div className="max-w-[300px] sm:max-w-[600px]">
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image">
                        Upload vehicle image
                      </label>
                      <input
                        className="block w-full p-2 text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-900"
                        id="image"
                        type="file"
                        multiple
                        required
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
      )}
    </>
  );
};

export default AddProductModal;
