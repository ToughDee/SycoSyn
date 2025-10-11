import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { APIError } from "../utils/APIError.js";
import { AsyncHandler } from '../utils/AsyncHandler.js';
import {APIResponse} from '../utils/APIResponse.js'

import { User } from "../models/user.models.js";
import { generateAccessAndRefreshToken } from "./user.controllers.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = AsyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    // 1️⃣ Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 2️⃣ Check if user exists or create a new one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: name.replace(/\s+/g, "").toLowerCase(),
        fullname: name,
        avatar: picture,
        password: "null",
      });
    }

    // 3️⃣ Generate Access & Refresh Tokens
    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    // 4️⃣ Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 5️⃣ Set both tokens as cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // 6️⃣ Send consistent response
    return res.status(200).json(
      new APIResponse(
        200,
        {
          success: true,
          message: "Logged in successfully via Google",
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
          },
          accessToken,
          refreshToken,
        },
        "Google login success"
      )
    );
  } catch (err) {
    console.error("❌ Google auth error:", err);
    return res
      .status(400)
      .json(new APIResponse(400, { success: false }, "Google login failed"));
  }
});



export const authCheck = AsyncHandler(async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json(new APIResponse(401, { isAuthenticated: false }, "No token found"));
    }

    let user;
    let newAccessToken;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        user = await User.findById(decoded.id).select("-password -refreshToken");
      } catch (err) {
        // Access token invalid or expired
        if (!refreshToken) throw new APIError(401, "Access token expired, no refresh token");
      }
    }

    // If accessToken invalid, try refreshToken
    if (!user && refreshToken) {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      user = await User.findById(decodedRefresh.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new APIError(401, "Invalid or expired refresh token");
      }

      // Generate new access token (keep refresh token same or rotate if you want)
      newAccessToken = user.generateAccessToken();
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.PROD === "production",
      });

      user = await User.findById(user._id).select("-password -refreshToken");
    }

    if (!user) {
      return res.status(401).json(new APIResponse(401, { isAuthenticated: false }, "User not found"));
    }

    return res.status(200).json(
      new APIResponse(200, { isAuthenticated: true, user, accessToken: newAccessToken || accessToken }, "Authorized")
    );
  } catch (error) {
    console.error("authCheck error:", error);
    return res.status(401).json(new APIResponse(401, { isAuthenticated: false }, error.message || "Unauthorized"));
  }
});

