const http=require('http');
const port=3000;
const server=http.createServer((req,res)=>{
 console.log(`${req.method} ${req.url}`);
 res.setHeader('Content-type','text/html');
if(req.url==='/'){
  res.setHeader('Content-type','text/html');
  res.end(
    `<form action="/message" method="POST">
    <label>Home:</label>
    <input type="text" name="username"></input>
    <button type="submit">Add</button>


    </form>
    `
  )
}
else{
  if(req.url==='/message'){
    res.end("you are on message route");
  }
}
})
server.listen(port,()=>{
  console.log(`server is listing at ${port}`);
})