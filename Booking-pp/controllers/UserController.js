const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await user.update(req.body);

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser

};