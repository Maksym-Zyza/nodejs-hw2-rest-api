const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const boolParser = require("express-query-boolean");
const helmet = require("helmet");
const limiter = require("./helpers/limiter");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet()); // Захист заголовків

// Статика AVATAR (в папці image перетворення в статичний ресурс)
require("dotenv").config();
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)));

app.use(limiter); // Захист від Ddos атак
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 15000 }));
app.use(boolParser());

// Підключаєм роут
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res
    .status(404)
    .json({ status: "error", code: 404, message: "Not found URL" });
});

app.use((err, req, res, next) => {
  const code = err.status || 500;
  const status = err.status ? "error" : "fail";
  res.status(code).json({ status, code, message: err.message });
});

module.exports = app;
