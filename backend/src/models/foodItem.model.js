import mongoose, { mongo } from "mongoose";
import foodPartner from "./foodPartner.model.js";


const foodItemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodpartner"
    }
})

const foodItem=new mongoose.model("foodItem",foodItemSchema)

export default foodItem