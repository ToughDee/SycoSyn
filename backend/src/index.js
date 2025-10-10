import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { ensureArtsIndex } from './utils/elasticsearch.js';

dotenv.config({ path: './.env', credentials: true });

const PORT = process.env.PORT || 8001;

async function startServer() {
  try {
    await connectDB();          // wait for MongoDB connection
    await ensureArtsIndex();    // wait for ES index to be ready
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err}`);
  }
}

startServer();
