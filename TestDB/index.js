const express = require('express');
const app = express();

const db=require('../utils/db-connection')

const port = 4000;



app.get('/', (req, res) => {
    res.send("Database Connected Successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});