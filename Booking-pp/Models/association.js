const User = require("../models/User");
const Aadhaar = require("../models/Aadhaarid");

// One User has One Aadhaar
User.hasOne(Aadhaar, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// One Aadhaar belongs to One User
Aadhaar.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  User,
  Aadhaar,
};