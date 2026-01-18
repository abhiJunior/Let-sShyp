import Order from "../models/Order.js"; 
import Courier from "../models/Courier.js"; 
import { calculateManhattanDistance } from "../utils/distance.js";
import isValidTransition from "../utils/stateMachine.js";


export const updateLocation = async (req,res)=>{
    try{
        const {id} = req.params 
        const {newX,newY} = req.body 

        const courier = await Courier.findById(id); 

        if (!courier){
            return res.status(404).send({
                status : false,
                message : "Courier not found"
            })
        }

        courier.location.x = newX
        courier.location.y = newY 

        await courier.save()

        return res.status(200).send({
            status: true,
            message : "location updated",
            location : courier.location
        })

        
    }catch(e){
        return res.status(500).send({
            status : false,
            message : "Server error",
            error : e.message
        })
    }
}