const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URL } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};