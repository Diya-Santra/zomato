import foodItem from "../models/foodItem.model.js";
import foodPartner from "../models/foodPartner.model.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

//create food
export const createFood = async (req, res) => {
  const fileUploadResult = await uploadFile(req.file.buffer, uuid());
  const foodItems = await foodItem.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    // foodpartner: req.foodpartner._id
  });

  res.status(201).json({
    message: "food created successfully",
    foodItems: foodItems,
  });
};

//getting food
export const getFood=async(req,res)=>{
    const foodItems=await foodItem.find({})
    res.status(200).json({
        message:"Food items fetched successfully",
        foodItems
    })
}