import mongoose from "mongoose"
import { mongoUri } from "../secrets/env.js"
const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri)
    console.log("db is connected")
  } catch (error) {
    console.log(error)
  }
}
// localhost:27017/
connectToDb()
