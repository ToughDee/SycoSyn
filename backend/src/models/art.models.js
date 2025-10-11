import mongoose, { Schema } from "mongoose";
import { esClient } from "../utils/elasticsearch.js";
import { User } from "./user.models.js";
import { generateTags } from "../utils/autoTag.js";

const artSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // image URL
    caption: { type: String, default: "" },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

artSchema.pre("save", async function (next) {
  try {
    // New document or updated content/caption → re-generate tags
    if (
      this.isNew ||
      this.isModified("content") ||
      this.isModified("caption") ||
      this.tags.length === 0
    ) {
      console.log(`🧠 Generating tags for art: "${this.name}"...`);

      const generatedTags = await generateTags({
        imageUrl: this.content,
        caption: this.caption,
      });

      // Preserve existing tags (folder tags, etc.)
      this.tags = Array.from(new Set([...(this.tags || []), ...(generatedTags || [])]));
      console.log(`✅ Tags for "${this.name}":`, this.tags);
    }
  } catch (err) {
    console.error(`⚠️ Tag generation failed for "${this.name}":`, err.message);
  }

  next();
});

artSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (!update) return next();

    const shouldRegenerate =
      update.caption !== undefined ||
      update.content !== undefined ||
      update.tags?.length === 0;

    if (shouldRegenerate) {
      const docToUpdate = await this.model.findOne(this.getQuery());
      const imageUrl = update.content || docToUpdate.content;
      const caption = update.caption || docToUpdate.caption;

      console.log(`🧠 Re-generating tags for update on "${docToUpdate?.name}"...`);
      const generatedTags = await generateTags({ imageUrl, caption });

      // Merge existing tags with generated ones
      update.tags = Array.from(
        new Set([...(update.tags || docToUpdate.tags || []), ...(generatedTags || [])])
      );

      this.setUpdate(update);
      console.log(`✅ Updated tags for "${docToUpdate?.name}":`, update.tags);
    }
  } catch (err) {
    console.error("⚠️ Failed to regenerate tags on update:", err.message);
  }

  next();
});


//ElasticSearch Integration
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
        owner: doc.owner,
        // ownerId: doc.owner.toString(),
        // ownerUsername: ownerData?.username || null,
        // ownerAvatar: ownerData?.avatar || null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt,
      },
    });
    console.log(`🔍 Indexed art "${doc.name}" into Elasticsearch`);
  } catch (err) {
    console.error("❌ Error indexing art in Elasticsearch:", err);
  }
}

async function updateArtInElasticsearch(doc) {
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
        ownerId: doc.owner.toString(),
        ownerUsername: ownerData?.username || null,
        ownerAvatar: ownerData?.avatar || null,
        likes: doc.likes,
        views: doc.views,
        createdAt: doc.createdAt,
      },
    });
    console.log(`🆙 Updated Elasticsearch index for art "${doc.name}"`);
  } catch (err) {
    console.error("❌ Error updating Elasticsearch index:", err);
  }
}

async function deleteArtFromElasticsearch(doc) {
  if (!doc) return;
  try {
    await esClient.delete({
      index: "arts",
      id: doc._id.toString(),
    });
    console.log(`🗑️ Deleted art "${doc._id}" from Elasticsearch`);
  } catch (err) {
    console.error(`❌ Error deleting art "${doc._id}" from Elasticsearch:`, err);
  }
}

artSchema.post("save", indexArtInElasticsearch);
artSchema.post("findOneAndUpdate", updateArtInElasticsearch);
artSchema.post("findOneAndDelete", deleteArtFromElasticsearch);

export const Art = mongoose.model("Art", artSchema);
