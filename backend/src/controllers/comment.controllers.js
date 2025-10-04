import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {Art} from "../models/art.models.js"

const getArtComments = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!artId || !isValidObjectId(artId)) {
    throw new APIError(400, "Invalid artId");
  }

  const comments = await Comment.find({ art: artId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("owner", "username avatar");

  const total = await Comment.countDocuments({ art: artId });

  return res.status(200).json(
    new APIResponse(200, {
      comments,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    }, "Comments fetched successfully")
  );
})

const addComment = AsyncHandler(async (req, res) => {
    const {artId} = req.params
    const {content} = req.body

    if(!artId || !content) {
      throw new APIError(400, "invalid request")
    }
    
    if(!isValidObjectId(artId)) {
      throw new APIError(420, "invalid artId")
    }

    const art = await Art.findById(artId)
    if(!art) {
      throw new APIError(400, "Art doesnot exist")
    }

    try {
      const comment = await Comment.create({
        owner: req.user?._id,
        art: artId,
        content,
      })

      const createdComment = await Comment.findById(comment._id)
      if(!createdComment) {
        throw new APIError(400, "Comment was not created")
      }

      return res
        .status(200)
        .json(
          new APIResponse(200, createdComment, "Comment created successfully")
        )
    } catch (error) {
      throw new APIError(500, "Comment could not be created")
    }
})

const updateComment = AsyncHandler(async (req, res) => {
  const {content} = req.body
  const {commentId} = req.params
  
  if(!commentId || !content) {
    throw new APIError(400, "invalid request")
  }

  if(!isValidObjectId(commentId)){
    throw new APIError(400, "commentId invalid")
  }

  const comment = await Comment.findById(commentId)
  if(!comment) {
    throw new APIError(400, "CommentId is invalid")
  }

  if(comment.owner.toString() !== req.user?._id.toString()) {
    throw new APIError(500, "Unauthorized!")
  }

  comment.content = content
  await comment.save()

  return res
    .status(200)
    .json(new APIResponse(200, comment, "Comment updated successfully"))

})

const deleteComment = AsyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId) {
      throw new APIError(400, "CommentId is required")
    }

    if(!isValidObjectId(commentId)){
      throw new APIError(400, "Invalid commentId")
    }

    const comment = await Comment.findById(commentId)

    if(!comment) {
      throw new APIError(400, "CommentId is invalid")
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
      throw new APIError(500, "Unauthorized")
    }
    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new APIResponse(200, {}, "Comment was deleted"))
})

export {
    getArtComments, 
    addComment, 
    updateComment,
    deleteComment
    }