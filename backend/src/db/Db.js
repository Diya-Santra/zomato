import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDb=async(dbUrl)=>{
    await mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Mongodb is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};


export default connectDb