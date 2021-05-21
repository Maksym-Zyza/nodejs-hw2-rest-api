const passport = require("passport");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Users = require("../model/users");

// Паспорт для guard
const { Strategy, ExtractJwt } = require("passport-jwt");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // пошук (Bearer JWT_TOKEN)
  secretOrKey: JWT_SECRET_KEY, // розшифровка
};

passport.use(
  // Стратегия
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error("User not found", false));
      }

      if (!user.token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);
