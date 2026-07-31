const addEntries = (req, res) => {
    console.log("1. Controller reached");

    const { id, name, dept_id } = req.body;

    const insertQuery = "INSERT INTO employees VALUES (?, ?, ?)";

    db.execute(insertQuery, [id, name, dept_id], (err, result) => {
        console.log("2. Query callback reached");

        if (err) {
            console.log("3. Query failed:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("4. Query executed successfully");
        console.log(result);

        res.status(201).json({
            message: "Inserted successfully"
        });
    });
};