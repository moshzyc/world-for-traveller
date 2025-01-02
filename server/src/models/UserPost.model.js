import mongoose from "mongoose"

const UserPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ["locations", "products reviews", "trip tips"],
      required: true,
    },
    location: {
      type: {
        name: String,
        lat: Number,
        lng: Number,
      },
      required: function () {
        return this.category === "locations"
      },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: function () {
        return this.category === "products reviews"
      },
    },
    images: {
      type: [String],
    },
    mainImage: {
      type: String,
      required: true,
    },
    createdBy: {
      username: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    adminEdits: [
      {
        editedAt: {
          type: Date,
          default: Date.now,
        },
        editedBy: {
          type: String,
          required: true,
        },
        action: {
          type: String,
          enum: ["edit", "delete"],
          required: true,
        },
        reason: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
)

export const UserPost = mongoose.model("user-post", UserPostSchema)
