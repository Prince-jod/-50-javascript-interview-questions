// controllers/productController.js

const productService = require("../services/productService");

// GET /products
const getProducts = (req, res) => {
  const products = productService.getAllProducts();

  res.json({
    message: "Fetching all products",
    data: products,
  });
};

// GET /products/:id
const getProduct = (req, res) => {
  const id = parseInt(req.params.id);

  const product = productService.getProductById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json({
    message: `Fetching product with ID: ${id}`,
    data: product,
  });
};

// POST /products
const createProduct = (req, res) => {
  const product = productService.addProduct(req.body);

  res.status(201).json({
    message: "Adding a new product",
    data: product,
  });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};