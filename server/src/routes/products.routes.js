import express from "express"
import AppError from "../utils/appError.js"
import { productsCtrl } from "../controllers/products.controller.js"
import { autAdmin } from "../middlewares/auth.js"
import multer from "multer"
const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.get("/", productsCtrl.getProdacts)
router.get("/categories", productsCtrl.getCategories)
router.post("/add", upload.single("image"), productsCtrl.addProduct)
router.put("/update/:id", productsCtrl.updateProduct)
router.delete("/delete/:id", productsCtrl.deleteProduct)

export default router
