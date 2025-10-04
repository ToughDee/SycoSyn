import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {Art} from '../models/art.models.js'
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"

const toggleArtLike = AsyncHandler(async (req, res) => {
    const {artId} = req.params
    //TODO: toggle like on video
    if(!artId || !isValidObjectId(artId)) {
        throw new APIError(402, "invalid artId")
    }

    const art = await Art.findById(artId)
    if(!art) {
        throw new APIError(402, "Art doesnt exist")
    }

    let like = await Like.findOne({ likedBy: req.user._id, art: artId });

    try {
        if (!like) {
            await Like.create({ likedBy: req.user._id, art: artId });
            await Art.findByIdAndUpdate(artId, { $inc: { likes: 1 } });
            return res.status(200).json(new APIResponse(200, {}, "Art liked"));
        } else {
            await Like.findByIdAndDelete(like._id);
            await Art.findByIdAndUpdate(artId, { $inc: { likes: -1 } });
            return res.status(200).json(new APIResponse(200, {}, "Art disliked"));
        }
    } catch (error) {
        console.log(error);
        throw new APIError(500, "Error while toggling like");
    }

})

const toggleCommentLike = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new APIError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new APIError(404, "Comment does not exist");
  }

  try {
    let like = await Like.findOne({ likedBy: req.user._id, comment: commentId });

    if (!like) {
      await Like.create({ likedBy: req.user._id, comment: commentId });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } });
      return res.status(200).json(new APIResponse(200, {}, "Comment liked"));
    } else {
      await Like.findByIdAndDelete(like._id);
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });
      return res.status(200).json(new APIResponse(200, {}, "Comment disliked"));
    }
  } catch (error) {
    console.log(error);
    throw new APIError(500, "Error while toggling comment like");
  }
});


const getLikedArts = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Find all Like documents for the user where 'art' exists
  const likedArtsDocs = await Like.find({ likedBy: req.user._id, art: { $exists: true } })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate({
      path: "art",
      populate: { path: "owner", select: "username avatar" }
    });

  const total = await Like.countDocuments({ likedBy: req.user._id, art: { $exists: true } });

  // Extract only the art objects
  const likedArts = likedArtsDocs.map(doc => doc.art).filter(Boolean);

  return res.status(200).json(
    new APIResponse(200, { likedArts, total, page: parseInt(page), limit: parseInt(limit) }, "Liked arts fetched successfully")
  );
})

export {
    toggleCommentLike,
    toggleArtLike,
    getLikedArts
}