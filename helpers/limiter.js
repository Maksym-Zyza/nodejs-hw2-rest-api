const rateLimit = require("express-rate-limit");
const { HttpCode } = require("./const");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit 100 requests
  handler: (req, res) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = limiter;
