import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import connectDB from "../db/index.js";
import { User } from "../models/user.models.js";
import { Art } from "../models/art.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

dotenv.config();

// ===== CONFIG =====
const USERS_COUNT = 10;
const IMAGES_FOLDER = path.join(process.cwd(), "seed_images");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 🧹 Clean old data (optional)
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

    // 🖼️ Get all image files
    const imageFiles = fs
      .readdirSync(IMAGES_FOLDER)
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

    if (imageFiles.length === 0) {
      console.log("⚠️ No images found in seed_images folder");
      process.exit(0);
    }

    console.log(`📸 Found ${imageFiles.length} images`);

    // 🎨 Create art entries
    for (const file of imageFiles) {
      const imagePath = path.join(IMAGES_FOLDER, file);
      const fileName = path.parse(file).name; // file name without extension
      const owner = faker.helpers.arrayElement(users);

      // Upload to Cloudinary
      const uploadResult = await uploadOnCloudinary(imagePath);
      if (!uploadResult?.url) {
        console.warn(`⚠️ Failed to upload ${file}`);
        continue;
      }

      // Create art document
      await Art.create({
        owner: owner._id,
        name: fileName,
        content: uploadResult.url,
        caption: "",
        tags: [],
        likes: faker.number.int({ min: 0, max: 500 }),
        views: faker.number.int({ min: 50, max: 2000 }),
        isPublished: true,
      });

      console.log(`✅ Seeded art: ${fileName}`);
    }

    console.log("🌱 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedDB();
