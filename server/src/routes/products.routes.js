import express from "express"
import AppError from "../utils/appError.js"
import { productsCtrl } from "../controllers/products.controller.js"
import { autAdmin, auth } from "../middlewares/auth.js"
import multer from "multer"
const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", productsCtrl.getProdacts)
router.get("/product/:id", productsCtrl.getProdact)
router.get("/categories", productsCtrl.getCategories)
router.post("/add", autAdmin, upload.array("image"), productsCtrl.addProduct)
router.put("/update/:id", autAdmin, productsCtrl.updateProduct)
router.delete("/delete/:id", autAdmin, productsCtrl.deleteProduct)

export default router
