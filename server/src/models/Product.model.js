import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    enum: ["hot", "cold", "neutral", "none"],
    default: "none",
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },

  rating: {
    type: {
      rate: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
      userRatings: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    default: { rate: 0, count: 0, userRatings: [] },
  },
})

export const Product = mongoose.model("products", productSchema)
