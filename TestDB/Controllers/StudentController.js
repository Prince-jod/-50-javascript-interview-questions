const db=require('../utils/db-connection');

const addEntries=(req,res)=>{
const {id,name,dept_id}=req.body; // taking data my body
const insertquery=`INSERT INTO buses VALUE (?,?,?)`;
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
module.exports={
  addEntries,
} 