import express from "express"
import userRouter from "./users.routes.js"
import productRouter from "./products.routes.js"
import guideRouter from "./guide.routes.js"

const router = express.Router()


router.use("/user", userRouter)
router.use("/products", productRouter)
router.use("/guide", guideRouter)

// errror handler
router.use((err, req, res, next) => {
  // err.print()
  console.error(err)
  res.status(err.status).json(err)
})


export default router