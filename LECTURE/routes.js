const handler=(req,res)=>{
  if(req.url=='/'){
    res.setHeader('Content-type','text/html');
    res.end(
      `<h1>hello from sharpener</h1>`
    );
  }
}
module.exports={
  handler
}