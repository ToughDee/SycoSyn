import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import connectDB from "../db/index.js";
import { User } from "../models/user.models.js";
import { Art } from "../models/art.models.js";
import OpenAI from "openai";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // your function

dotenv.config();

const USERS_COUNT = 10;
const IMAGES_FOLDER = path.join(process.cwd(), "seed_images"); // folder with your images
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI tag generation function
async function generateTags(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Generate 3-5 descriptive tags for this image" },
            { type: "input_image", image: imageData.toString("base64") },
          ],
        },
      ],
    });

    const text = response.output_text || "";
    const tags = text
      .split(/,|\n/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);

    return tags.slice(0, 5);
  } catch (err) {
    console.error("❌ Error generating tags for", imagePath, err);
    return [];
  }
}

const seedDB = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // ----- Create users -----
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

    // ----- Read images -----
    const imageFiles = fs
      .readdirSync(IMAGES_FOLDER)
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

    if (!imageFiles.length) {
      console.log("⚠️ No images found in folder");
      process.exit(0);
    }

    console.log(`Found ${imageFiles.length} images to seed`);

    // ----- Create arts -----
    for (const img of imageFiles) {
      const owner = faker.helpers.arrayElement(users);
      const imagePath = path.join(IMAGES_FOLDER, img);

      // 1️⃣ Upload image to Cloudinary
      const uploadResult = await uploadOnCloudinary(imagePath);
      if (!uploadResult?.url) {
        console.warn(`⚠️ Skipping ${img} (upload failed)`);
        continue;
      }

      // 2️⃣ Generate AI tags
      const tags = await generateTags(imagePath);

      // 3️⃣ Save to DB
      await Art.create({
        owner: owner._id,
        name: faker.commerce.productName(),
        content: uploadResult.url, // Cloudinary URL
        caption: faker.lorem.sentence(),
        tags,
        likes: faker.number.int({ min: 0, max: 500 }),
        views: faker.number.int({ min: 100, max: 2000 }),
        isPublished: true,
      });

      console.log(`✅ Added ${img} with tags: ${tags.join(", ")}`);
    }

    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
