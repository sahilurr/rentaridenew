import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";
import Vehicle from "../../models/vehicleModel.js";

import { uploader } from "../../utils/cloudinaryConfig.js";
import { dataUri } from "../../utils/multer.js";

//admin addVehicle
export const addProduct = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(500, "body cannot be empty"));
    }

    if (!req.files || req.files.length === 0) {
      return next(errorHandler(500, "image cannot be empty"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      fuel_type,
      description,
      seat,
      transmition_type,
      registeration_end_date,
      insurance_end_date,
      polution_end_date,
      car_type,
      location,
      district,
    } = req.body;

    const uploadedImages = [];

    //converting the buffer to base64
    const fileDataUri = dataUri(req);

    try {
      await Promise.all(
        fileDataUri.map(async (cur) => {
          try {
            const result = await uploader.upload(cur.data, {
              public_id: cur.filename,
            });
            uploadedImages.push(result.secure_url);
          } catch (error) {
            console.log(error, {
              message: "error while uploading to cloudinary",
            });
          }
        })
      );

      try {
        if (uploadedImages && uploadedImages) {
          const addVehicle = new vehicle({
            registeration_number,
            company,
            name,
            image: uploadedImages,
            model,
            car_title: title,
            car_description: description,
            base_package,
            price,
            year_made,
            fuel_type,
            seats: seat,
            transmition: transmition_type,
            insurance_end: insurance_end_date,
            registeration_end: registeration_end_date,
            pollution_end: polution_end_date,
            car_type,
            created_at: Date.now(),
            location,
            district,
          });

          await addVehicle.save();
          res.status(200).json({
            message: "product added to mb & cloudninary successfully",
          });
        } else {
          throw new Error(
            "failed upload to  cloudinary check in dashboardController addProduct"
          );
        }
      } catch (error) {
        if (error.code === 11000) {
          return next(errorHandler(409, "product already exists"));
        }

        console.log(error);
        next(errorHandler(500, "product not uploaded"));
      }
    } catch (error) {
      next(errorHandler(500, "could not upload image to cloudinary"));
    }
  } catch (error) {
    next(errorHandler(400, "vehicle failed to add "), console.log(error));
  }
};

//show all vehicles to admin
export const showVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicle.find();

    if (!vehicles) {
      return next(errorHandler(404, "no vehicles found"));
    }

    res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

//admin delete vehicle

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    if (!vehicle_id) {
      return;
    }

    const deleted = await Vehicle.findByIdAndUpdate(vehicle_id, {
      isDeleted: true,
    });
    if (!deleted) {
      return next(500, "not able to delete");
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "something went wrong"));
  }
};

//edit vehicle listed by admin

export const editVehicle = async (req, res, next) => {
  try {
    //get the id of vehicle to edit through req.params
    const vehicle_id = req.params.id;

    if (!vehicle_id) {
      return next(errorHandler(401, "cannot be empty"));
    }

    if (!req.body || !req.body.formData) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      description,
      Seats,
      transmitionType,
      Registeration_end_date,
      insurance_end_date,
      polution_end_date,
      carType,
      fuelType,
      vehicleLocation,
      vehicleDistrict,
    } = req.body.formData;

    try {
      const edited = await Vehicle.findByIdAndUpdate(
        vehicle_id,
        {
          registeration_number,
          company,
          name,
          model,
          car_title: title,
          car_description: description,
          base_package,
          price,
          year_made,
          fuel_type: fuelType,
          seats: Seats,
          transmition: transmitionType,
          insurance_end: insurance_end_date,
          registeration_end: Registeration_end_date,
          pollution_end: polution_end_date,
          car_type: carType,
          updated_at: Date.now(),
          location: vehicleLocation,
          district: vehicleDistrict,
        },

        { new: true }
      );
      if (!edited) {
        return next(errorHandler(404, "data with this id not found"));
      }

      res.status(200).json(edited);
    } catch (error) {
      if (error.code == 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        return next(
          errorHandler(
            409,
            `${duplicateField} '${duplicateValue}' already exists`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};
