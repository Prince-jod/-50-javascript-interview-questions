const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../config/db");

const getLeaderboard = async (req, res) => {
    try {

        // The logged-in user comes from JWT
        const userId = req.user.id;

        // Check logged-in user
        const user = await User.findByPk(userId);

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

        // Get total expenses for every user
        const leaderboard = await Expense.findAll({

            attributes: [
                "userId",

                [
                    sequelize.fn(
                        "SUM",
                        sequelize.col("amount")
                    ),
                    "totalExpense",
                ],
            ],

            include: [
                {
                    model: User,
                    attributes: ["id", "name"],
                },
            ],

            // Group expenses user-wise
            group: [
                "Expense.userId",
                "User.id",
                "User.name",
            ],

            // Highest total expense first
            order: [
                [
                    sequelize.literal("totalExpense"),
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