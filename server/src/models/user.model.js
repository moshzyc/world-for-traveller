import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    refreshTokens: [
      {
        token: String,
        createdAt: Date,
      },
    ],

    birthDate: Date,
    otp: String,
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    orders: [
      {
        cart: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
              required: true,
            },
            quantity: {
              type: Number,
              default: 1,
            },
            addedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        orderDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "cancelled"],
          default: "pending",
        },
        totalAmount: {
          type: Number,
          required: true,
        },
        deliveryAddress: {
          type: String,
          required: false,
        },
      },
    ],
    posts: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user-post",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    favorites: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    trips: [
      {
        name: {
          type: String,
          required: true,
        },
        locations: [
          {
            name: String,
            lat: Number,
            lng: Number,
          },
        ],
        dates: {
          start: Date,
          end: Date,
        },
        weatherData: [
          {
            location: String,
            forecast: Object,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)
export const User = mongoose.model("users", userSchema)
