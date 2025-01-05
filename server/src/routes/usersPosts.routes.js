import express from "express"
import AppError from "../utils/appError.js"
import { userPostCtrl } from "../controllers/userPost.controller.js"
import { autAdmin, auth } from "../middlewares/auth.js"
import multer from "multer"
import fs from "fs"
import path from "path"

// Create uploads directory if it doesn't exist
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

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
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
])
router.get("/all", userPostCtrl.getAllPosts)
router.get("/by-user", auth, userPostCtrl.getUserPosts)
router.get("/categories", auth, userPostCtrl.getCategories)
router.post("/add", auth, uploadFilesMiddleware, userPostCtrl.addPost)
router.put("/update/:id", auth, uploadFilesMiddleware, userPostCtrl.updatePost)
router.delete(
  "/delete/:id",
  auth,
  uploadFilesMiddleware,
  userPostCtrl.deletePost
)
router.get("/post/:id", userPostCtrl.getPostById)
router.put(
  "/admin/edit/:id",
  autAdmin,
  uploadFilesMiddleware,
  userPostCtrl.adminEditPost
)
router.delete("/admin/delete/:id", autAdmin, userPostCtrl.adminDeletePost)

// Add the new rate endpoint
router.post("/rate/:id", auth, userPostCtrl.ratePost)

export default router
