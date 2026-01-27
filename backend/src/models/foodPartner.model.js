import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: ""
  }
});

const foodPartner=new mongoose.model("foodPartner",foodPartnerSchema)

export default foodPartner