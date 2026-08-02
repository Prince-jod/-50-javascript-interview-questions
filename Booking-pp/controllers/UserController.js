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

const GetUser=async (req,res)=>{
  try{
    const users= await  User.findAll();

    res.json(users);
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = {
    createUser
};