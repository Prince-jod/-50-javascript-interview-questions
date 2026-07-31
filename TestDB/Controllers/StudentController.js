const db=require('../utils/db-connection');

const addEntries=(req,res)=>{
const {id,name,dept_id}=req.body; // taking data my body
const insertquery=`INSERT INTO buses VALUE (?,?,?)`;
db.execute(insertquery,[id,name,dept_id],(err)=>{
  if(err){
  db.end();
  return;
  }
 res.status(201).json({
    message: "Inserted successfully"
});

})
}
module.exports={
  addEntries,
} 