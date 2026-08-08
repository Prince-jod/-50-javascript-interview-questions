const Order = require("../models/Order");
const cashfree = require("../config/cashfree");
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const amount = 299;

    // 1. Create our database order
    const order = await Order.create({
      orderId: `ORDER_${Date.now()}`,
      userId: userId,
      amount: amount,
      status: "PENDING",
    });

    // 2. Create the order on Cashfree
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: order.orderId,

      customer_details: {
        customer_id: String(userId),
        customer_phone: req.user.phone || "9999999999",
      },

      order_meta: {
        return_url:
          `http://localhost:3000/payment-success.html?order_id={order_id}`,
      },
    };

    const response = await cashfree.PGCreateOrder(request);

    console.log("Cashfree order:", response.data);

    res.status(201).json({
      message: "Cashfree order created successfully",

      orderId: order.orderId,

      paymentSessionId: response.data.payment_session_id,
    });

  } catch (error) {
    console.error(
      "Cashfree order error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to create Cashfree order",
    });
  }
};

module.exports = {
  createOrder,
};