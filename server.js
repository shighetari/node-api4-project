const express = require('express');
const userRouter = require("./users/userRouter")
const server = express();

// global middlware - applies to every request
server.use(express.json()); // built-in middleware, no need to npm install
server.use(logger) //applying the logger function middleware to the que so it runs on every req made to the API
//start of routing
server.use("/api/users", userRouter)

server.get('/', (req, res) => {
  const message = process.env.MESSAGE
  res.send(`<h2>${message}</h2>`);
});
//custom middleware
//https://learn.lambdaschool.com/web4node/module/recCJjYFEz0i5O5p5/#guided-project
function logger(req, res, next) { 
  let origin = req.get('host')
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from`, origin
  );
  next();
}


module.exports = server;
