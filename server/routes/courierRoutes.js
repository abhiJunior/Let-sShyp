import Router from "express" 
import { updateLocation } from "../controllers/courierController.js"
const router = Router() 

// base url - http://localhost:5000/api/courier

router.put("/:id/location",updateLocation)

export default router 