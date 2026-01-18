import mongoose from "mongoose";
import Courier from "../models/Courier.js";
import Order from "../models/Order.js";
import { configDotenv } from "dotenv";

configDotenv()

mongoose.connect(`mongodb+srv://userdb:${process.env.DATABASE_PASSWORD}@cluster0.hkbuoog.mongodb.net/letshypappName=Cluster0`)
    .then(()=> console.log("Connected to DB for Seeding"))
    .catch(err => console.log(err))


const seedCouriers = [
  { name: "Kishan", location: { x: 0, y: 0 }, isAvailable: true },
  { name: "Ravi", location: { x: 5, y: 5 }, isAvailable: true },
  { name: "Alok", location: { x: 10, y: 10 }, isAvailable: true },
  { name: "Shyam", location: { x: 20, y: 20 }, isAvailable: true }
];

const seedDB = async () => {
  await Courier.deleteMany({});
  await Courier.insertMany(seedCouriers);
  console.log("Database Seeded!");
};

seedDB().then(() => mongoose.connection.close());