const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

const initDb = async (callback) => {
  if (database) {
    return callback(null, database);
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    database = client.db();

    console.log("Connected to MongoDB.");

    callback(null, database);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    callback(error);
  }
};

const getDb = () => {
  if (!database) {
    throw new Error("Database is not initialized.");
  }

  return database;
};

module.exports = {
  initDb,
  getDb,
};
