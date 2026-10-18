const jwt = require("jsonwebtoken");

const generateAccessToken = (userId,role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const generateRefreshToken = (userId)=>{
    return jwt.sign(
        {
            userId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"7d"
        }
    )
}

const verifyAccessToken  = (token)=>{
  return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (token)=>{
  return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
