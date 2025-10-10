import mongoose, { isValidObjectId } from "mongoose";
import { Art } from "../models/art.models.js";
import {Like} from "../models/like.models.js"
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js";
import { esClient } from "../utils/elasticsearch.js";

const getAllArts = AsyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    category,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const from = (page - 1) * limit;
  const size = parseInt(limit);

  let arts = [];
  let total = 0;
  let source = "MongoDB";

  // ---------------- Elasticsearch ----------------
  if (query || (category && category !== "All") || userId) {
    try {
      const esQuery = {
        index: "arts",
        from,
        size,
        sort: [{ [sortBy]: { order: sortType } }],
        query: {
          bool: {
            must: [
              query
                ? {
                    multi_match: {
                      query,
                      fields: ["name^3", "caption", "tags"], // fuzzy search
                      fuzziness: "AUTO",
                    },
                  }
                : { match_all: {} },
            ],
            filter: [
              ...(category && category !== "All"
                ? [{ term: { "tags.keyword": category.toLowerCase() } }] // exact match
                : []),
              ...(userId ? [{ term: { owner: userId } }] : []),
            ],
          },
        },
      };

      const result = await esClient.search(esQuery);
      arts = result.hits.hits.map((hit) => ({
        _id: hit._id,
        ...hit._source,
      }));
      total = result.hits.total.value;
      source = "Elasticsearch";
    } catch (err) {
      console.error("❌ Elasticsearch search failed:", err);
    }
  }

  // ---------------- MongoDB Fallback ----------------
  if (!arts.length) {
    const filter = {};
    if (userId) {
      if (!isValidObjectId(userId)) throw new APIError(400, "Invalid userId");
      filter.owner = userId;
    }

    const sortOption = { [sortBy]: sortType === "desc" ? -1 : 1 };

    arts = await Art.find(filter)
      .sort(sortOption)
      .skip((page - 1) * size)
      .limit(size)
      .populate("owner", "username avatar");

    total = await Art.countDocuments(filter);
  }

  // ---------------- Add likedByUser & isBookmarked ----------------
  const loggedInUserId = req.user?._id;
  let bookmarkedSet = new Set();

  if (loggedInUserId) {
    const user = await User.findById(loggedInUserId).select("bookmark");
    if (user?.bookmark?.length) {
      bookmarkedSet = new Set(user.bookmark.map((id) => id.toString()));
    }
  }

  if (loggedInUserId && arts.length) {
    const artIds = arts.map((a) => a._id);
    const likedDocs = await Like.find({
      art: { $in: artIds },
      likedBy: loggedInUserId,
    }).select("art");

    const likedSet = new Set(likedDocs.map((l) => l.art.toString()));

    arts = arts.map((art) => ({
      ...(art.toObject?.() || art),
      // art,
      likedByUser: likedSet.has(art._id.toString()),
      isBookmarked: bookmarkedSet.has(art._id.toString()),
    }));
  } else {
    arts = arts.map((art) => ({
      ...(art.toObject?.() || art),
      // art,
      likedByUser: false,
      isBookmarked: false,
    }));
  }

  return res.status(200).json(
    new APIResponse(
      200,
      { arts, total, page: parseInt(page), limit: size },
      `Arts fetched successfully (via ${source})`
    )
  );
});

const getMyArts = AsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's arts
    let arts = await Art.find({ owner: userId }).sort({ createdAt: -1 });

    // Fetch user's bookmarks
    const user = await User.findById(userId).select("bookmark");
    const bookmarkedSet = new Set(user?.bookmark?.map((id) => id.toString()) || []);

    // Fetch likes by user for these arts
    const artIds = arts.map((a) => a._id);
    const likedDocs = await Like.find({
      art: { $in: artIds },
      likedBy: userId,
    }).select("art");

    const likedSet = new Set(likedDocs.map((l) => l.art.toString()));

    // Add flags to each art
    arts = arts.map((art) => ({
      ...art.toObject?.() || art,
      likedByUser: likedSet.has(art._id.toString()),
      isBookmarked: bookmarkedSet.has(art._id.toString()),
    }));

    res.status(200).json(new APIResponse(200, arts, "User's arts fetched successfully"));
  } catch (error) {
    console.error("Error fetching user's arts:", error);
    res.status(500).json(new APIError(500, "Error fetching user's arts"));
  }
});

const publishAnArt = AsyncHandler(async (req, res) => {
  const { name, caption } = req.body;
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

  const like = await Like.findOne({ likedBy: req.user._id, art: art._id });
  const likedByUser = !!like; // simpler boolean conversion

  const isBookmarked = req.user.bookmark.some(
    (x) => x.toString() === art._id.toString()
  );

  const data = {
    art,
    likedByUser,
    isBookmarked
  }

  return res.status(200).json(new APIResponse(200, data, "Art fetched successfully"));
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

const toggleBookmark = AsyncHandler(async (req, res) => {
  const { artId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(artId)) {
    throw new APIError(400, "Invalid artId");
  }

  const art = await Art.findById(artId).populate("owner", "username avatar");
  if (!art) {
    throw new APIError(404, "Art not found");
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) throw new APIError(404, "User not found");

  let message = "";
  if (user.bookmark.includes(artId)) {
    // Remove bookmark
    user.bookmark = user.bookmark.filter(id => id.toString() !== artId);
    message = "Bookmark removed successfully";
  } else {
    // Add bookmark
    user.bookmark.push(artId);
    message = "Bookmark added successfully";
  }

  await user.save();

  return res.status(200).json(
    new APIResponse(200, { artId, isBookmarked: user.bookmark.includes(artId) }, message)
  );
});

export {
  toggleBookmark,
  getMyArts,
  getAllArts,
  publishAnArt,
  getArtById,
  updateArt,
  deleteArt,
  togglePublishStatus
};
