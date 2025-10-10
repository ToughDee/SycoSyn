import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { APIError } from "../utils/APIError.js";
import { AsyncHandler } from '../utils/AsyncHandler.js';
import {APIResponse} from '../utils/APIResponse.js'

import { User } from "../models/user.models.js";
import { generateAccessAndRefreshToken } from "./user.controllers.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // 1️⃣ Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    // 3️⃣ If not, create a new user
    if (!user) {
      user = await User.create({
        email,
        username: name.replace(/\s+/g, "").toLowerCase(), // simple username from name
        fullname: name,
        avatar: picture,
        password: null, // no password for Google login
      });
    }

    // 4️⃣ Generate JWT (same as your normal login)
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Set cookie (like your normal login)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6️⃣ Respond with user info (optional)
    res.status(200).json({
      success: true,
      message: "Logged in successfully via Google",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("❌ Google auth error:", err);
    res.status(400).json({ success: false, message: "Google login failed" });
  }
};


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

