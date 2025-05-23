import express from "express"
import userRouter from "./users.routes.js"
import productRouter from "./products.routes.js"
import guideRouter from "./guide.routes.js"
import userPostsRouter from "./usersPosts.routes.js"
import placesRouter from "./places.routes.js"
import emailRouter from "./email.routes.js"
const router = express.Router()

router.use("/user", userRouter)
router.use("/products", productRouter)
router.use("/guide", guideRouter)
router.use("/users-posts", userPostsRouter)
router.use("/places", placesRouter)
router.use("/email", emailRouter)

// error handler
router.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status).json(err)
})

export default router
