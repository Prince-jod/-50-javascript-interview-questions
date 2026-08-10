const Expense = require("../models/Expense");
const User = require("../models/User");
const { Op } = require("sequelize");

const getLeaderboard = async (req, res) => {
    try {

        // Check the logged-in user
        const user = await User.findByPk(req.user.id);

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

        // Group expenses by the NAME entered in the expense
        // and add all amounts having the same name
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

            // Ignore empty/space-only names
            where: Expense.sequelize.where(
                Expense.sequelize.fn(
                    "TRIM",
                    Expense.sequelize.col("name")
                ),
                {
                    [Op.ne]: "",
                }
            ),

            // Same name = same leaderboard entry
            group: ["name"],

            // Highest total first
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