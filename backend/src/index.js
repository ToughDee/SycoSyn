import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
  path: './.env',
  credentials: true
})

const PORT = process.env.PORT || 8001

connectDB()
.then( () => {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
  })
})
.catch( (err) => {
  console.log(`connection failed, ${err}`)
})