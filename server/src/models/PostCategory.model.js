import mongoose from "mongoose"

const postCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
})

export const PostCategory = mongoose.model("post-categories", postCategorySchema)
