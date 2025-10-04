import {AsyncHandler} from '../utils/AsyncHandler.js'
import {APIError} from '../utils/APIError.js'
import {APIResponse} from '../utils/APIResponse.js'
import {uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl} from '../utils/cloudinary.js'
import {User} from '../models/user.models.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}

  } catch (error) {
    throw new APIError(500, "Something went wrong while generating access and refresh tokens")
  }
}

const registerUser = AsyncHandler(async (req, res) => {
  const {email, username, password} = req.body

  if([email, username, password].some((field) => field?.trim() === "")) {
    throw new APIError(400, "All fields are required")
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] })

  if(existedUser) {
    throw new APIError(409, 'User with email or username already exists')
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      fullname: "",
      email: email,
      password: password
    })
  
    const createdUser = await User.findById(user._id).select('-password -refreshToken')
  
    if(!createdUser) {
      throw new APIError(500, 'Something went wrong while creating user')
    }
  
    console.log('user created succesfully')
    return res
      .status(200)
      .json(new APIResponse(200, createdUser, 'User register successfully'))
  } catch (error) {
    console.log('user creation failed')

    throw new APIError(500, 'Something went wrong while creating user')
  }

})

const loginUser = AsyncHandler(async (req, res) => {
  const {username, password} = req.body
  if(!username) {
    throw new APIError(400, 'username is required')
  }

  const user = await User.findOne({username})

  if(!user) {
    throw new APIError(401, 'User does not exist')
  }

  // console.log(password)
  // console.log(user.password)
  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if(!isPasswordCorrect) {
    throw new APIError(401, 'Invalid Credentials')
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

  const options = {
    httpOnly: true,
    secure: true
  }
  console.log("login successful")
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new APIResponse(200, {user: loggedInUser, accessToken, refreshToken}, 'Logged in successfully'))
})

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  if(!incomingRefreshToken) {
    throw new APIError(500, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user) {
      throw new APIError(501, "invalid refresh token")
    }

    if(user?.refreshToken !== incomingRefreshToken) {
      throw new APIError(501, "Refresh token is expired or used")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
      httpOnly: true,
      secure: true
    }

    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new APIResponse(
          200,
          {accessToken, refreshToken},
          "access token refreshed"
        )
      )

  } catch (error) {
    throw new APIError(500, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = AsyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect) {
    throw new APIError(502, "Wrong old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave:  false})

  return res
    .status(200)
    .json(new APIResponse(200, {}, "Successfully Changed Password"))
})

const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APIResponse(200, req.user, "User fetched successfully"))
})

const updateAccountDetails = AsyncHandler(async (req, res) => {
  const {email, fullname} = req.body

  if(!email || !fullname) {
    throw new APIError(408, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email
      }
    },
    { new: true }
  ).select("-password")

  return res
    .status(200)
    .json(new APIResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new APIError(409, "Avatar file is missing");
  }

  const oldAvatarURL = req.user?.avatar || "";

  const newAvatar = await uploadOnCloudinary(avatarLocalPath);
  if (!newAvatar?.url) {
    throw new APIError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: newAvatar.url } },
    { new: true }
  ).select("-password");

  if (oldAvatarURL) {
    try {
      const publicId = getPublicIdFromUrl(oldAvatarURL);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    } catch (error) {
      console.warn("Failed to delete avatar oldfile:", error.message)
    }
  }

  return res
    .status(200)
    .json(new APIResponse(200, user, "Avatar updated successfully"));
});


const updateUserCoverImage = AsyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new APIError(409, "Cover image file is missing");
  }

  const oldCoverImageURL = req.user?.coverImage || "";
  const newCoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!newCoverImage?.url) {
    throw new APIError(400, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: newCoverImage.url } },
    { new: true }
  ).select("-password");

  if (oldCoverImageURL) {
    try {
      const publicId = getPublicIdFromUrl(oldCoverImageURL);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    } catch (err) {
      console.warn("Failed to delete old cover image:", err.message);
    }
  }

  return res
    .status(200)
    .json(new APIResponse(200, user, "Cover image updated successfully"));
});


const getUserChannelProfile = AsyncHandler((req, res) => {
  
})

const getWatchHistory = AsyncHandler((req, res) => {

})

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
}