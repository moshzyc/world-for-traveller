import express from "express"
import AppError from "../utils/appError.js"
import { userPostCtrl } from "../controllers/userPost.controller.js"
import { autAdmin, auth } from "../middlewares/auth.js"
import multer from "multer"

const router = express.Router()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const upload = multer({ storage })
const uploadFilesMiddleware = upload.fields([
  { name: "mainImage", maxCount: 1 }, // עבור התמונה הראשית (אחת בלבד)
  { name: "images", maxCount: 10 }, // עבור מערך התמונות (עד 10, אפשר לשנות את המספר)
])
router.get("/get", auth, userPostCtrl.getPosts)
router.get("/categories", auth, userPostCtrl.getCategories)
router.post("/add", auth, uploadFilesMiddleware, userPostCtrl.addPost)
router.put("/update/:id", auth, uploadFilesMiddleware, userPostCtrl.updatePost)
router.delete("/delete/:id", auth, uploadFilesMiddleware, userPostCtrl.deletePost)


export default router
