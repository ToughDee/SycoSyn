import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Follow } from "../models/follow.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = AsyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new APIError(400, "Invalid channelId");
  }

  const channel = await User.findById(channelId);
  if (!channel) throw new APIError(404, "Channel not found");

  if (req.user._id.toString() === channelId.toString()) {
    throw new APIError(400, "You cannot subscribe to yourself");
  }

  let subscription = await Follow.findOne({
    follower: req.user._id,
    following: channelId,
  });

  if (!subscription) {
    subscription = await Follow.create({
      follower: req.user._id,
      following: channelId,
    });

    return res
      .status(200)
      .json(new APIResponse(200, {}, "Subscribed successfully"));
  } else {
    await Follow.findByIdAndDelete(subscription._id);

    return res
      .status(200)
      .json(new APIResponse(200, {}, "Unsubscribed successfully"));
  }
});

const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new APIError(400, "Invalid channelId");
  }

  const subscribers = await Follow.find({ following: channelId }).populate(
    "follower",
    "username avatar"
  );

  return res
    .status(200)
    .json(
      new APIResponse(200, subscribers, "Channel subscribers fetched successfully")
    );
});

const getSubscribedChannels = AsyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new APIError(400, "Invalid subscriberId");
  }

  const channels = await Follow.find({ follower: subscriberId }).populate(
    "following",
    "username avatar"
  );

  return res
    .status(200)
    .json(
      new APIResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
