import jwt from "jsonwebtoken";
import foodPartner from "../models/foodPartner.model.js";
import User from "../models/user.model.js";

export const authFoodPartnerMiddleware = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      message: "Please Login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodpartner = await foodPartner.findById(decoded.id);


    if (!foodpartner) {
      return res.status(401).json({
        message: "Invalid food partner token",
      });
    }

    req.foodpartner = foodpartner;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid",
    });
  }
};

export const autheUserMiddleware = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Please login",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
