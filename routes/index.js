var express = require('express');
var router = express.Router();
let userModel = require("../models/User")
const bcrypt=require('bcrypt')
const checkEmail=require('../middlewares/checkEmail')
//registring new user
router.post('/register',checkEmail,async(req,res)=>{
  const {name,email,password,role}=req.body
  try{
const encryptPassword=await bcrypt.hash(password,10)
const user=new userModel({
  name,
  email,
  password:encryptPassword,
  role
})
const data=await user.save();
res.status(201).json({message:"user registered successfully",success:true,data:data})
  }catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
  }
})

//login user

router.post('/login', async (req, res, next) =>
{
  let { email, password } = req.body;
try{
  const user=await userModel.findOne({email});
if(!user){
  return res.status(400).json({message:"user doesn't exist",success:false})
}
else{
 const isMatched=await bcrypt.compare(password,user.password)
 if(!isMatched){
   return res.status(400).json({message:"Invalid credentials",success:false})
 }
 else{
   const token=await user.generateToken();
   res.status(200).json({message:'user login successfully',success:true,token,data:user})
 }
}
}catch(err){
  console.log(err);
  return res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
});

module.exports = router;


