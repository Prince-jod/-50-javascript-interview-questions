const db=require('../utils/db-connection');

const addEntries=(req,res)=>{
const [email,name]=req.body; // taking data my body
const insertquery=`INSERT INTO (email,name) VALUE (?,?)`;
db.execute(insertquery,[email,name],(err)=>{
  console.log(err);
  connection.end();
  return;
})
}
module.exports={
  addEntries,
}