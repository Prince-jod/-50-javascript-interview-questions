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
const updateEntry = (req, res) => {
    const { id } = req.params;
    const { name, dept_id } = req.body;

    const updatequery = `
        UPDATE employees
        SET name = ?, dept_id = ?
        WHERE id = ?
    `;

    db.execute(updatequery, [name, dept_id, id], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send(err.message);
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Employee not found");
        }

        res.status(200).send("Updated successfully");
    });
};
module.exports={
  addEntries,
  updateEntry
} 