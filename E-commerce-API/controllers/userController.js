const getAllusers=(req,res)=>{
  res.send("Fetching all users");
}
const addAllProduct=(req,res)=>{
  res.send("Adding new Product");
}
const getProductById=(req,res)=>
{
  const id=req.params.id;
   res.send(`Fetching product with ID: ${id}`);
}
module.exports={
  getAllusers,
  addAllProduct,
  getProductById,
};