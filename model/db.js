const mongoose = require("mongoose");

require("dotenv").config();
const uriDb = process.env.URI_DB;

// Підключення БД
const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5, // кількість можливих одночасних підключень
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Переривання виконання серверного скрипта
process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Disocnnect MongoDB");
    process.exit();
  });
});

module.exports = db;
