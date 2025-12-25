import mongoose from "mongoose";

const foodPartnerSchema=new mongoose.Schema({
    ownerName:{
        type:String,
        required:true
    },
    resturantName:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    resturantAddress:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    }
})

const foodPartner=new mongoose.model("foodPartner",foodPartnerSchema)

export default foodPartner