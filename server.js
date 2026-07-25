const http = require('http');

const port = 3000;
const routes=require('./routes');
const server = http.createServer(routes.requestHandler);

server.listen(port, () => {
  console.log(`server is listing at ${port}`);
});
