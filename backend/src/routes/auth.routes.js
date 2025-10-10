import { Router } from 'express';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken'
import {APIResponse} from '../utils/APIResponse.js'

const router = Router();

router.route("/check").get(AsyncHandler(async (req, res) => {
  const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  if(!token) {
    res.status(400).json(new APIResponse(400, {isAuthenticated: false}, "No token found"))
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if(!decodedToken) res.status(400).json(new APIResponse(400, {isAuthenticated: false}, "Invalid Token"))

  const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

  if(user) {
    res.status(200).json(new APIResponse(200, {isAuthenticated: false}, "Authorized"))
  }
  else {
    res.status(400).json(new APIResponse(400, {isAuthenticated: false}, "User not Found"))
  }
}))

export default router