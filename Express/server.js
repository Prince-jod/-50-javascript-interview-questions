const express = require("express");

const app = express();
const port = 8000;
app.use((req,res,next)=>{
  req.user="guest";
  next();
})
app.get("/", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<h1>${req.user}</h1>`);
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}! Ready to handle requests.`);
});