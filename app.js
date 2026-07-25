const http=require('http');
const fs=require('fs');
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
    res.setHeader('Content-type','text/html');
    let datachunks=[];
    req.on('data',(chunks)=>{
      console.log(chunks);
      datachunks.push(chunks);
    })
    req.on('end',()=>{
      let combined=Buffer.concat(datachunks);
      console.log(combined.toString());
      let value=combined.toString().split("=");
      console.log(value);
      fs.writeFile("formvalue.txt",value,(err)=>{
        res.statusCode(302) //for the redirect 
        res.setHeader("location",'/');
        res.end();
      })
    })
  }
}
})

server.listen(port,()=>{
  console.log(`server is listing at ${port}`);
})