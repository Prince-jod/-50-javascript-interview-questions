const express = require("express");

const app = express();
const PORT = 4000;

const userRoutes = require("./routers/userRoutes");
const productRoutes = require("./routers/productRoutes");
const cartRoutes = require("./routers/cartRoutes");

app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});