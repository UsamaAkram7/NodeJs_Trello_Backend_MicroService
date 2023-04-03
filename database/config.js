const path = require("path");
const mongoose = require("mongoose");
let retries = 0;
const db = mongoose.connection;
const url = "mongodb://127.0.0.1:27017/trellodb";

mongoose.connect(url);

db.on("connecting", function () {
  console.log("connecting to MongoDB...");
});

db.on("error", function (error) {
 // logger.error(`**MongoError** ${error.message}`);
 console.log(error)
  retries += 1;
  mongoose.disconnect();
});

db.on("connected", function () {
  logger.http(`*MONGO DB CONNECTED*`);
});

db.once("open", function () {
  logger.http(`*MONGO DB RUNNING AT HOST*`);
});

db.on("disconnected", function () {
  console.log("MongoDB disconnected!");
  if (retries >= 5) process.exit(1);
  mongoose.connect(url);
});
