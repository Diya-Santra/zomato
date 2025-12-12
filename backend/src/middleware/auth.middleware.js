import foodPartner from "../models/foodPartner.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authFoodPartnerMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Please Login or first",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodpartner = await foodPartner.findById(decoded.id);

    req.foodpartner = foodpartner;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid",
    });
  }
};

export const autheUserMiddleware=async(req,res,next)=>{
    const token=req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Please login"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const user=await User.findById(decoded.id)

        req.user=user

        next()
    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}
