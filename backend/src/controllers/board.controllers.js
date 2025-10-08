import mongoose, { isValidObjectId } from "mongoose";
import { Board } from "../models/board.models.js";
import { Art } from "../models/art.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import {User} from "../models/user.models.js"

const createBoard = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new APIError(400, "Name and description are required");
  }

  const board = await Board.create({
    owner: req.user?._id,
    name,
    description,
  });

  return res
    .status(201)
    .json(new APIResponse(201, board, "Board created successfully"));
});

const getUserBoards = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new APIError(400, "Invalid userId");
  }

  const boards = await Board.find({ owner: userId }).populate(
    "arts",
    "name content caption"
  );

  return res
    .status(200)
    .json(new APIResponse(200, boards, "User boards fetched successfully"));
});

const getBoardById = AsyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!isValidObjectId(boardId)) {
    throw new APIError(400, "Invalid boardId");
  }

  const board = await Board.findById(boardId).populate(
    "arts",
    "name content caption"
  );

  if (!board) throw new APIError(404, "Board not found");

  return res
    .status(200)
    .json(new APIResponse(200, board, "Board fetched successfully"));
});

const addArtToBoard = AsyncHandler(async (req, res) => {
  const { boardId, artId } = req.params;

  if (!isValidObjectId(boardId) || !isValidObjectId(artId)) {
    throw new APIError(400, "Invalid boardId or artId");
  }

  const board = await Board.findById(boardId);
  if (!board) throw new APIError(404, "Board not found");

  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.collaborators.some(id => id.toString() === req.user._id.toString())
  ) {
    throw new APIError(403, "Access denied: not authorized for this board");
  }

  const art = await Art.findById(artId);
  if (!art) throw new APIError(404, "Art not found");

  if (board.arts.includes(artId)) {
    throw new APIError(400, "Art already exists in this board");
  }

  board.arts.push(artId);
  await board.save();

  return res
    .status(200)
    .json(new APIResponse(200, board, "Art added to board successfully"));
});

const removeArtFromBoard = AsyncHandler(async (req, res) => {
  const { boardId, artId } = req.params;

  if (!isValidObjectId(boardId) || !isValidObjectId(artId)) {
    throw new APIError(400, "Invalid boardId or artId");
  }

  const board = await Board.findById(boardId);
  if (!board) throw new APIError(404, "Board not found");

  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.collaborators.some(id => id.toString() === req.user._id.toString())
  ) {
    throw new APIError(403, "Access denied: not authorized for this board");
  }

  board.arts = board.arts.filter(
    (id) => id.toString() !== artId.toString()
  );

  await board.save();

  return res
    .status(200)
    .json(new APIResponse(200, board, "Art removed from board successfully"));
});

const deleteBoard = AsyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!isValidObjectId(boardId)) {
    throw new APIError(400, "Invalid boardId");
  }

  const board = await Board.findById(boardId);
  if (!board) throw new APIError(404, "Board not found");

  if (board.owner.toString() !== req.user._id.toString()) {
    throw new APIError(403, "Access denied: not authorized for this board");
  }

  await board.deleteOne();

  return res
    .status(200)
    .json(new APIResponse(200, {}, "Board deleted successfully"));
});

const updateBoard = AsyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(boardId)) {
    throw new APIError(400, "Invalid boardId");
  }

  const board = await Board.findById(boardId);
  if (!board) throw new APIError(404, "Board not found");

  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.collaborators.some(id => id.toString() === req.user._id.toString())
  ) {
    throw new APIError(403, "Access denied: not authorized for this board");
  }

  if (name) board.name = name;
  if (description) board.description = description;

  await board.save();

  return res
    .status(200)
    .json(new APIResponse(200, board, "Board updated successfully"));
});

const addCollaborators = AsyncHandler(async(req, res) => {
  const {boardId, userId} = req.params

  if(!isValidObjectId(boardId) || !isValidObjectId(userId)) {
    throw new APIError(400, "Invalid userId or boardId")
  }

  if(!boardId || !userId) {
    throw new APIError(404, "boardId or userId not found")
  }

  const board = await Board.findById(boardId)
  if(!board) {
    throw new APIError(404, "Board not found")
  }

  if(req.user?._id.toString() !== board?.owner.toString()) {
    throw new APIError(403, "Unauthorised request!")
  }

  if (board.collaborators.some(id => id.toString() === userId.toString())) {
    throw new APIError(400, "User is already a collaborator");
  }

  board.collaborators.push(userId)
  await board.save()

  res
    .status(200)
    .json(new APIResponse(200, board, "Collaborator added"))
})

const getBookmarks = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new APIError(401, "User not authenticated");
  }

  // Step 1: Get user's bookmarked art IDs
  const user = await User.findById(userId).select("bookmark").lean();
  if (!user || !user.bookmark?.length) {
    return res.status(200).json(new APIResponse(200, [], "No bookmarks found"));
  }

  // Step 2: Fetch bookmarked arts with owner info
  const bookmarkedArts = await Art.find({
    _id: { $in: user.bookmark },
  })
    .populate("owner", "username fullname avatar")
    .sort({ createdAt: -1 })
    .lean();

  // Step 3: Map results and include likes/views
  const artsWithStats = bookmarkedArts.map((art) => ({
    ...art,
    likes: art.likes || 0,
    views: art.views || 0,
    likedByUser: false, // Cannot determine per-user likes without a separate likes collection
  }));

  // Step 4: Return response
  return res
    .status(200)
    .json(new APIResponse(200, artsWithStats, "Bookmarks fetched successfully"));
});

export {
  getBookmarks,
  addCollaborators,
  createBoard,
  getUserBoards,
  getBoardById,
  addArtToBoard,
  removeArtFromBoard,
  deleteBoard,
  updateBoard,
};
