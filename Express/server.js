const express=require("express");
const server=express();
const port=8000;
server.listen(port,()=>{
  console.log("Server is up and running on port 3000! Ready to handle requests.")
});
