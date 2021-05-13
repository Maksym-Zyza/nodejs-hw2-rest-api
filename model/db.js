const { MongoClient } = require("mongodb");
require("dotenv").config();
const uriDb = process.env.URI_DB;

// Підключення БД
const db = MongoClient.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5, // кількість можливих одночасних підключень
});

// Переривання виконання серверного скрипта
process.on("SIGINT", async () => {
  const client = await db;
  client.close();
  console.log("Disocnnect MongoDB");
  process.exit();
});

module.exports = db;
