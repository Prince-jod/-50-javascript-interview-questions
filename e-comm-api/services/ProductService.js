// services/productService.js

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" }
];

// Get all products
const getAllProducts = () => {
  return products;
};

// Get product by ID
const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

// Add new product
const addProduct = (product) => {
  products.push(product);
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
};