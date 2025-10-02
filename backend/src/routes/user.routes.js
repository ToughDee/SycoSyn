import {Router} from 'express'
import {upload} from '../middlewares/multer.middlewares.js'
import {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
} from '../controllers/user.controllers.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
)

router.route('/login').post(loginUser)

//protected routes
router.route('/logout').post(verifyJWT, logoutUser)

export default router