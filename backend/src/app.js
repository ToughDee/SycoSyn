import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import followRouter from "./routes/follow.routes.js"
import artRouter from "./routes/art.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import boardRouter from "./routes/board.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/art", artRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/board", boardRouter)
app.use("/api/v1/dashboard", dashboardRouter)


export { app }