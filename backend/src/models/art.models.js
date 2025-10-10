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
    // fetch owner details
    const ownerData = await User.findById(doc.owner).select("username avatar");

    await esClient.index({
      index: "arts",
      id: doc._id.toString(),
      document: {
        name: doc.name,
        caption: doc.caption,
        content: doc.content,
        tags: doc.tags,
        owner: ownerData
          ? {
              _id: ownerData._id.toString(),
              username: ownerData.username,
              avatar: ownerData.avatar
            }
          : null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error indexing art in Elasticsearch:", err);
  }
});

artSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

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
        owner: ownerData
          ? {
              _id: ownerData._id.toString(),
              username: ownerData.username,
              avatar: ownerData.avatar
            }
          : null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error updating Elasticsearch index:", err);
  }
});

artSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  try {
    // Optional: fetch owner info for logging/debug
    const ownerData = await User.findById(doc.owner).select("username avatar");

    console.log(`Deleting art from ES:
      Art ID: ${doc._id.toString()}
      Owner: ${ownerData ? ownerData.username : 'Unknown'}
    `);

    await esClient.delete({
      index: "arts",
      id: doc._id.toString(),
    });

    console.log(`✅ Successfully deleted art ${doc._id.toString()} from ES`);
  } catch (err) {
    console.error(
      `❌ Error deleting art ${doc._id.toString()} from Elasticsearch:`,
      err
    );
  }
});


export const Art = mongoose.model("Art", artSchema);
