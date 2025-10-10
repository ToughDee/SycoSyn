import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import connectDB from "../db/index.js";
import { User } from "../models/user.models.js";
import { Art } from "../models/art.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { esClient, ensureArtsIndex } from "../utils/elasticsearch.js";

dotenv.config();

// ===== CONFIG =====
const USERS_COUNT = 10;
const IMAGE_FOLDERS = [
  "painting",
  "illustration",
  "digital",
  "photography",
  "3d art",
  "writing",
  "sketch",
  "abstract",
  "nature",
  "architecture",
  "people",
  "animals",
];
const BASE_IMAGES_PATH = path.join(process.cwd(), "seed_images");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 🧹 Clear old data
    await Promise.all([User.deleteMany({}), Art.deleteMany({})]);
    console.log("🧹 Cleared existing users and arts");

    // 👤 Create random users
    const users = [];
    for (let i = 0; i < USERS_COUNT; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await User.create({
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        email: faker.internet.email({ firstName, lastName }),
        password: "password123",
        avatar: faker.image.avatar(),
        fullname: `${firstName} ${lastName}`,
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // 🎨 Iterate through each folder
    for (const folderName of IMAGE_FOLDERS) {
      const folderPath = path.join(BASE_IMAGES_PATH, folderName);
      if (!fs.existsSync(folderPath)) {
        console.warn(`⚠️ Folder not found: ${folderName}`);
        continue;
      }

      const imageFiles = fs
        .readdirSync(folderPath)
        .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

      if (!imageFiles.length) {
        console.log(`⚠️ No images found in folder: ${folderName}`);
        continue;
      }

      console.log(`📸 Found ${imageFiles.length} images in "${folderName}"`);

      // 🖼️ Upload images and create Art entries
      for (const file of imageFiles) {
        const imagePath = path.join(folderPath, file);
        const fileName = path.parse(file).name;
        const owner = faker.helpers.arrayElement(users);

        // Upload to Cloudinary
        const uploadResult = await uploadOnCloudinary(imagePath);
        if (!uploadResult?.url) {
          console.warn(`⚠️ Failed to upload ${file}`);
          continue;
        }

        // Create Art with folder tag
        await Art.create({
          owner: owner._id,
          name: fileName,
          content: uploadResult.url,
          caption: "",
          tags: [folderName.toLowerCase()], // folder tag
          likes: faker.number.int({ min: 0, max: 500 }),
          views: faker.number.int({ min: 50, max: 2000 }),
          isPublished: true,
        });

        console.log(`✅ Seeded art: ${fileName} (folder: ${folderName})`);
      }
    }

    // 🧭 Reindex all arts into Elasticsearch
    console.log("\n🔄 Reindexing all arts into Elasticsearch...");
    await ensureArtsIndex();

    const arts = await Art.find();
    if (arts.length === 0) {
      console.log("⚠️ No arts found to index.");
    } else {
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

      const { errors } = await esClient.bulk({ refresh: true, body: bulkBody });
      if (errors) {
        console.error("❌ Some documents failed to index in Elasticsearch");
      } else {
        console.log(`✅ Reindexed ${arts.length} arts into Elasticsearch`);
      }
    }

    console.log("\n🌱 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedDB();
