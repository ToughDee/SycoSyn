// seed.js
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import connectDB from "../db/index.js"; // import your connectDB
import { User } from "../models/user.models.js";
import { Art } from "../models/art.models.js";
import mongoose from 'mongoose'

dotenv.config();

const categories = ["Painting", "Illustration", "Digital", "Photography", "3D Art"];

const seedDB = async () => {
  try {
    await connectDB()

    await User.deleteMany({});
    await Art.deleteMany({});
    console.log("Old users and arts removed.");

    const users = [];

    for (let i = 0; i < 20; i++) {
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

    for (const user of users) {
      const numArts = faker.number.int({ min: 10, max: 20 });

      for (let i = 0; i < numArts; i++) {
        const category = faker.helpers.arrayElement(categories);

        const randomWidth = 100 + Math.floor(Math.random() * 800);
        const randomHeight = 100 + Math.floor(Math.random() * 800);
        const imageUrl = `https://picsum.photos/${randomWidth}/${randomHeight}?random=${Math.random() * 1000}`;

        await Art.create({
          owner: user._id,
          name: `${faker.commerce.productName()} - ${category}`,
          content: imageUrl,
          caption: faker.lorem.sentence(),
          likes: faker.number.int({ min: 0, max: 100 }),
          views: faker.number.int({ min: 0, max: 1000 }),
          isPublished: true,
        });
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
