// require session
const session = require("express-session");

// require mongostore
const MongoStore = require("connect-mongo");

// require mongoose
const mongoose = require("mongoose");

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
  app.set("trust proxy", 1);

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        // maxAge: 60000, // 60 * 1000 ms ===ç 1 min
      },
      store: MongoStore.create({
        mongoUrl:
          process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/superProject",
        // The sessions will expire when the cookie expires.
        // If you didn’t set maxAge property on a cookie, then the expiration date will be determined by ttl
        // ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
