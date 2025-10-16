import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

//Vendor vehicle request
export const fetchVendorVehilceRequests = async (req, res, next) => {
  try {
    const vendorRequests = await Vehicle.aggregate([
      {
        $match: {
          isAdminApproved: false,
          isDeleted: "false",
          isRejected: false,
          isAdminAdded: false,
        },
      },
    ]);

    if (!vendorRequests) {
      next(
        errorHandler(500, "something went wrong while fetching vendor requests")
      );
    }
    if (vendorRequests) {
      res.status(200).json(vendorRequests);
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error while fetchVendorVehicleRequests"));
  }
};

//approve Vendor reqest

export const approveVendorVehicleRequest = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "no body found bad request"));
    }

    const { _id } = req.body;

    const approvedVendor = await Vehicle.findByIdAndUpdate(
      _id,
      { isAdminApproved: true },
      {
        new: true,
      }
    );

    if (!approvedVendor) {
      next(errorHandler(500, "something went wrong while approveing vendor"));
    }

    res.status(200).json(approvedVendor);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error while approveing vendor"));
  }
};

//Regect vendor vehicle
export const rejectVendorVehicleRequest = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "bad request required id"));
    }
    const { _id } = req.body;
    const regectedVendor = await Vehicle.findByIdAndUpdate(
      _id,
      { isRejected: true },
      {
        new: true,
      }
    );

    if (!regectedVendor) {
      next(errorHandler(500, "something went wrong while regecting vendor"));
    }

    res.status(200).json(regectedVendor);
  } catch (error) {
    next(errorHandler(500, "error while Rejecting"));
  }
};
