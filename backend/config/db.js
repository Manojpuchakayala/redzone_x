const mongoose = require("mongoose");

let isConnected = false;
let dbMode = "LOCAL_EMBEDDED";

async function connectDB() {
  const rawUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/redzone_x";

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    dbMode = "MONGODB_LIVE";
    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    dbMode = "LOCAL_PERSISTENT_MEMORY";
    console.warn(`⚠️ Live MongoDB service notice: ${error.message}. Running in resilient memory mode.`);
  }

  return { isConnected, dbMode };
}

module.exports = { connectDB, getStatus: () => ({ isConnected, dbMode }) };
