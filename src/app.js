import express, { urlencoded } from 'express'

const app = express()

//common middlewares

app.cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
)

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))

//import routes

import healthCheckRouter from './routes/healthcheck.routes.js'

//routes

app.use('api/v1/healthcheck', healthCheckRouter)

export {app}