const db=require('mysql2');

const addEntries=(req,res)=>{
const [email,name]=req.body; // taking data my body
const insertquery=`INSERT INTO (email,name) VALUE (?,?)`;

}
module.exports={
  addEntries,
}