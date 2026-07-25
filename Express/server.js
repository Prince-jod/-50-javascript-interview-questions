const express = require("express");

const server = express();
const port = 8000;

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}! Ready to handle requests.`);
});