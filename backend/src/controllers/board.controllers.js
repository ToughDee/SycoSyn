import mongoose, { isValidObjectId } from "mongoose";
import { Board } from "../models/board.models.js";
import { Art } from "../models/art.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

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

  if (name) board.name = name;
  if (description) board.description = description;

  await board.save();

  return res
    .status(200)
    .json(new APIResponse(200, board, "Board updated successfully"));
});

export {
  createBoard,
  getUserBoards,
  getBoardById,
  addArtToBoard,
  removeArtFromBoard,
  deleteBoard,
  updateBoard,
};
