require("dotenv").config();
const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const {
  getComments,
  postComments,
  checkLogin,
  deleteComment,
  loginUser,
  registerUser,
  voteComment,
} = require("./functions");

const cors = corsMiddleware({
  origins: ["http://localhost:3000", "http://web.myapp.com"],
});

const srv = restify.createServer({
  name: "Licom",
  version: "1.0.0",
});

srv.pre(cors.preflight);
srv.use(cors.actual);
srv.use(restify.plugins.acceptParser(srv.acceptable));
srv.use(restify.plugins.queryParser());
srv.use(restify.plugins.bodyParser());

srv.post("/api/checklogin", async (req, res, next) => {
  checkLogin(req, res, next);
});

// srv.post("/api/auth", (req, res, next) => {
//   authUser(req, res, next);
// });

srv.post("/api/register", (req, res, next) => {
  registerUser(req, res, next);
});

srv.post("/api/login", (req, res, next) => {
  loginUser(req, res, next);
});

srv.post("/api/getcomments", async (req, res, next) => {
  getComments(req, res, next);
});

srv.post("/api/comment", async (req, res, next) => {
  postComments(req, res, next);
});

srv.del("/api/comment", async (req, res, next) => {
  deleteComment(req, res, next);
});

srv.post("/api/vote", async (req, res, next) => {
  voteComment(req, res, next);
});

srv.listen(5000, function () {
  //   console.log("%s listening at %s", srv.name, srv.url);
});
