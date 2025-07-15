import userModel from '../models/userModel.js';
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// GENERATE TOKEN JWT 
const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn : '7d'})
}

export const registerUser =async (req,res)=>{
    try{
        const { name, email, password } = req.body;

        // CHECK IF USER ALREADY EXISTS
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // PASSWORD LENGTH VALIDATION
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // HASHING PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // CREATE A USER
        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    }catch(error){
        res.status(500).json({
            massage:"Server Error",
            error: error.massage
        })
    }

}

// LOGIN FUNCTION
export const loginUser =async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(500).json({massage:"Invalid email or Password"})
        }
        // COMPARE THE PASSWORD
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(500).json({massage:"Invalid email or Password"})
        }
         res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            token: generateToken(user._id)
         })
    }catch(error){
        res.status(500).json({
            massage:"Server Error",
            error: error.massage
        })
    }
}

// GET USER PROFILE 
export const getUserprofile=async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(400).json({massage:"User not Found"})
        }
        res.json(user)
    } catch(error){
        res.status(500).json({
            massage:"Server Error",
            error: error.massage
        })
    }
}