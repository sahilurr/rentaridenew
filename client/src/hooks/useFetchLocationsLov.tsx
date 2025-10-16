import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCompanyData, setDistrictData, setLocationData, setModelData } from "../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { setWholeData } from "../redux/user/selectRideSlice";

const useFetchLocationsLov = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchLov = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/getVehicleModels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        //getting models from data
        const models = data.filter((cur) => cur.type === "car").map((cur) => cur.model);
        dispatch(setModelData(models));

        //getting comapnys from data
        const brand = data.filter((cur) => cur.type === "car").map((cur) => cur.brand);
        const uniqueBrand = brand.filter((cur, index) => {
          return brand.indexOf(cur) === index;
        });
        dispatch(setCompanyData(uniqueBrand));

        //getting locations from data
        const locations = data.filter((cur) => cur.type === "location").map((cur) => cur.location);
        dispatch(setLocationData(locations));

        //getting districts from data
        const districts = data.filter((cur) => cur.type === "location").map((cur) => cur.district);
        const uniqueDistricts = districts.filter((cur, idx) => {
          return districts.indexOf(cur) === idx;
        });
        dispatch(setDistrictData(uniqueDistricts));

        //setting whole data
        const wholeData = data.filter((cur) => cur.type === "location");
        dispatch(setWholeData(wholeData));

      } else {
        return "no data found";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchLov, isLoading };
};

export default useFetchLocationsLov;
