import mongoose from 'mongooose'
import {DB_NAME} from 'constants.js'

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECTION_URI}/${DB_NAME}`)

    console.log(`Database connected! host: ${DB_NAME}`, connectionInstance.connection.host)

  } catch (error) {
    console.log(`DB Connection error`, error)
    process.exit(1)
  }
}

export default connectDB