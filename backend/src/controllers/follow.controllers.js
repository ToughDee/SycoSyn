import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Follow } from "../models/follow.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const toggleFollow = AsyncHandler(async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    throw new APIError(400, "Invalid profileId");
  }

  const profile = await User.findById(profileId);
  if (!profile) throw new APIError(404, "Profile not found");

  if (req.user._id.toString() === profileId.toString()) {
    throw new APIError(400, "You cannot follow yourself");
  }

  let follow = await Follow.findOne({
    follower: req.user._id,
    following: profileId,
  });

  if (!follow) {
    follow = await Follow.create({
      follower: req.user._id,
      following: profileId,
    });

    return res
      .status(200)
      .json(new APIResponse(200, {}, "Followed successfully"));
  } else {
    await Follow.findByIdAndDelete(follow._id);

    return res
      .status(200)
      .json(new APIResponse(200, {}, "Unfollowed successfully"));
  }
});

const getUserFollowers = AsyncHandler(async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    throw new APIError(400, "Invalid profileId");
  }

  const followers = await Follow.find({ following: profileId }).populate(
    "follower",
    "username avatar"
  );

  return res
    .status(200)
    .json(
      new APIResponse(200, followers, "User followers fetched successfully")
    );
});

const getUserFollowings = AsyncHandler(async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    throw new APIError(400, "Invalid profileId");
  }

  const channels = await Follow.find({ follower: profileId }).populate(
    "following",
    "username avatar"
  );

  return res
    .status(200)
    .json(
      new APIResponse(200, channels, "Followings fetched successfully")
    );
});

export {
  toggleFollow,
  getUserFollowers,
  getUserFollowings,
};
