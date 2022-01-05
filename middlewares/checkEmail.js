const userModel=require('../models/User')
const checkExistEmail=async(req,res,next)=>{
const email=req.body.email;
try{
const user=await userModel.findOne({email:email})
if(user){
return res.status(409).json({message:"Email Id already exist",success:false});
}
next();
}catch(err){
return res.status(400).json({message:"Something went wrong",err:err})
}
}
module.exports=checkExistEmail;