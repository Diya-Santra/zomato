import foodItem from "../models/foodItem.model.js";
import foodPartner from "../models/foodPartner.model.js";
import { uploadFile } from "../services/storage.service.js";
import Like from "../models/likes.model.js";
import Save from "../models/save.model.js";
import Comment from "../models/comment.model.js";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

//create food
export const createFood = async (req, res) => {
  const fileUploadResult = await uploadFile(req.file.buffer, uuid());
  const foodItems = await foodItem.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodpartner._id
  });

  res.status(201).json({
    message: "food created successfully",
    foodItems: foodItems,
  });
};

//getting food
export const getFood = async (req, res) => {
  const { search } = req.query;
  let query = {};
  
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };
  }

  let foodItems = await foodItem.find(query).populate("foodPartner");

  // If searching, also include items where the restaurant name matches
  if (search) {
    const restaurantMatches = await foodPartner.find({
      restaurantName: { $regex: search, $options: "i" }
    });
    
    if (restaurantMatches.length > 0) {
      const partnerIds = restaurantMatches.map(p => p._id);
      const partnerFoodItems = await foodItem.find({
        foodPartner: { $in: partnerIds }
      }).populate("foodPartner");
      
      // Combine and remove duplicates based on _id
      const combined = [...foodItems, ...partnerFoodItems];
      foodItems = Array.from(new Map(combined.map(item => [item._id.toString(), item])).values());
    }
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
    const likedFoodIds = (await Like.find({ user: userId, food: { $in: foodItems.map(f => f._id) } })).map(l => l.food.toString());
    const savedFoodIds = (await Save.find({ user: userId, food: { $in: foodItems.map(f => f._id) } })).map(s => s.food.toString());

    foodItems = foodItems.map(item => ({
      ...item.toObject(),
      isLiked: likedFoodIds.includes(item._id.toString()),
      isSaved: savedFoodIds.includes(item._id.toString())
    }));
  } else {
    foodItems = foodItems.map(item => ({
      ...item.toObject(),
      isLiked: false,
      isSaved: false
    }));
  }

  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems
  });
};

export const likeFood = async (req, res) => {
  const { foodId } = req.body
  const user = req.user

  const isLiked = await Like.findOne({
    user: user._id,
    food: foodId
  })
  if (isLiked) {
    await Like.deleteOne({
      user: user._id,
      food: foodId
    })

    await foodItem.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 }
    })

    return res.status(200).json({
      message: "Food unliked successfully"
    })
  }
  const like = await Like.create({
    user: user._id,
    food: foodId

  })
  await foodItem.findByIdAndUpdate(foodId, {
    $inc: { likeCount: 1 }
  })
  res.status(201).json({
    message: "Food liked successfully",
    like
  })
}

export const saveFood = async (req, res) => {
  const { foodId } = req.body
  const user = req.user

  const isSaved = await Save.findOne({
    user: user._id,
    food: foodId
  })

  if (isSaved) {
    await Save.deleteOne({
      user: user._id,
      food: foodId
    })
    return res.status(200).json({
      message: "Food unsaved successfully"
    })
  }

  const save = await Save.create({
    user: user._id,
    food: foodId
  })

  res.status(201).json({
    message: "Food saved successfully",
    save
  })
}

export const addComment = async (req, res) => {
  const { foodId, text } = req.body
  const user = req.user

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" })
  }

  const comment = await Comment.create({
    user: user._id,
    food: foodId,
    text
  })

  res.status(201).json({
    message: "Comment added successfully",
    comment
  })
}

export const getCommentsByFood = async (req, res) => {
  const { foodId } = req.params
  const comments = await Comment.find({ food: foodId }).populate("user", "fullName ownerName")
  
  res.status(200).json({
    message: "Comments fetched successfully",
    comments
  })
}
