import { Router } from "express";
import { createOrder,updateOrderStatus,cancelOrder } from "../controllers/orderController.js";

const router = Router()

// baseUrl - http://localhost:5000/api/order


router.post("/",createOrder)

router.patch("/:orderId/status",updateOrderStatus)

router.patch("/:orderId/cancel",cancelOrder)


export default router 