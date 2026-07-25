const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.url === '/') {
    res.setHeader('Content-type', 'text/html');
    
    // Read the file first before sending the HTML response
    fs.readFile("formvalue.txt", (err, data) => {
      let message = "";
      if (!err && data) {
        message = `<p><strong>Message:</strong> ${data.toString()}</p>`;
      }

      res.end(
        `${message}
        <form action="/message" method="POST">
        <label>Home:</label>
        <input type="text" name="username"></input>
        <button type="submit">Add</button>
        </form>`
      );
    });
  } 
  else {
    if (req.url === '/message') {
      res.setHeader('Content-type', 'text/html');
      let datachunks = [];
      
      req.on('data', (chunks) => {
        console.log(chunks);
        datachunks.push(chunks);
      });
      
      req.on('end', () => {
        let combined = Buffer.concat(datachunks);
        console.log(combined.toString());
        
        let value = combined.toString().split("=")[1]; 
        let decodedValue = decodeURIComponent(value.replace(/\+/g, ' ')); // Fix spaces/symbols
        
        console.log(decodedValue);
        
        fs.writeFile("formvalue.txt", decodedValue, (err) => {
          res.statusCode = 302; 
          res.setHeader("Location", '/');
          res.end();
        });
      });
    } 
    else {
    
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
});

server.listen(port, () => {
  console.log(`server is listing at ${port}`);
});
