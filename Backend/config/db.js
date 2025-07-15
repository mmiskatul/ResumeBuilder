import mongoose from "mongoose";
export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://masabimiskat:resume123@cluster0.wxymcf7.mongodb.net/RESUME')
    .then((()=>console.log('DB Connected')))
}