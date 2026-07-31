const express = require("express");
const router = express.Router();

const {
    addUser,
    getUsers
} = require("../controllers/userController");

router.post("/", addUser);
router.get("/", getUsers);

module.exports = router;