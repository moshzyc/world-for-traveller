import mongoose from "mongoose"
const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/travelsStore")
    console.log("db is connected")
  } catch (error) {
    console.log(error)
  }
}
// localhost:27017/
connectToDb()
