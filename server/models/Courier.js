import {Schema,model} from "mongoose"

const courierSchema = new Schema({
    name : {
        type : String,
        required : true
    },

    location :{
        x : {
            type : Number,
            required : true
        },
        y: {
            type : Number,
            required : true
        }
    },

    isAvailable : {
        type : Boolean,
        default : true 
    },

    activeOrderId : {
        type : Schema.Types.ObjectId,
        ref : "Order",
        default : null 
    }
})

const Courier = model("Courier",courierSchema)

export default Courier