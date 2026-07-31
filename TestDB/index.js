const express = require('express');
const app = express();

const db=require('./utils/db-connection')
const studentRoutes=require('./Routers/StudentRoutes');
const port = 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Database Connected Successfully");
});
app.use('/students',studentRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});