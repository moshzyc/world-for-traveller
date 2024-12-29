import dotenv from "dotenv"
dotenv.config()

import express from "express"
import { PORT } from "./secrets/env.js"
import appRouter from "./routes/app.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import "./db/mongoConnect.js"

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(cookieParser())

app.use((req, _, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

app.use(appRouter)
app.listen(PORT, () => {
  console.log("server is running on port " + PORT)
})
