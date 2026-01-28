import express from "express";
import User from "../models/user.model.js";
import foodPartner  from "../models/foodPartner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadFile } from "../services/storage.service.js";

//user register controller
export const registerUser = async (req, res) => {
  const { fullName, email, phoneNumber,password } = req.body;
  const isUserAlreadyExsits = await User.findOne({
    email,
  });
  if (isUserAlreadyExsits) {
    return res.status(400).json({
      message: "User already exsits",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName: fullName,
    email: email,
    phoneNumber:phoneNumber,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );
  res.cookie("token", token);

  res.status(201).json({
    message: "User generated successfully",
    user: {
      fullName: fullName,
      email: email,
    },
  });
};

//user login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Inavlid email or password",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Inavlid email or password",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "LoggedIn successfully",
    user: {
      fullName: user.fullName,
      email: email,
    },
  });
};

//user logout controller
export const logoutUser=async(req,res)=>{
    res.clearCookie("token", { path: '/' });
    res.status(200).json({
        message:"LoggedOut successfully"
    })
}

//foodpartner register controller
export const registerFoodPartner = async (req, res) => {
  const {
    ownerName,
    restaurantName,
    phoneNumber,
    restaurantAddress,
    email,
    password
  } = req.body;

  const isAccountExist = await foodPartner.findOne({ email });
  if (isAccountExist) {
    return res.status(400).json({
      message: "Food partner already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let profilePicUrl = "";
  if (req.file) {
    try {
      const uploadResult = await uploadFile(req.file.buffer, `pfp_${Date.now()}_${req.file.originalname}`);
      profilePicUrl = uploadResult.url;
    } catch (uploadError) {
      console.error("Profile picture upload failed:", uploadError);
      // We continue registration even if pfp fails, or we could return error
    }
  }

  const foodpartner = await foodPartner.create({
    ownerName,
    email,
    restaurantName,
    restaurantAddress,
    phoneNumber,
    password: hashedPassword,
    profilePic: profilePicUrl
  });

  const token = jwt.sign(
    { id: foodpartner._id },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "Food Partner successfully registered",
    foodpartner: {
      _id: foodpartner._id,
      ownerName: foodpartner.ownerName,
      email: foodpartner.email
    }
  });
};


//food partner login controller
export const loginFoodPartner=async(req,res)=>{
  const{email,password}=req.body

  const foodpartner=await foodPartner.findOne({email})

  if(!foodpartner){
    return res.status(400).json({
      message:"User doesn't exist"
    })
  }
  const isPasswordValid=await bcrypt.compare(password,foodpartner.password)

  if(!isPasswordValid){
    return res.status(400).json({
      message:"Invalid password"
    })
  }
  const token=jwt.sign({
    id:foodpartner._id
  },process.env.JWT_SECRET)

  res.cookie("token",token)

  res.status(201).json({
    message:"Food Partner logged In successfully",
    foodpartner: {
      _id: foodpartner._id,
      ownerName: foodpartner.ownerName,
      email: email,
      profilePic: foodpartner.profilePic
    },
  })
}

export const logoutFoodPartner=async(req,res)=>{
  res.clearCookie("token", { path: '/' });
    res.status(200).json({
        message:"LoggedOut successfully"
    })
}