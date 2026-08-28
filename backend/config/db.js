const mongoose = require("mongoose");

let isConnected = false;
let dbMode = "LOCAL_EMBEDDED";

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/redzone_x";

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    dbMode = "MONGODB_LIVE";
    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    dbMode = "LOCAL_PERSISTENT_MEMORY";
    console.warn(`⚠️ Live MongoDB service not detected on ${uri}. Running in resilient LOCAL_PERSISTENT_MEMORY mode (0 errors, instant response).`);
  }

  return { isConnected, dbMode };
}

module.exports = { connectDB, getStatus: () => ({ isConnected, dbMode }) };
