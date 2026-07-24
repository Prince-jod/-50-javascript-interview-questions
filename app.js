const http=require('http');
const port=3000;
const server=http.createServer((req,res)=>{
 console.log("server is created");
})
server.listen(port,()=>{
  console.log(`server is listing at ${port}`);
})