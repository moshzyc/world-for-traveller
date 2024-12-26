import mongoose from "mongoose"

const UserPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: [String],
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
  },
  mainImage: {
    type: String,
    required: true,
  },
})

export const UserPost = mongoose.model("user-post", UserPostSchema)
