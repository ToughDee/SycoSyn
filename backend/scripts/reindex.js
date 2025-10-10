// scripts/reindex.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Art } from "../src/models/art.models.js";
import connectDB from "../src/db/index.js";
import { esClient, ensureArtsIndex } from "../src/utils/elasticsearch.js";

dotenv.config();

const reindex = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 🧭 Ensure ES index exists
    await ensureArtsIndex();

    // 🖼 Fetch all arts
    const arts = await Art.find();
    console.log(`📦 Found ${arts.length} arts to index`);

    if (arts.length === 0) {
      console.log("⚠️ No arts found, nothing to index");
      process.exit(0);
    }

    // 🧩 Build bulk body
    const bulkBody = arts.flatMap((art) => [
      { index: { _index: "arts", _id: art._id.toString() } },
      {
        name: art.name,
        caption: art.caption,
        content: art.content,
        tags: art.tags,
        owner: art.owner?.toString(),
        likes: art.likes || 0,
        views: art.views || 0,
        createdAt: art.createdAt,
      },
    ]);

    // 🌀 Send to Elasticsearch
    const { errors } = await esClient.bulk({ refresh: true, body: bulkBody });

    if (errors) {
      console.error("❌ Some documents failed to index in Elasticsearch");
    } else {
      console.log(`✅ Successfully indexed ${arts.length} arts`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error reindexing:", error);
    process.exit(1);
  }
};

reindex();
