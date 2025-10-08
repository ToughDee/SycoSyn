import mongoose, { Schema } from "mongoose";
import { esClient } from "../utils/elasticsearch.js";

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

artSchema.post("save", async function (doc) {
  try {
    await esClient.index({
      index: "arts",
      id: doc._id.toString(),
      document: {
        name: doc.name,
        caption: doc.caption,
        content: doc.content,
        tags: doc.tags,
        owner: doc.owner,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error indexing art in Elasticsearch:", err);
  }
});

artSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  try {
    await esClient.update({
      index: "arts",
      id: doc._id.toString(),
      doc: doc.toObject(),
    });
  } catch (err) {
    console.error("❌ Error updating Elasticsearch index:", err);
  }
});

artSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    await esClient.delete({
      index: "arts",
      id: doc._id.toString(),
    });
  } catch (err) {
    console.error("❌ Error deleting from Elasticsearch:", err);
  }
});

export const Art = mongoose.model("Art", artSchema);
