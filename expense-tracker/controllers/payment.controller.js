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
    customer_phone: "9999999999",
  },

  order_meta: {
    return_url:
      "http://localhost:3000/payment-success.html?order_id={order_id}",
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
const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
            });
        }

        // Find our order
        const order = await Order.findOne({
            where: {
                orderId: orderId,
                userId: req.user.id,
            },
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Ask Cashfree for the payment status
        const response =
            await cashfree.PGOrderFetchPayments(orderId);

        console.log(
            "Cashfree payment response:",
            response.data
        );

        const payments = response.data;

        // Check whether any payment was successful
        const successfulPayment = payments.find(
            (payment) =>
                payment.payment_status === "SUCCESS"
        );

        if (successfulPayment) {

            // Update our order
            order.status = "SUCCESSFUL";
            await order.save();

            // Make user premium
            const user = await User.findByPk(req.user.id);

            user.isPrime = true;
            await user.save();

            return res.status(200).json({
                message: "Transaction successful",
                status: "SUCCESSFUL",
            });
        }

        // If payment exists but wasn't successful
        order.status = "FAILED";
        await order.save();

        return res.status(200).json({
            message: "TRANSACTION FAILED",
            status: "FAILED",
        });

    } catch (error) {

        console.error(
            "Payment verification error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Unable to verify payment",
        });
    }
};

module.exports = {
  createOrder,
  verifyPayment,
};