import mongoose, { Schema } from "mongoose";
import { esClient } from "../utils/elasticsearch.js";
import { User } from "./user.models.js";

const artSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    caption: { type: String, default: "" },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function indexArtInElasticsearch(doc) {
  try {
    const ownerData = await User.findById(doc.owner).select("username avatar");
    await esClient.index({
      index: "arts",
      id: doc._id.toString(),
      document: {
        name: doc.name,
        caption: doc.caption,
        content: doc.content,
        tags: doc.tags,
        ownerId: doc.owner.toString(), // ✅ simple string id
        ownerUsername: ownerData?.username || null, // ✅ flattened fields
        ownerAvatar: ownerData?.avatar || null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error indexing art in Elasticsearch:", err);
  }
}

async function updateArtInElasticsearch(doc) {
  try {
    const ownerData = await User.findById(doc.owner).select("username avatar");
    await esClient.update({
      index: "arts",
      id: doc._id.toString(),
      doc: {
        name: doc.name,
        caption: doc.caption,
        content: doc.content,
        tags: doc.tags,
        ownerId: doc.owner.toString(),
        ownerUsername: ownerData?.username || null,
        ownerAvatar: ownerData?.avatar || null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error updating Elasticsearch index:", err);
  }
}

async function deleteArtFromElasticsearch(doc) {
  try {
    await esClient.delete({
      index: "arts",
      id: doc._id.toString(),
    });
    console.log(`🗑️ Deleted art ${doc._id} from Elasticsearch`);
  } catch (err) {
    console.error(`❌ Error deleting art ${doc._id} from Elasticsearch:`, err);
  }
}

artSchema.post("save", indexArtInElasticsearch);
artSchema.post("findOneAndUpdate", updateArtInElasticsearch);
artSchema.post("findOneAndDelete", deleteArtFromElasticsearch);

export const Art = mongoose.model("Art", artSchema);
