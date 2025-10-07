import mongoose, { isValidObjectId } from "mongoose";
import { Art } from "../models/art.models.js";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js";


//id
//title
//content
//likes
//views
//uploadDate

const getMyArts = AsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const arts = await Art.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json(new APIResponse(200, arts, "arts fetched"));
  } catch (error) {
    console.error("Error fetching user's arts:", error);
    res.status(500).json(new APIError(404, "fetch errorr"));
  }
});


const getAllArts = AsyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,           // search term for art name
    category,        // filter by category
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {};

  // Partial name search (case-insensitive)
  if (query) {
    filter.name = { $regex: query, $options: "i" };
  }

  // Filter by category if provided
  if (category && category !== "All") {
    filter.name = { ...filter.name, $regex: category, $options: "i" };
    // Note: if you stored category separately, you could filter by category field instead
    // e.g., filter.category = category
  }

  // Filter by user if userId is provided
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

  return res.status(200).json(
  new APIResponse(200, { arts, total, page: parseInt(page), limit: parseInt(limit) }, "Arts fetched successfully")
);
});

const publishAnArt = AsyncHandler(async (req, res) => {
  const { name, caption, tags } = req.body;
  const artFile = req.files?.artFile?.[0]?.path;

  if (!name || !caption || !artFile) throw new APIError(400, "All fields and art file are required");

  const uploadedArt = await uploadOnCloudinary(artFile);
  if (!uploadedArt?.url) throw new APIError(500, "Error uploading art");

  try {
    const art = await Art.create({
      owner: req.user._id,
      name,
      content: uploadedArt.url,
      caption: caption || "",
      isPublished: true
    })
  
    return res.status(201).json(new APIResponse(201, art, "Art published successfully"))
  } catch (error) {
    throw new APIError(402, "Error while creating art object")
  }
})

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
  getMyArts,
  getAllArts,
  publishAnArt,
  getArtById,
  updateArt,
  deleteArt,
  togglePublishStatus
};
