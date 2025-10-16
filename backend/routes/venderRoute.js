
import {  vendorGoogle, vendorSignin, vendorSignout, vendorSignup } from "../controllers/vendorControllers/vendorController.js"
import express from "express"
import { multerMultipleUploads } from "../utils/multer.js"
import { showVendorVehicles, vendorAddVehicle, vendorDeleteVehicles, vendorEditVehicles } from "../controllers/vendorControllers/vendorCrudController.js"
import { vendorBookings } from "../controllers/vendorControllers/vendorBookingsController.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post('/vendorsignup',vendorSignup)
router.post('/vendorsignin',vendorSignin)
router.get('/vendorsignout',verifyToken,vendorSignout)
router.post('/vendorgoogle',vendorGoogle)
router.post('/vendorAddVehicle',verifyToken,multerMultipleUploads,vendorAddVehicle)
router.post('/showVendorVehilces',verifyToken,showVendorVehicles)
router.put('/vendorEditVehicles/:id',verifyToken,vendorEditVehicles)
router.delete('/vendorDeleteVehicles/:id',verifyToken,vendorDeleteVehicles)
router.post('/vendorBookings',verifyToken,vendorBookings)



export default router