const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const amount = 299;

    const order = await Order.create({
      orderId: `ORDER_${Date.now()}`,
      userId: userId,
      amount: amount,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

module.exports = {
  createOrder,
};