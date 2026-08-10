const Expense = require("../models/Expense");
const User = require("../models/User");
const { Op } = require("sequelize");

const getLeaderboard = async (req, res) => {
    try {

        // Get the logged-in user
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Only premium users can access leaderboard
        if (!user.isPrime) {
            return res.status(403).json({
                message: "Premium membership required",
            });
        }

        // Get leaderboard
        // Same Expense.name = same person
        // All their expenses are added together
        const leaderboard = await Expense.findAll({

            attributes: [
                "name",
                [
                    Expense.sequelize.fn(
                        "SUM",
                        Expense.sequelize.col("amount")
                    ),
                    "totalExpense",
                ],
            ],

            // Ignore empty and whitespace-only names
            where: Expense.sequelize.where(
                Expense.sequelize.fn(
                    "TRIM",
                    Expense.sequelize.col("name")
                ),
                {
                    [Op.ne]: "",
                }
            ),

            // Group same names together
            group: ["name"],

            // Highest expense first
            order: [
                [
                    Expense.sequelize.literal("totalExpense"),
                    "DESC",
                ],
            ],
        });

        return res.status(200).json({
            message: "Leaderboard fetched successfully",
            leaderboard,
        });

    } catch (error) {

        console.error(
            "Leaderboard Error:",
            error
        );

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getLeaderboard,
};