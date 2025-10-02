import {AsyncHandler} from '../utils/AsyncHandler.js'
import {APIError} from '../utils/APIError.js'
import {APIResponse} from '../utils/APIResponse.js'
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.js'
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
  const {fullname, email, username, password} = req.body

  if([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new APIError(400, "All fields are required")
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] })

  if(existedUser) {
    throw new APIError(409, 'User with email or username already exists')
  }

  const avatarLocalPath = req.files?.avatar[0]?.path

  let coverImageLocalPath
  if(req.files && Array.isArray(req.files.coverImage) &&req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if(!avatarLocalPath) {
    throw new APIError(400, 'avatar file is required')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new APIError(400, 'avatar file is Required')
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      fullname,
      email,
      avatar: avatar.url,
      coverImage: coverImage.url || "",
      password
    })
  
    const createdUser = await User.findById(user._id).select('-password -refreshToken')
  
    if(!createdUser) {
      throw new APIError(500, 'Something went wrong while creating user')
    }
  
    return res
      .status(201)
      .json(new APIResponse(200, createdUser, 'User register successfully'))
  } catch (error) {
    console.log('user creation failed')
    if(avatar) {
      await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage) {
      await deleteFromCloudinary(coverImage.public_id)
    }

    throw new APIError(500, 'Something went wrong while creating user and images were deleted')
  }

})

const loginUser = AsyncHandler(async (req, res) => {
  const {email, username, password} = req.body
  if(!username && !email) {
    throw new Error(400, 'username or email is required')
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user) {
    throw new APIError(401, 'User does not exist')
  }

  console.log(password)
  console.log(user.password)
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

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new APIResponse(200, {user: loggedInUser, accessToken, refreshToken}, 'Logged in successfully'))
})

const logoutUser = AsyncHandler(async (req, res) => {

})

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken) {
    throw new APIError(500, "unauthorized request")
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = User.findById(decodedToken?._id)

    if(!user) {
      throw new APIError(501, "invalid refresh token")
    }

    if(user?.refreshToken !== incomingRefreshToken) {
      throw new APIError(501, "Refresh token is expired or used")
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(user._id)

    const options = {
      httpOnly: true,
      secure: true
    }

    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        200,
        {accessToken, refreshToken},
        "access token refreshed"
      )
  } catch (error) {
    throw new APIError(500, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = AsyncHandler((req, res) => {

})

const updateAccountDetails = AsyncHandler((req, res) => {

})

const updateUserAvatar = AsyncHandler((req, res) => {

})

const updateUserCoverImage = AsyncHandler((req, res) => {

})

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
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
}