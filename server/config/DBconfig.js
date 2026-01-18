import mongoose from "mongoose" 
import dotenv from "dotenv"

dotenv.config()

const ConnectToDB = async ()=>{
    try{
        const {connection} = await mongoose.connect(
        `mongodb+srv://userdb:${process.env.DATABASE_PASSWORD}@cluster0.hkbuoog.mongodb.net/letshypappName=Cluster0`
        )
        if (connection){
            console.log(`connected to DB Sucessfully at ${connection.host}`)
        }
    }catch(e){
        console.log("Failed to connect to DB",e.message)
    }

}

export default ConnectToDB