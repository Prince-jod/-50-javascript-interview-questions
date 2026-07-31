const Bus = require("../models/busModel");
const { Op } = require("sequelize");

// POST
exports.addBus = async (req, res) => {
    try {
        const bus = await Bus.create(req.body);
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET
exports.getAvailableBuses = async (req, res) => {
    try {
        const seats = req.params.seats;

        const buses = await Bus.findAll({
            where: {
                availableSeats: {
                    [Op.gt]: seats
                }
            }
        });

        res.json(buses);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};