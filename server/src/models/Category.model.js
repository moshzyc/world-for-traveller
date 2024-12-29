import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  subCategory: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.every((v) => typeof v === "string" && v.length > 0)
      },
      message: "Each subCategory must be a non-empty string.",
    },
  },
})

export const Category = mongoose.model("categories", categorySchema)
