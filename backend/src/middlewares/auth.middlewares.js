import {User} from "../models/user.models.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import jwt from 'jsonwebtoken'
import {APIError} from '../utils/APIError.js'

const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token) {
      throw new APIError(401, "unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user) {
      throw new APIError(402, "Invalid access token")
    }

    req.user = user

    next()
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid Access Token")
  }
})

export {verifyJWT}