const courses = [

{ id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },

{ id: 2, name: "Backend", description: "Node.js, Express, MongoDB" }

];

const getProduct=(req,res)=>{
  res.json(courses);
}
module.exports=getProduct;