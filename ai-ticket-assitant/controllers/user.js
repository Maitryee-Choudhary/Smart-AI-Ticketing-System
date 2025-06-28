import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import {inngest} from "../inngest/client.js"

export const signup = async (req, res) =>{
    const {name, email,password, role, skills=[]} = req.body
    console.log("Signup request received", {email, skills})
    try{
       const hashed = await bcrypt.hash(password,10);
       
       const user = await User.create({name, email, password: hashed, skills, role: role || "user"});


         console.log("User created successfully", {email, skills});
        //firing inngest
        await inngest.send({
            name: 'user/signup',
            data: {
                email: user.email
            }
        }).catch((error) => {
            console.error("Error sending inngest event", error.message)
            });

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_SECRET
        );

        res.json({user, token});

    }  catch(error) {
          res.status(500).json({error: "Signup failed",
            details: error.message
          });
    }
}


export const login = async (req, res) =>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
       // console.log(user)
        if(!user) return res.status(401).json({error:'User not found'});

       const isMatch = await bcrypt.compare(password,user.password)
       //console.log("Password match status", isMatch)
        
       if(!isMatch) return res.status(401).json({error:"Password didnt match"})

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_SECRET
        );

        res.json({user, token});

    }  catch(error) {
          res.status(500).json({error: "Login failed",
            details: error.message
          });
    }
}


export const logout = async (req, res) =>{
    
    try{
        const token = req.headers.authorization.split(" ")[1]

        if(!token) return res.status(401).json({error:"Unauthorised"})

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded)=>{
            if(error) {
                return res.status(401).json({error:"Unauthorised"})
            }

            res.json({message:"Logout success"})
        })

    }  catch(error) {
          res.status(500).json({error: "Login failed",
            details: error.message
          });
    }
}


export const updateUser = async (req,res) => {
     const {name,email, skills=[], role} = req.body
     console.log("Update user request received", {email, skills, role})
     try {
        // if(req.user?.role !== "admin") {
        //     return res.status(403).json({error:"Forbidden"})
        // }
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error:"User not found"})
        
         await User.updateOne({email}, 
            {name: name, skills: skills.length ? skills : user.skills, role})

        const updateUser = await User.findOne({email}).select("-password")
        if(!updateUser) return res.status(404).json({error:"User not found after update"})

        return res.json({messgae:"User updated successfully", data: updateUser});

     } catch (error) {
        res.status(500).json({error: "Update failed",
            details: error.message
          });
     }
}

export const getUser = async (req,res) => {
      try {
        if(req.user.role !== "admin") {
            return res.status(403).json({error:"Forbidden"})
        }
        const users = await User.find().select("-password")
        return res.json(users)
      } catch (error) {
         res.status(500).json({error: "User find failed",
            details: error.message
          });
      }
}

export const getNonUser = async (req,res) => {
      try {
        if(req.user.role !== "admin") {
            return res.status(403).json({error:"Forbidden"})
        }
        const users = await User.find({role: { $nin: ["user"] }}).select("-password")
        return res.json(users)
      } catch (error) {
         res.status(500).json({error: "User find failed",
            details: error.message
          });
      }
}