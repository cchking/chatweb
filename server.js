const express = require('express');
var fs = require("fs");
var path = require("path");
const http = require("http");
const Gun = require('gun');
const app = express();
// const port = Math.floor(Math.random() * (3000 - 6001) + 6001)
var { PORT = 8080, NODE_ENV } = process.env;

app.use(Gun.serve)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(function(request, response) {
  //console.log("request starting...");
  if (Gun.serve(request, response)) {//get gun.js ex. <script src="/gun.js">
    return;
  } // filters gun requests!
  //handle files as public folder
  var filePath = "." + request.url;
  if (filePath === "./") filePath = "./index.html";

  var extname = path.extname(filePath);
  var contentType = "text/html";

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code === "ENOENT") {
        fs.readFile("./404.html", function(error, content) {
          response.writeHead(200, { "Content-Type": contentType });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        response.end();
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
});

server.listen(PORT, err => {
  if (err) throw err;
  //console.log(app);
  console.log(`> Running on http://localhost:`+PORT);
});

var gun = Gun({
  file: "data",
  //web:app.server //server
  web: server
});