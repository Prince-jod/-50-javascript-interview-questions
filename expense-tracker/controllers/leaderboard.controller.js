const getLeaderboard=async (req,res)=>{
  try{

  }
  catch(error){
    console.error("Leadership Error",error)

    return res.status(500).json({
      message:"Internal server error"
    })
  }
}

module.export={
  getLeaderboard,
}