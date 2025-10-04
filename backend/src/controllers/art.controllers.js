import mongoose, { isValidObjectId } from "mongoose";
import { Art } from "../models/arts.models.js";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js";

const getAllArts = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const filter = {};
  if (query) filter.name = { $regex: query, $options: "i" };
  if (userId) {
    if (!isValidObjectId(userId)) throw new APIError(400, "Invalid userId");
    filter.owner = userId;
  }

  const sortOption = { [sortBy]: sortType === "desc" ? -1 : 1 };

  const arts = await Art.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("owner", "username avatar");

  const total = await Art.countDocuments(filter);

  return res.status(200).json(new APIResponse(200, { arts, total, page: parseInt(page), limit: parseInt(limit) }, "Arts fetched successfully"));
});

const publishAnArt = AsyncHandler(async (req, res) => {
  const { name, content, caption } = req.body;
  const artFile = req.file?.path;

  if (!name || !content || !artFile) throw new APIError(400, "All fields and art file are required");

  const uploadedArt = await uploadOnCloudinary(artFile);
  if (!uploadedArt?.url) throw new APIError(500, "Error uploading art");

  const art = await Art.create({
    owner: req.user._id,
    name,
    content: uploadedArt.url,
    caption: caption || "",
    isPublished: true
  });

  return res.status(201).json(new APIResponse(201, art, "Art published successfully"));
});

const getArtById = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  if (!isValidObjectId(artId)) throw new APIError(400, "Invalid artId");

  const art = await Art.findById(artId).populate("owner", "username avatar");
  if (!art) throw new APIError(404, "Art not found");

  // Increment views
  art.views++;
  await art.save();

  return res.status(200).json(new APIResponse(200, art, "Art fetched successfully"));
});

const updateArt = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  const { name, caption } = req.body;
  const artFile = req.file?.path;

  if (!isValidObjectId(artId)) throw new APIError(400, "Invalid artId");

  const art = await Art.findById(artId);
  if (!art) throw new APIError(404, "Art not found");
  if (art.owner.toString() !== req.user._id.toString()) throw new APIError(403, "Unauthorized");

  if (name) art.name = name;
  if (caption) art.caption = caption;

  if (artFile) {
    const uploadedArt = await uploadOnCloudinary(artFile);
    if (!uploadedArt?.url) throw new APIError(500, "Error uploading art file");

    if (art.content) {
      try {
        const publicId = getPublicIdFromUrl(art.content);
        if (publicId) await deleteFromCloudinary(publicId);
      } catch (err) {
        console.warn("Failed to delete old art:", err.message);
      }
    }

    art.content = uploadedArt.url;
  }

  await art.save();

  return res.status(200).json(new APIResponse(200, art, "Art updated successfully"));
});

const deleteArt = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  if (!isValidObjectId(artId)) throw new APIError(400, "Invalid artId");

  const art = await Art.findById(artId);
  if (!art) throw new APIError(404, "Art not found");
  if (art.owner.toString() !== req.user._id.toString()) throw new APIError(403, "Unauthorized");

  if (art.content) {
    try {
      const publicId = getPublicIdFromUrl(art.content);
      if (publicId) await deleteFromCloudinary(publicId);
    } catch (err) {
      console.warn("Failed to delete art from Cloudinary:", err.message);
    }
  }

  await Art.findByIdAndDelete(artId);

  return res.status(200).json(new APIResponse(200, {}, "Art deleted successfully"));
});

const togglePublishStatus = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  if (!isValidObjectId(artId)) throw new APIError(400, "Invalid artId");

  const art = await Art.findById(artId);
  if (!art) throw new APIError(404, "Art not found");
  if (art.owner.toString() !== req.user._id.toString()) throw new APIError(403, "Unauthorized");

  art.isPublished = !art.isPublished;
  await art.save();

  return res.status(200).json(new APIResponse(200, art, `Art is now ${art.isPublished ? "published" : "unpublished"}`));
});

export {
  getAllArts,
  publishAnArt,
  getArtById,
  updateArt,
  deleteArt,
  togglePublishStatus
};
