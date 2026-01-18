import mongoose, { Schema,model} from "mongoose"; 

const orderSchema = new Schema({
    pickupLocation : {
        x : Number, 
        y : Number
    },
    dropLocation : {
        x : Number,
        y : Number
    },
    deliveryType :{
        type: String,
        eum : ["Express", "Normal"],
        required : true,
    },
    status : {
        type: String,
        enum: ['CREATED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
        default : "CREATED"
    },
    courierId : {
        type : Schema.Types.ObjectId,
        ref : "Courier",
        default : null 
    },
    packageDetails : {
        type : String 
    }
},{
    timestamps : true
})

const Order = model("Order",orderSchema)

export default Order