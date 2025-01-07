import mongoose from "mongoose"
import AppError from "../utils/appError.js"

const GuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  mainImage: {
    type: String,
  },
})
export const Guide = mongoose.model("guide", GuideSchema)
