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

    // await User.deleteMany({});
    // await Art.deleteMany({});
    // console.log("Old users and arts removed.");

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

// seed.js
// import dotenv from "dotenv";
// import { faker } from "@faker-js/faker";
// import connectDB from "../db/index.js";
// import { User } from "../models/user.models.js";
// import { Art } from "../models/art.models.js";
// import mongoose from "mongoose";

// dotenv.config();

// const categories = ["Painting", "Photography", "Writing"];

// const imageSources = {
//   Painting: [
//     "https://images.unsplash.com/photo-1526318472351-bc6c2b8b0d52",
//     "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
//     "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0",
//     "https://images.unsplash.com/photo-1556745757-8d76bdb6984b",
//   ],
//   Photography: [
//     "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
//     "https://images.unsplash.com/photo-1473187983305-f615310e7daa",
//     "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
//   ],
//   Writing: [
//     "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
//     "https://images.unsplash.com/photo-1519681393784-d120267933ba",
//     "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5",
//     "https://images.unsplash.com/photo-1517976487492-5750f3195933",
//   ],
// };

// const seedDB = async () => {
//   try {
//     await connectDB();

//     // await User.deleteMany({});
//     // await Art.deleteMany({});
//     // console.log("🧹 Old users and arts removed.");

//     const users = [];

//     // Create fake users
//     for (let i = 0; i < 15; i++) {
//       const firstName = faker.person.firstName();
//       const lastName = faker.person.lastName();

//       const user = await User.create({
//         username: faker.internet.username({ firstName, lastName }).toLowerCase(),
//         email: faker.internet.email({ firstName, lastName }),
//         password: "password123",
//         avatar: faker.image.avatar(),
//         fullname: `${firstName} ${lastName}`,
//       });

//       users.push(user);
//     }

//     // Create arts
//     for (const user of users) {
//       const numArts = faker.number.int({ min: 6, max: 12 });

//       for (let i = 0; i < numArts; i++) {
//         const category = faker.helpers.arrayElement(categories);
//         const imageUrl = faker.helpers.arrayElement(imageSources[category]);

//         const tags = [category.toLowerCase(), faker.word.noun(), faker.word.adjective()];

//         await Art.create({
//           owner: user._id,
//           name: `${faker.commerce.productName()} (${category})`,
//           content: imageUrl,
//           caption: faker.lorem.sentence(),
//           tags,
//           likes: faker.number.int({ min: 0, max: 500 }),
//           views: faker.number.int({ min: 100, max: 2000 }),
//           isPublished: true,
//         });
//       }
//     }

//     console.log("🌱 Seeding complete!");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Seeding error:", err);
//     process.exit(1);
//   }
// };

// seedDB();
