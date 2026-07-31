const db=require('../utils/db-connection');
const addEntries=(req,res)=>{
const {id,name,dept_id}=req.body; // taking data my body
const insertquery=`INSERT INTO employees VALUE (?,?,?)`;
db.execute(insertquery,[id,name,dept_id],(err)=>{
if (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
}
 res.status(201).json({
    message: "Inserted successfully"
});

})

}
const updateEntry=(req,res)=>{
  const {id}=req.params;
  const {name,dept_id}=req.body

  const updatequery=`update employees set name=? where id =?`;

db.execute(updatequery,[id,name,dept_id],(err,result)=>{
 if(err){
  console.log(err.message);
  res.status(500).send(err.message)
  db.end();
  return;
 }
 if(result.affectedRows===0){
  res.status(404).send("student not found");
 }
 res.status(200).send("updatetd");
 
})
}
module.exports={
  addEntries,
  updateEntry
} 