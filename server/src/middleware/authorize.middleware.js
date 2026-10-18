const authorize = (...roles) =>{
    try {
        return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"You are not authorize this"
            })
        }

        next();
    }
    } catch (error) {
        console.error("authorize error :", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

module.exports =authorize;