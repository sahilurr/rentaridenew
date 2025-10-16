import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast, { Toaster } from "react-hot-toast";

import Box from "@mui/material/Box";
import {
  setVendorDeleteSuccess,
  setVendorEditSuccess,
  setVendorError,
  setVenodrVehilces,
} from "../../../redux/vendor/vendorDashboardSlice";

import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending } from "react-icons/md";
import VendorHeader from "../Components/VendorHeader";


const VendorAllVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { vendorVehilces, vendorEditSuccess,vendorDeleteSuccess, vendorErrorSuccess } = useSelector(
    (state) => state.vendorDashboardSlice
  );
  const { _id } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
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
        dispatch(setVenodrVehilces(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [_id, dispatch, isAddVehicleClicked]);


  //edit vehicles
  const handleEditVehicle = (vehicle_id) => {
    navigate(`/vendorDashboard/vendorEditProductComponent?vehicle_id=${vehicle_id}`);
  };

  //delete vehicles modal
  const handleDeleteVehicles = (vehicle_id) => {
    navigate(`/vendorDashboard/vendorDeleteVehicleModal?vehicle_id=${vehicle_id}`);
  }

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "50px",
            height: "40px",
            borderRadius: "5px",
            objectFit: "cover",
          }}
          alt="vehicle"
        />
      ),
    },
    {
      field: "registeration_number",
      headerName: "Register Number",
      width: 150,
    },
    { field: "company", headerName: "Company", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) =>
        params.row.status === "rejected" ? (
          <div className="text-red-500   bg-red-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
            <span className="text-[8px]">rejected</span>
            <MdOutlinePending />
          </div>
        ) : !params.row.status ? (
          <div className="text-yellow-500   bg-yellow-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
            <span className="text-[8px]">Pending</span>
            <MdOutlinePending />
          </div>
        ) : (
          <div className="text-green-500   bg-green-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
            <span className="text-[8px]">Approved</span>
            <GrStatusGood />
          </div>
        ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => handleEditVehicle(params.row.id)}>
          <ModeEditOutlineIcon />
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => handleDeleteVehicles(params.row.id)}>
          <DeleteForeverIcon />
        </Button>
      ),
    },
  ];

  const rows =
    vendorVehilces &&
    vendorVehilces
      .filter((vehicle) => vehicle.isDeleted === "false")
      .map((vehicle) => ({
        id: vehicle._id,
        image: vehicle.image[0],
        registeration_number: vehicle.registeration_number,
        company: vehicle.company,
        name: vehicle.name,
        status: !vehicle.isRejected ? vehicle.isAdminApproved : "rejected",
      }));

  //checking if vendor has vehicles
  const isVendorVehiclesEmpty = vendorVehilces && vendorVehilces.length === 0;

  //showing success only if the vendor request is send
  useEffect(() => {
    if (vendorEditSuccess) {
      toast.success("Request send");
      dispatch(setVendorEditSuccess(false));
    }

     //deleted success
     if(vendorDeleteSuccess){
      toast.success("Vehicle Deleted")
      dispatch(setVendorDeleteSuccess(false))
     }

    //showing error if error
    if (vendorErrorSuccess) {
      toast.error("error");
      dispatch(setVendorError(false));
    }

   
  }, [vendorEditSuccess,vendorDeleteSuccess]);

  return (
    <div className="max-w-[1000px]  d-flex   justify-end text-start items-end p-10 bg-slate-100 rounded-md">
      {vendorEditSuccess && <Toaster />}
      {vendorDeleteSuccess && <Toaster/>}

      <VendorHeader title="AllVehicles" />
      {isVendorVehiclesEmpty ? (
        <p>No requests yet</p>
      ) : (
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              ".MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "&.MuiDataGrid-root": {
                border: "none",
              },
            }}
          />
        </Box>
      )}

    </div>
  );
};

export default VendorAllVehicles;
