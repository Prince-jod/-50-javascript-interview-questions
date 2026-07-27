exports.getAllProducts = (req, res) => {
    res.send("Fetching all products");
};

exports.addProduct = (req, res) => {
    res.send("Adding a new product");
};

exports.getProductById = (req, res) => {
    const id = req.params.id;
    res.send(`Fetching product with ID: ${id}`);
};