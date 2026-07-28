const express = require("express");

const app = express();

app.use(express.json());

const productRoutes = require("./routers/productRoutes");
app.use(express.static("public"));

app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});