import express from "express" 
import ConnectToDB from "./config/DBconfig.js"
import cors from "cors"
import orderRouter from "./routes/orderRoutes.js"
import courierRouter from "./routes/courierRoutes.js"
const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/order",orderRouter)
app.use("/api/courier",courierRouter)

app.get("/",(req,res)=>{
    return res.status(200).send("hello world form express")
})


const PORT = 5000

app.listen(PORT,async()=>{
    ConnectToDB()
    console.log(`server is running at http://localhost:${PORT}`)
})