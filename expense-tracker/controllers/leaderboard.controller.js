const User = require("../models/User");
const Expense = require("../models/Expense");
const sequelize = require("../config/db");

const getLeaderboard = async (req, res) => {
    try {

        // Get the currently logged-in user's ID
        const userId = req.user.id;

        // Find the user in the database
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

            // Get the user's name
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
            ],

            // One group for each user
            group: [
                "userId",
                "User.id",
                "User.name",
            ],

            // Highest expense first
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
        console.error("Leaderboard Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getLeaderboard,
};