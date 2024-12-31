import express from "express"
import multer from "multer"
import { guidesCtrl } from "../controllers/guides.controller.js"
import { autAdmin, auth } from "../middlewares/auth.js"

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
router.get("/get", guidesCtrl.getGuides)
router.post("/add", autAdmin, uploadFilesMiddleware, guidesCtrl.addGuide)
router.put("/update/:id", autAdmin, uploadFilesMiddleware, guidesCtrl.updateGuide)
router.delete("/delete/:id", autAdmin, guidesCtrl.deleteGuide)
router.get("/get/:id", autAdmin,guidesCtrl.getGuideById)

export default router
