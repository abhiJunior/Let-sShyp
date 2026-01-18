import Order from "../models/Order.js";
import Courier from "../models/Courier.js";
import { calculateManhattanDistance } from "../utils/distance.js"; 

import isValidTransition from "../utils/stateMachine.js";

const DISTANCE_THRESHOLD = 10 

export const createOrder = async (req,res)=>{

    try{
        console.log("hitting createOrder Api")
        console.log("req body",req.body)
        const {pickupLocation,dropLocation,deliveryType,packageDetails} = req.body 

        const newOrder = await Order.create({
            pickupLocation,dropLocation,deliveryType,packageDetails
        })

        let availableCouriers = await Courier.find({isAvailable : true})

        let bestCourier = null
        let minDistance = Infinity

        availableCouriers.forEach((courier)=>{
            const dist = calculateManhattanDistance(courier.location,pickupLocation);

            if (deliveryType === "Express" && dist > DISTANCE_THRESHOLD) return; 

            if (dist < minDistance){
                minDistance = dist 
                bestCourier = courier
            }
        })

        if (!bestCourier){
            return res.status(201).json({
                order : newOrder,
                message : "Order created but no able to find eligible courier within range" 
            })
        }

        const assignedCourier = await Courier.findOneAndUpdate(
            {_id : bestCourier._id, isAvailable : true},
            {isAvailable : false , activeOrderId : newOrder._id},
            {new : true}
        )

        if (!assignedCourier){
            return res.status(201).json({
                order : newOrder,
                message : "Assignment conflict, retrying..."
            })
        }

        newOrder.status = "ASSIGNED",
        newOrder.courierId = assignedCourier._id,
        await newOrder.save()

        res.status(201).json(newOrder)
        }catch(e){
            res.status(500).send({
                status: false,
                message : e.message
            })
        }

}

export const updateOrderStatus = async (req,res)=>{
    try{
        const {orderId} = req.params; 
        const {nextStatus} = req.body 

        const order = await Order.findById(orderId).populate("courierId") 
        if (!order){
            return res.status(404).send({
                status : false,
                message : "Order Not found"
            })
        }

        if (!isValidTransition(order.status,nextStatus)){
            return res.status(400).send({
                status : false,
                error : `Invalid transition from ${order.status} to ${nextStatus}`
            })
        }

        if (nextStatus === "PICKED_UP"){
            const distanceToPickup = calculateManhattanDistance(order.courierId.location,order.pickupLocation)

            if (distanceToPickup > 0){
                return res.status(400).send({
                    status : false,
                    message : "Courier has not reached pickup location yet"
                })
            }

        
        }

        if (nextStatus === 'DELIVERED'){
            console.log("current status delivered")
            const distanceToDrop = calculateManhattanDistance(order.courierId.location,order.dropLocation)
            console.log("dist",distanceToDrop)
            if (distanceToDrop > 0){
                return res.status(400).send({
                    status : false,
                    message : "Courier has not reached drop location yet"
                })
            }

            await Courier.findByIdAndUpdate(order.courierId._id,{
                isAvailable : true,
                activeOrderId : null
            })

        
        }

        order.status = nextStatus 
        await order.save()

        return res.status(200).json(order)
    }catch(e){
        console.log(e.message)
        return res.status(500).send(e.message)
    }
}



export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        //Cannot cancel if already DELIVERED or already CANCELLED
        if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
            return res.status(400).json({ 
                status: false, 
                message: `Cannot cancel order in ${order.status} state.` 
            });
        }

        //If a courier was assigned, release them back to the pool
        if (order.courierId) {
            await Courier.findByIdAndUpdate(order.courierId, {
                isAvailable: true,
                activeOrderId: null
            });
        }

        //Update order status to CANCELLED
        order.status = 'CANCELLED';
        await order.save();

        return res.status(200).json({
            status: true,
            message: "Order cancelled successfully and courier released.",
            order
        });

    } catch (e) {
        return res.status(500).json({ status: false, message: e.message });
    }
};