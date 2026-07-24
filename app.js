const http=require('http');
const port=3000;
const server=http.createServer((req,res)=>{
 console.log("server is created");
 res.setHeaders('Content-type','text/html');
 if(req.url=='/'){
  res.statusCode=200;//ok
  res.end("Home page");
 }
 else{
  if(req.url=='/task'){
    res.statusCode=200;//ok
    res.end("this is the task page ")
  }
  else{
    res.statusCode=404;//ok
    res.end("not found the page");
  }
 }
})
server.listen(port,()=>{
  console.log(`server is listing at ${port}`);
})