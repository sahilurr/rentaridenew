import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { setUpdateRequestTable, setVenodrVehilces, setadminVenodrRequest } from "../../../redux/vendor/vendorDashboardSlice";




const VenderVehicleRequests = () => {
  const { vendorVehicleApproved, vendorVehilces ,adminVenodrRequest } = useSelector(
    (state) => state.vendorDashboardSlice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchVendorRequest = async () => {
      try {
        const res = await fetch(`/api/admin/fetchVendorVehilceRequests`, {
          method: "GET",
        });
        if (!res.ok) {
          console.error(
            "Failed to fetch vendor vehicle requests:",
            res.statusText
          );
          return;
        }
        if (res.ok) {
          const data = await res.json();
          dispatch(setVenodrVehilces(data));
          dispatch(setadminVenodrRequest(data))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVendorRequest();
  }, [dispatch])

  //aprove vendor vehicle request
  const handleApproveRequest = async (id) => {
    try {
      dispatch(setUpdateRequestTable(id))
      const res = await fetch("/api/admin/approveVendorVehicleRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });

      if (!res.ok) {
        console.log("error");
      }
      const data = await res.json();
     console.log(data)
    } catch (error) {
      console.log(error);
    }
  };

  //reject vendor Vehilce Request
  const handleReject = async (id) => {
    try {
     
      const res = await fetch("/api/admin/rejectVendorVehicleRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });
      if (!res.ok) {
        console.log("error", res);
      }
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        params.row.status ? (
          <div className="text-yellow-500   bg-yellow-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
            <span className="text-[8px]">Pending</span>
            <MdOutlinePending />
          </div>
        ) : (
          <div className="text-green-500   bg-green-100 p-2 rounded-lg flex items-center justify-center gap-x-1">
            <span className="text-[8px]">Approved</span>
            <GrStatusGood  />
          </div>
        ),
    },
    {
      field: "Approve",
      headerName: "Approve",
      width: 100,
      renderCell: (params) => (
        <Button
          className="bg-green-500"
          onClick={() => {handleApproveRequest(params.row.id), dispatch(setUpdateRequestTable(params.row.id))}}
        >
          <GrStatusGood style={{ fontSize: 24 , color: 'green' }}/>
        </Button>
      ),
    },
    {
      field: "reject",
      headerName: "Reject",
      width: 100,
      renderCell: (params) => (
        <Button
          className="bg-red-200"
          onClick={() => {handleReject(params.row.id), dispatch(setUpdateRequestTable(params.row.id))}}
        >
          <IoIosCloseCircle style={{ fontSize: 28 , color:'red' }}/>
        </Button>
      ),
    },
  ];

  const rows =
  adminVenodrRequest && 
    adminVenodrRequest
      .filter((vehicle) => vehicle.isDeleted === "false")
      .map((vehicle) => ({
        id: vehicle._id,
        image: vehicle.image[0],
        registeration_number: vehicle.registeration_number,
        company: vehicle.company,
        name: vehicle.name,
        status: !vehicle.isAdminApproved,
      }))

      const isVendorVehiclesEmpty = vendorVehilces && vendorVehilces.length === 0;
  return (
  <div className="max-w-[1000px]  d-flex   justify-end text-start items-end p-10 bg-slate-100 rounded-md">
      {isVendorVehiclesEmpty ? (
      <p>No requests yet</p>
    ) : 
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize:
                vendorVehicleApproved && vendorVehicleApproved.length > 10
                  ? 10
                  : 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        
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
}
  </div>
  )
};

export default VenderVehicleRequests;
