import foodPartner from "../models/foodPartner.model.js";
import foodItem from "../models/foodItem.model.js";
import Like from "../models/likes.model.js";
import Save from "../models/save.model.js";
import jwt from "jsonwebtoken";

export const getFoodPartnerById = async (req, res) => {
    const foodPartnerId = req.params.id;
    const foundPartner = await foodPartner.findById(foodPartnerId);
    let foodItemsByFoodPartner = await foodItem.find({ foodPartner: foodPartnerId });

    if (!foundPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    // Check if user is logged in to provide like/save status
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    let userId = null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            // Token invalid, proceed as guest
        }
    }

    if (userId) {
        const likedFoodIds = (await Like.find({ user: userId, food: { $in: foodItemsByFoodPartner.map(f => f._id) } })).map(l => l.food.toString());
        const savedFoodIds = (await Save.find({ user: userId, food: { $in: foodItemsByFoodPartner.map(f => f._id) } })).map(s => s.food.toString());

        foodItemsByFoodPartner = foodItemsByFoodPartner.map(item => ({
            ...item.toObject(),
            isLiked: likedFoodIds.includes(item._id.toString()),
            isSaved: savedFoodIds.includes(item._id.toString())
        }));
    } else {
        foodItemsByFoodPartner = foodItemsByFoodPartner.map(item => ({
            ...item.toObject(),
            isLiked: false,
            isSaved: false
        }));
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foundPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    });
};
