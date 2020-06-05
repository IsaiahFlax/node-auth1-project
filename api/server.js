const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const restricted = require("../auth/restricted-middleware");
const knexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");
const server = express();

const sessionConfig = {

  name: "this is the session name",
  secret:
    process.env.SECRETS ||
    "I am nothing more than a man, and yet I am everything.",
  cookie: {
    //miliseconds
    maxAge: 3600 * 1000,
    secure: false, //should be true in production
    httpOnly: true //Only thing that can access this is html
  },
  resave: false, //don't want to resave data in db
  saveUninitialized: false, //gdpr -> need permission to save cookie. Can't automatically

  store: new knexSessionStore({
    knex: require("../database/dbConfig.js"),
    //which table contains session data
    tablename: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 3600 * 1000
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
//session takes a config obj
// if (process.env.WHERE === "prod") {
//   sessionConfig.cookie.secure = true;
//   server.use(session(sessionConfig));
// } else {
//   server.use(session(sessionConfig));
// }
server.use(session(sessionConfig));
server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;