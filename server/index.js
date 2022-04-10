require("dotenv").config();
const restify = require("restify");
const cors = require("cors");
// const { prisma } = require("./datebase");

const srv = restify.createServer({
  name: "Licom",
  version: "1.0.0",
});

srv.use(cors());
srv.use(restify.plugins.acceptParser(srv.acceptable));
srv.use(restify.plugins.queryParser());
srv.use(restify.plugins.bodyParser());

srv.get("/echo/:name", function (req, res, next) {
  res.send(req.params);
  return next();
});

srv.listen(5000, function () {
  //   console.log("%s listening at %s", srv.name, srv.url);
});
