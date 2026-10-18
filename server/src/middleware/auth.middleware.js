const userModel = require("../models/user.model.js");
const jwttoken =  require("../utils/jwt.js")

const authMiddleware = async (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Access Token is required"
            })
        }

        const accessToken  = authHeader.split(" ")[1];

        const decoded = jwttoken.verifyAccessToken(accessToken);
        const user = await userModel.findById(decoded.userId);
        if(!user){
            return res.status(402).json({
                success:false,
                message:"User not found"
            })
        }

        if(!user.isActive){
            return res.status(401).json({
                success:false,
                message:"this acount is blocked"
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("authMiddleware error :", error);

        return res.status(401).json({
            success:false,
            message:"Unauthorized "
        })
    }
}

module.exports = authMiddleware;