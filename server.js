const http = require('http');
const fs = require('fs');
const port = 3000;
const routes=require('./routes');
const server = http.createServer(routes);

server.listen(port, () => {
  console.log(`server is listing at ${port}`);
});
