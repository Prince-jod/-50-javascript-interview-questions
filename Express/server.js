const express = require("express");

const server = express();
const port = 8000;
server.get("/", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send("<h1>Hello Express</h1>");
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}! Ready to handle requests.`);
});